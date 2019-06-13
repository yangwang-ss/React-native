/* eslint-disable no-underscore-dangle */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  AppState,
  Clipboard,
  Keyboard,
  Dimensions,
  PanResponder,
  NativeModules,
  Easing,
  Animated,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import { createStackNavigator, createAppContainer, Header } from 'react-navigation';
import * as WeChat from 'react-native-wechat';
import AnalyticsUtil from 'react-native-umeng-analytics';
import CodePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';
import JPush from 'jpush-react-native';
import RNAlibcSdk from 'react-native-alibc-sdk';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { ids } from '@utils/ids';
import Icons from 'react-native-alternate-icons';
import * as Pages from '../pages';
import NavigationService from '../utils/navigationService';
import store from '../store/configureStore';
import updateVersion from '../actions/updateVersion';
import searchAction from '../actions/searchModel';
import UpdateComponent from '../components/Update';
import VipUpModal from '../components/VipUpModal';
import { appVersionControlCheck, checkVersion, getSearchText, getSplashImg2 } from '../services/api';
import AlertModal from '../components/AlertModal';
import PushRouter from '../utils/pushRouter';
import SplashView from '../components/SplashView';
import Layout from '../constants/Layout';
import FixedBtn from '../components/FixedBtn';
import splashView from '../actions/splashView';
import GodModel from '../components/GodModel';
import PushModel from '../components/PushModel';

const LANDSCAPE = 'landscape';
const PORTRAIT = 'portrait';
const { DevMenu } = NativeModules;
const panResponder = PanResponder.create({
  onStartShouldSetPanResponder: (evt, gestureState) => {
    if (__DEV__ && Platform.OS === 'ios' && gestureState.numberActiveTouches === 3) {
      DevMenu.show();
    }
  },
});
const getOrientation = () => {
  const { width, height } = Dimensions.get('window');
  return width > height ? LANDSCAPE : PORTRAIT;
};
const getHeaderSafeAreaHeight = () => {
  const orientation = getOrientation();
  if (Platform.OS === 'ios' && orientation === LANDSCAPE && !Platform.isPad) {
    return 32;
  }
  return Header.HEIGHT;
};
const getHeaderHeight = () => {
  let height;
  const orientation = getOrientation();
  height = getHeaderSafeAreaHeight();
  height += isIphoneX() && orientation === PORTRAIT ? 24 : 0;

  return height;
};

