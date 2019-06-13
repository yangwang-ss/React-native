import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Platform, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, RefreshControl, StatusBar, ToastAndroid, BackHandler, NetInfo } from 'react-native';
import Toast from 'react-native-root-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationEvents } from 'react-navigation';
import RNAlibcSdk from 'react-native-alibc-sdk';
import JPush from 'jpush-react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import Layout from '@constants/Layout';
import LoginTip from '@components/LoginTip';
import { tbbcBinding, isTbAuth, getAdImgs, appErrorLog, getInitStore } from '@api';
import NetwokErr from '../NetwokErr';
import styles from './indexStyle';
import TopBarComponent from './TopTabBarComponents';

type Props = {
  navigation: Object,
};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      curTabId: 'recommend',
      isConnected: true,
      isShowLogin: false,
      adImgs: {},
      isModalAd: false,
      storeInfo: {},
    };
  }

  async componentDidMount() {
    AnalyticsUtil.beginLogPageView('Home');
    this.netStatus();
    this.init();
    this.getAdImgs();
    const isIndexAdModal =
      (await storage
        .load({
          key: 'isIndexAdModal',
        })
        .catch(e => e)) || false;
    this.setState({
      isModalAd: isIndexAdModal,
    });
    const { token } =
      (await storage
        .load({
          key: 'token',
        })
        .catch(e => e)) || {};
    if (token) {
      this.tbbcBinding();
    }
    const alias = await new Promise(resolve => {
      JPush.getAlias(({ alias }) => {
        resolve(alias);
      });
    });
    if (!alias) {
      const registrationID = await new Promise(resolve => {
        JPush.getRegistrationID(id => {
          resolve(id);
        });
      });
      if (registrationID) {
        JPush.setAlias(registrationID, ({ alias }) => {
          if (alias) {
            this.saveAlias(alias);
          }
        });
      }
    } else {
      this.saveAlias(alias);
    }

    if (token) {
      isTbAuth().then(result => {
        storage.save({
          key: 'tbAuth',
          data: result,
        });
      });
    }
  }

  // 店铺信息
  async getInitStore() {
    const res = await getInitStore();
    if (res) {
      this.setState({
        storeInfo: res,
      });
    }
  }

  // 广告位
  async getAdImgs() {
    const res = await getAdImgs();
    console.log('getAdImgs===', res);
    if (res && res.length) {
      const { adImgs } = this.state;
      res.map(item => {
        if (item.position === 3) {
          adImgs.indexAd = item;
        } else if (item.position === 4) {
          adImgs.indexModalAd = item;
        }
      });
      this.setState({
        adImgs,
      });
    }
  }

  bannerJump = (item, str) => {
    console.log('bannerJump===', str, item);
    const { navigation } = this.props;
    // 类型0，单纯图片，1 h5地址(自己写的h5地址)，2 商品类目列表商品界面，3, 9.9包邮，4 淘宝地址(跳出app去淘宝)，5 淘抢购（废弃）,  6 淘宝地址（app内 嵌入淘宝页面）7，话费充值 8,商品详情
    const { type, id, title, value, params } = item;
    AnalyticsUtil.eventWithAttributes(`${str}_click`, { title });
    if (str === 'indexAd') {
      this.setState({
        isModalAd: false,
      });
      storage.save({
        key: 'isIndexAdModal',
        data: false,
      });
    }
    switch (type) {
      case 1:
        navigation.navigate('WebView', { title, id, src: value });
        break;
      case 2:
        if (str === 'category') {
          navigation.navigate('CategorySecond', {
            title,
            id: value,
          });
        } else {
          navigation.navigate(value, { title, id, ...params });
        }
        break;
      case 3:
        navigation.navigate('Nine', { title });
        break;
      case 4:
        RNAlibcSdk.show(
          {
            type: 'url',
            payload: value,
            openType: 'native',
          },
          (err, info) => {
            if (!err) console.log(info);
            else console.log(err);
          }
        );
        break;
      case 6:
        navigation.navigate('TWebView', { title, id, src: value });
        break;
      case 7:
        navigation.navigate('ReachargeIndex', { title });
        break;
      case 8:
        navigation.navigate('Detail', { pid: value });
        break;
      default:
        break;
    }
  };

  searchJump = () => {
    AnalyticsUtil.event('enter_search');
    this.props.navigation.navigate('SearchIndex');
    // this.props.navigation.navigate('ShopOwnerList');
  };

  shoppingCartJump = async () => {
    const isLogin = await new Promise(resolve => {
      RNAlibcSdk.isLogin((err, isLogin) => {
        if (!err) {
          resolve(isLogin);
        }
      });
    });
    if (isLogin) {
      AnalyticsUtil.event('enter_cart');
      this.props.navigation.navigate('Cart', { title: '购物车', type: 'cart' });
    } else {
      RNAlibcSdk.login(err => {
        if (!err) {
          AnalyticsUtil.event('enter_cart');
          this.props.navigation.navigate('Cart', {
            title: '购物车',
            type: 'cart',
          });
        } else if (err.code === 1004) {
          Toast.show('授权已取消！');
        } else {
          appErrorLog(err);
          Toast.show('授权失败，请稍后重试！');
        }
      });
    }
  };

  tbbcBinding = async () => {
    // 唤起手淘app进行授权登录， 获取用户个人信息。
    const isLogin = await new Promise(resolve => {
      RNAlibcSdk.isLogin((err, isLogin) => {
        if (!err) {
          resolve(isLogin);
        }
      });
    });
    if (isLogin) {
      RNAlibcSdk.getUser((err, userInfo) => {
        if (!err) {
          tbbcBinding(userInfo);
        }
      });
    }
  };

  closeModalAd = () => {
    this.setState({
      isModalAd: false,
    });
    storage.save({
      key: 'isIndexAdModal',
      data: false,
    });
  };

  /**
   * 接口请求
   */

  /**
   * 初始化
   */
  init = () => {
    this.initData();
    this.getInitStore();
  };

  initData = () => {
    this.setState({
      storeInfo: {},
    });
  };

  modifyLogin = () => {
    this.setState({
      isShowLogin: false,
    });
  };

  onBackButtonPressAndroid = () => {
    if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
      // 按第二次的时候，记录的时间+2000 >= 当前时间就可以退出
      // 最近2秒内按过back键，可以退出应用。
      BackHandler.exitApp(); // 退出整个应用
      return false;
    }
    this.lastBackPressed = Date.now(); // 按第一次的时候，记录时间
    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT); // 显示提示信息
    return true;
  };

  saveAlias = async alias => {
    const userInfo =
      (await storage
        .load({
          key: 'userInfo',
        })
        .catch(e => e)) || {};
    userInfo.alias = alias;
    storage.save({
      key: 'userInfo',
      data: userInfo,
    });
  };

  async isShowLogin() {
    let boo = false;
    const { token } =
      (await storage
        .load({
          key: 'token',
        })
        .catch(e => e)) || {};
    if (!token) {
      boo = true;
    } else {
      boo = false;
    }
    this.setState({
      isShowLogin: boo,
    });
  }

  netStatus() {
    handleFirstConnectivityChange = isConnected => {
      if (!isConnected) {
        Toast.show('网络连接已断开，检查网络后重试！');
      } else {
        if (!this.state.isConnected) {
          this.init();
        }
        NetInfo.isConnected.removeEventListener('change', handleFirstConnectivityChange);
      }
      this.setState({
        isConnected,
      });
    };
    NetInfo.isConnected.addEventListener('change', handleFirstConnectivityChange);
  }

  render() {
    const { curTabId, storeInfo, isShowLogin, adImgs, isModalAd, isConnected } = this.state;
    const { navigation } = this.props;
    return (
      <AndroidBackHandler onBackPress={() => this.onBackButtonPressAndroid()} style={styles.container}>
        <StatusBar barStyle="light-content" />
        {curTabId === 'recommend' && <LinearGradient style={[styles.linearGradient, { zIndex: 0 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#e63cb3', '#f03066']} />}
        <View
          style={[
            styles.searchBox,
            {
              marginTop: global.statusBarHeight + 10 || 0,
            },
          ]}
        >
          <View style={styles.headBox}>
            <TouchableOpacity style={styles.scanIcon} activeOpacity={Layout.activeOpacity} />
            <Text style={styles.shopName}>{storeInfo.name || '米粒生活'}</Text>
            <TouchableOpacity onPress={() => this.shoppingCartJump()} activeOpacity={Layout.activeOpacity}>
              <Image style={styles.shoppingCart} source={require('@assets/icon-shoppingCart.png')} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.searchInput} onPress={() => this.searchJump()} activeOpacity={Layout.activeOpacity}>
            <Image style={styles.searchIcon} source={require('@assets/icon-search.png')} />
            <Text style={styles.searchText}>请输入商品名或粘贴淘宝商品标题</Text>
          </TouchableOpacity>
        </View>
        {isConnected ? <TopBarComponent navigation={navigation} init={this.init} /> : <NetwokErr />}
        <LinearGradient
          style={{
            height: global.statusBarHeight + 10,
            position: 'absolute',
            top: 0,
            width: '100%',
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#e63cb3', '#f03066']}
        />

        {isShowLogin && <LoginTip navigation={navigation} modifyLogin={this.modifyLogin} getInitStore={this.getInitStore.bind(this)} />}
        {isModalAd && adImgs.indexModalAd && adImgs.indexModalAd.imageUrl && (
          <View style={styles.adModalWrap}>
            <View style={styles.adModalBg} />
            <View style={styles.adModalBox}>
              <TouchableOpacity style={styles.adModalImgWrap} activeOpacity={1} onPress={() => this.bannerJump(adImgs.indexModalAd, 'indexAd')}>
                <Image style={styles.adModalImg} source={{ uri: adImgs.indexModalAd.imageUrl }} />
              </TouchableOpacity>
              <View style={styles.adModalCloseBox}>
                <View style={styles.adModalCloseLine} />
                <TouchableOpacity style={styles.adModalCloseBtn} onPress={this.closeModalAd}>
                  <Ionicons name="ios-close-circle-outline" size={44} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <NavigationEvents onDidFocus={() => this.isShowLogin()} />
      </AndroidBackHandler>
    );
  }
}