const paddingTop = Platform.select({
  ios: isIphoneX() ? 32 : 20,
  android: 20,
});
global.headerHeight = (Platform.OS === 'ios' ? 0 : paddingTop) + getHeaderHeight();
global.statusBarHeight = paddingTop;
type Props = {
  godModelStatus: boolean,
  onCancel: Function,
  godUrl: string,
  setUrl: Function,
  onConfirm: Function,
  updateStatus: number,
  showSplashView: Boolean,
};
const wechatAppKey = 'wx2871f248714d5f58';
class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      splashImg: '',
      splashIcon: '',
      splashImgH: 0,
      splashIconH: 0,
      isPushPermission: true,
    };
  }

  async componentWillMount() {
    this.setSplashView();
    JPush.clearAllNotifications();
    this.initGlobalVar();
    this.bcSDKInit();
    if (Platform.OS !== 'ios') {
      JPush.notifyJSDidLoad(() => {});
    }

    JPush.addReceiveOpenNotificationListener(({ extras }) => {
      if (Platform.OS === 'ios') {
        PushRouter(extras);
      } else {
        PushRouter(JSON.parse(extras));
      }
    });
    // IOS正常版本注释
    const { check } = await checkVersion();
    global.isReview = check;
    if (Platform.OS === 'android') {
      CodePush.disallowRestart();
    }
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.getPhoneState();
    }
    this.initVersionUpdate();
    AppState.addEventListener('change', this._handleAppStateChange);
    this.getClipboardContent();
    this.adModalVisible();
    this.initWeChatSDK();
    this.pushPermissionCheck();
    global.isShowSearchModal = true;
  }

  componentWillUnmount() {
    CodePush.allowRestart();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  getPhoneState = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      ToastAndroid.show('暂无获取手机状态权限！', ToastAndroid.SHORT);
    }
  };

  async getClipboardContent() {
    let alertText = await Clipboard.getString();
    alertText = alertText.replace(/(^\s*)|(\s*$)/g, '');
    const { searchText: prevSearchText = '' } =
      (await storage
        .load({
          key: 'searchText',
        })
        .catch(e => e)) || {};
    console.log(prevSearchText, alertText);
    if (global.isShowSearchModal && alertText && alertText !== 'null' && prevSearchText.replace(/[\r\n]/g, '') !== alertText.replace(/[\r\n]/g, '')) {
      const res = await getSearchText(alertText);
      if (res && res instanceof Object) {
        storage.save({
          key: 'searchText',
          data: { searchText: alertText },
        });
        this.alertInfo = res;
        Keyboard.dismiss();
        store.dispatch(searchAction({ isShow: true, searchText: alertText }));
      }
    }
  }

  getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRouteName(route);
    }
    return route.routeName;
  }

  confirmAlert = () => {
    const { type, value } = this.alertInfo;
    switch (type) {
      case 0:
        if (currentScreen === 'SearchProduct') {
          NavigationService.replace('SearchProduct', { value });
        } else {
          NavigationService.push('SearchProduct', { value });
        }
        break;
      case 1:
        if (!value) break;
        if (currentScreen === 'Detail') {
          NavigationService.replace('Detail', { pid: value });
        } else {
          NavigationService.push('Detail', { pid: value });
        }
        break;
      default:
        break;
    }
    storage.remove({
      key: 'searchText',
    });
    store.dispatch(searchAction({ isShow: false }));
  };

  cancelAlert = () => {
    store.dispatch(searchAction({ isShow: false }));
  };

  adModalVisible = () => {
    storage.save({
      key: 'isIndexAdModal',
      data: true,
    });
  };

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      JPush.clearAllNotifications();
      this.getClipboardContent();
      this.pushPermissionCheck();
    } else {
      this.cutIcon();
    }
  };

  // 更换icon
  cutIcon = async () => {
    const { userId } =
      (await storage
        .load({
          key: 'storeInfo',
        })
        .catch(e => e)) || '';
    if (userId) {
      const checkId = ids.filter(id => id === parseInt(userId));
      if (checkId.length > 0) {
        const { CustomIconModule } = NativeModules;
        if (Platform.OS === 'android') {
          CustomIconModule.cutIcon(userId, true);
        } else {
          Icons.setIconName(userId);
        }
      }
    }
  };

  initWeChatSDK = async () => {
    await WeChat.registerApp(wechatAppKey);
    global.WeChat = WeChat;
    const isInstalled = await WeChat.isWXAppInstalled();
    storage.save({
      key: 'WXStatus',
      data: { isInstalled },
    });
  };

  pushPermissionCheck = async () => {
    const pushModelCloseTime =
      (await storage
        .load({
          key: 'pushModelCloseTime',
        })
        .catch(e => e)) || Date.parse(new Date());
    const { isNewMember } =
      (await storage
        .load({
          key: 'userInfo',
        })
        .catch(e => e)) || {};
    if ((typeof pushModelCloseTime !== 'number' || Date.parse(new Date()) - pushModelCloseTime > 8640000) && !isNewMember) {
      JPush.hasPermission(res => {
        this.setState({
          isPushPermission: res,
        });
        if (!res) {
          storage.save({
            key: 'pushModelCloseTime',
            data: Date.parse(new Date()),
          });
        }
      });
    }
  };

  bcSDKInit = () => {
    RNAlibcSdk.init('', false, err => {
      if (!err) {
        console.log('init success');
      } else {
        console.log(err);
      }
    });
  };

  setSplashView = async () => {
    const res = await getSplashImg2();
    const success = res && res.img && res.img.length;
    if (success) {
      const {
        img: [splashImg, splashIcon],
        storeDesc,
        storeName,
      } = res;
      this.setState({
        splashImg,
        splashIcon,
        storeName,
        storeDesc,
      });
      store.dispatch(splashView({ showSplashView: true }));
    } else {
      SplashScreen.hide();
    }
  };

  // 如果有更新的提示
  syncImmediate = () => {
    CodePush.checkForUpdate().then(update => {
      if (update) {
        if (Platform.OS === 'android') {
          store.dispatch(
            updateVersion({
              status: update.isMandatory ? 2 : 1,
              msg: update.description || '新功能，新体验！',
              hotUpdate: true,
            })
          );
        } else {
          CodePush.sync({
            installMode: CodePush.InstallMode.ON_NEXT_RESUME,
          });
        }
      }
    });
  };

  initGlobalVar = () => {
    global.currentScreen = '';
    global.isReview = false;
    global.AnalyticsUtil = AnalyticsUtil;
  };

  _onNavigationStateChange = (prevState, currentState) => {
    const currentScreen = this.getActiveRouteName(currentState);
    const prevScreen = this.getActiveRouteName(prevState);
    if (prevScreen !== currentScreen) {
      AnalyticsUtil.beginLogPageView(currentScreen);
      global.currentScreen = currentScreen;
    }
  };

  initVersionUpdate = async () => {
    const result = await appVersionControlCheck();
    if (result instanceof Object) {
      store.dispatch(
        updateVersion({
          status: result.type,
          msg: result.content,
          url: result.downloadUrl,
          downloadType: result.downloadType,
        })
      );
    }
    // 热更初始化
    this.syncImmediate();
  };

  onPushClose = () => {
    this.setState({ isPushPermission: true });
  };

  render() {
    const { splashImg, splashIcon, storeDesc, storeName, isPushPermission } = this.state;
    const { godModelStatus, onCancel, godUrl, setUrl, onConfirm, updateStatus, showSplashView } = this.props;
    return (
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <HomeStack
          screenProps={{ statusBarHeight: StatusBar.currentHeight }}
          onNavigationStateChange={(prevState, currentState) => this._onNavigationStateChange(prevState, currentState)}
          ref={navigatorRef => NavigationService.setTopLevelNavigator(navigatorRef)}
        />
        <UpdateComponent />
        <VipUpModal />
        <FixedBtn />
        {showSplashView && <SplashView splashImg={splashImg} splashIcon={splashIcon} storeDesc={storeDesc} storeName={storeName} />}
        {updateStatus !== 1 && <AlertModal confirmAlert={this.confirmAlert} cancelAlert={this.cancelAlert} />}
        {godModelStatus && <GodModel onCancel={onCancel} godUrl={godUrl} setUrl={setUrl} onConfirm={onConfirm} godModelStatus={godModelStatus} />}
        {!isPushPermission && <PushModel onClose={this.onPushClose} />}
      </View>
    );
  }
}

const codePushOptions = {
  // 设置检查更新的频率
  // ON_APP_RESUME APP恢复到前台的时候
  // ON_APP_START APP开启的时候
  // MANUAL 手动检查
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  updateDialog: null,
};
const MyApp = CodePush(codePushOptions)(App);

const HomeStack = createAppContainer(
  createStackNavigator(Pages, {
    initialRouteName: 'MainPage',
    defaultNavigationOptions: () => {
      return {
        headerStyle: {
          paddingTop,
          height: Platform.OS === 'ios' ? headerHeight - paddingTop : headerHeight,
          borderBottomWidth: 1,
          borderBottomColor: '#f2f2f2',
          elevation: 0,
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          alignSelf: 'center',
          textAlign: 'center',
          flex: 1,
        },
        headerRight: React.createElement(View, null, null),
        headerBackTitle: null,
      };
    },
    transitionConfig: () => {
      return {
        transitionSpec: {
          duration: 450,
          easing: Easing.out(Easing.poly(4)),
          timing: Animated.timing,
          useNativeDriver: true,
        },
        screenInterpolator: sceneProps => {
          const { layout, position, scene } = sceneProps;

          const thisSceneIndex = scene.index;
          const width = layout.initWidth;

          const translateX = position.interpolate({
            inputRange: [thisSceneIndex - 1, thisSceneIndex],
            outputRange: [width, 0],
          });

          return { transform: [{ translateX }] };
        },
      };
    },
  })
);

export default MyApp;
