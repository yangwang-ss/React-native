/* eslint-disable default-case */
import React from 'react';
import { StatusBar, View, TouchableOpacity, Image, AppState, StyleSheet, Linking } from 'react-native';
import Toast from 'react-native-root-toast';
import { WebView } from 'react-native-webview';
import RNAlibcSdk from 'react-native-alibc-sdk';
import { stringify } from 'qs';
import { NavigationEvents } from 'react-navigation';
import Permissions from 'react-native-permissions';
import WebShare from '@components/WebShare';
import authVerification from '@utils/authVerification';
import Layout from '@constants/Layout';
import { readCount, isTbAuth, getProductUrl, newPeopleShareProducts } from '@api';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Canvas from 'react-native-canvas';
import { connect } from 'react-redux';
import handleCanvas2 from '../../svgImages/share2';
// import ShareImg from '../../svgImages/share2';
import store from '../../store/configureStore';
import fixedBtn from '../../actions/fixedBtn';
import { version } from '../../../package';
import zfbCanvas from '../../svgImages/zfb';
import ShareModal2 from '../../components/ShareModal2';

class webView extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title || '米粒生活',
    headerRight: (
      <View>
        {navigation.state.params.showShare ? (
          <TouchableOpacity onPress={navigation.state.params.openShare}>
            <Image style={{ width: 22, height: 22, marginRight: 16 }} source={require('@assets/icon-course-share.png')} />
          </TouchableOpacity>
        ) : null}
        {!navigation.state.params.showShare && !navigation.state.params.onlyUrl ? (
          <View style={styles.headerLeft}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                paddingLeft: 20,
                paddingRight: 11,
                height: 40,
                justifyContent: 'center',
              }}
              onPress={() => {
                navigation.state.params.reloadPage();
              }}
            >
              <EvilIcons name="refresh" size={35} color="#666" />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    ),
  });

  state = {
    src: '',
    mainTitle: '',
    subTitle: '',
    thumbImage: '',
    address: '',
    showShare: false,
    isLoadCanvas: false,
    jumpTb: false,
  };

  canClick = true;

  componentDidMount() {
    this.props.navigation.setParams({
      // 給導航中增加監聽事件
      goBackPage: this._goBackPage,
      reloadPage: this._reloadPage,
    });
  }

  componentWillUnmount() {
    Toast.hide(this.shareToast);
  }

  // eslint-disable-next-line react/sort-comp
  shareArticle = async () => {
    if (this.canClick) {
      this.canClick = false;
      setTimeout(() => {
        this.canClick = true;
      }, 2000);
      loadingToast = Toast.show('加载中...', {
        duration: 0,
        position: 0,
      });
      const { WeChat } = global;
      const { address, thumbImage, subTitle, mainTitle } = this.state;
      WeChat.isWXAppInstalled()
        .then(async isInstalled => {
          setTimeout(() => {
            Toast.hide(loadingToast);
          }, 800);
          if (isInstalled) {
            try {
              WeChat.shareToSession({
                title: mainTitle, // 主标题
                description: subTitle || '', // 副标题
                thumbImage, // 分享的封面图
                type: 'news',
                webpageUrl: address, // 打开的地址
              });
            } catch (e) {
              if (e instanceof WeChat.WechatError) {
                console.error(e.stack);
              } else {
                throw e;
              }
            }
          } else {
            Toast.show('你还没有安装微信，请安装微信之后再试！');
          }
        })
        .catch(() => {
          setTimeout(() => {
            Toast.hide(loadingToast);
          }, 800);
        });
      Toast.hide(loadingToast);
    }
  };

  async init() {
    if (this.props.datas.position === 9) {
      store.dispatch(fixedBtn({ isShow: false, datas: this.props.datas }));
    }
    global.isShowSearchModal = false;
    // 防止渠道授权物理键返回引起的授权状态不正确的问题
    const authObj =
      (await storage
        .load({
          key: 'tbAuth',
        })
        .catch(e => e)) || {};
    if (authObj && authObj instanceof Object && !authObj.message) {
      if (authObj.isAuth) {
        const newAuthObj = await isTbAuth();
        storage.save({
          key: 'tbAuth',
          data: newAuthObj,
        });
      }
    }

    AppState.addEventListener('change', this._handleAppStateChange);

    const { deviceId, platform, deviceModel, deviceBrand, userAgent } = Layout.device;
    const src = this.props.navigation.getParam('src', '');
    const { params } = this.props.navigation.state;
    // 获取相机和相册权限
    let authority = true;
    if (params.isUpload) {
      const { cameraPermission, photoPermission } = await this.checkCameraAuthority();
      if (cameraPermission !== 'authorized' || photoPermission !== 'authorized') {
        authority = false;
      }
    }

    const { token } =
      (await storage
        .load({
          key: 'token',
        })
        .catch(e => e)) || {};
    const urlParams = {
      deviceId,
      platform,
      deviceModel,
      deviceBrand,
      userAgent,
      version,
    };
    console.log(urlParams);
    this.props.navigation.setParams({ openShare: this.shareArticle });
    if (token) {
      this.needAuth = false;
    }
    if (params.showShare) {
      this.setState({
        mainTitle: params.mainTitle,
        subTitle: params.subTitle,
        thumbImage: params.thumbImage,
        address: params.src,
        src: params.src,
      });
      this.readTime(params.aid);
    } else if (params.onlyUrl) {
      this.setState({ src });
      setTimeout(() => {
        this.setState({
          jumpTb: !!params.jumpTb,
        });
      }, 4000);
    } else {
      const url = `${src}?token=${token}&${stringify(urlParams)}&time=${Date.parse(new Date())}&isApp=1&authority=${authority}`;
      this.setState({ src: url });
    }
  }

  blur() {
    if (this.props.datas.position === 9) {
      store.dispatch(fixedBtn({ isShow: true, datas: this.props.datas }));
    }
    if (this.needAuth) {
      this.setState({ src: '', isLoadCanvas: false });
    }
    global.isShowSearchModal = true;
  }

  _handleAppStateChange = nextAppState => {
    const disabledReload = this.props.navigation.getParam('disabledReload', '');
    if (nextAppState === 'active' && this.refs.webView && this.refs.webView.reload && !disabledReload && !this.state.jumpTb) {
      this.refs.webView.reload();
    }
  };

  checkCameraAuthority = async () => {
    const cameraPermission = await Permissions.request('camera');
    const photoPermission = await Permissions.request('photo');
    return { cameraPermission, photoPermission };
  };

  jumpPage = item => {
    const { type, title, url, id, onlyUrl, jumpTb } = item;
    switch (type) {
      case 1:
        this.props.navigation.push('WebView', { title, src: url, onlyUrl: !!onlyUrl, jumpTb: !!jumpTb });
        break;
      case 2:
        this.props.navigation.navigate(url, { tagId: id });
        break;
      case 3:
        Linking.openURL(url).catch(e => {});
        break;
    }
  };

  async onMessage(e) {
    console.log('RRRRRR===');
    let { data } = e.nativeEvent;
    console.log('data', e.nativeEvent);
    const refresh = this.props.navigation.getParam('refresh', '');
    if (refresh instanceof Function) {
      refresh();
    }
    if (data) {
      try {
        data = JSON.parse(data);
      } catch (err) {
        console.log(err);
        return;
      }
      if (data.isVerifity) {
        this.generalOperation(data);
        return;
      }
      if (data.needAuth) {
        this.props.navigation.navigate('Auth');
        this.needAuth = true;
        return;
      }

      if (data.type === 'tbAuth') {
        this.props.navigation.goBack();
        return;
      }
      // 新人专区
      if (data.type === 'newPeopleToTb') {
        this.checkIsAuth(data.id);
        return;
      }
      // 跳转
      if (data.type === 'jumpPage') {
        this.jumpPage(data.info);
        return;
      }
      if (data.type === 'newPeopleCanvas') {
        const { base64Img } = this.state;
        const { invitationCode } = await storage.load({ key: 'userInfo' }).catch(e => e);
        const shareText = `${data.tkl}${invitationCode}`;
        this.plist = await newPeopleShareProducts();
        if (data.showShare && !base64Img) {
          this.shareToast = Toast.show('分享图片生成中...', {
            duration: 0,
            position: 0,
          });
        }
        this.setState({
          type: data.type,
          shareText,
          url: data.url,
          showShare: data.showShare,
          isLoadCanvas: true,
          shareTitle: data.shareTitle,
          shareDesc: data.shareDesc,
        });
        return;
      }

      if (data.type === 'zfb') {
        const { base64Img } = this.state;
        const { invitationCode } = await storage.load({ key: 'userInfo' }).catch(e => e);
        const shareText = `${data.tkl}${invitationCode}`;
        if (data.showShare && !base64Img) {
          this.shareToast = Toast.show('分享图片生成中...', {
            duration: 0,
            position: 0,
          });
        }
        this.setState({
          type: data.type,
          shareText,
          url: data.url,
          showShare: data.showShare,
          isLoadCanvas: true,
          shareTitle: data.shareTitle,
          shareDesc: data.shareDesc,
        });
        return;
      }

      if (data.type === 'onlyShareUrl') {
        const { invitationCode } = await storage.load({ key: 'userInfo' }).catch(e => e);
        const shareText = `${data.tkl}${invitationCode}`;
        this.setState({
          type: data.type,
          shareText,
          url: data.url,
          isLoadCanvas: false,
          shareTitle: data.shareTitle,
          shareDesc: data.shareDesc,
          nameIsUrl: data.nameIsUrl,
        });
      }

      if (data && data.pid) {
        this.props.navigation.navigate('Detail', { pid: data.pid });
      }
    }
  }

  /**
   * 公共能力支持
   */
  generalOperation = ({ isShare, isJump, shareInfo = {}, jumpInfo = {}, isPop }) => {
    if (isShare) {
      this.setState({
        ...shareInfo,
        publicShare: true,
      });
    }
    if (isJump) {
      switch (jumpInfo.type) {
        case 'detail':
          this.props.navigation.navigate('Detail', { pid: jumpInfo.pid, goodsID: jumpInfo.pid });
          break;
        case 'TB':
          RNAlibcSdk.show(
            {
              type: 'url',
              payload: jumpInfo.url,
              openType: 'native',
            },
            (err, info) => {
              if (!err) console.log(info);
              else console.log(err);
            }
          );
          break;
        default:
          this.props.navigation.push(jumpInfo.routeName, jumpInfo.params);
          break;
      }
    }
    if (isPop) {
      this.props.navigation.goBack();
    }
  };

  _goBackPage = () => {
    if (this.state.backButtonEnabled) {
      this.refs.webView.goBack();
    } else {
      // 否則返回到上一個頁面
      this.nav.goBack();
    }
  };

  _reloadPage = () => {
    this.closeShare();
    this.refs.webView.reload();
  };

  // 跳转商品前授权
  async checkIsAuth(id) {
    const isAuth = await authVerification({ navigation: this.props.navigation });
    if (isAuth) {
      const res = await getProductUrl(id);
      if (res) {
        const { coupon_click_url, item_url } = res;
        const path = coupon_click_url || item_url;
        RNAlibcSdk.show(
          {
            type: 'url',
            payload: path,
            openType: 'native',
          },
          (err, info) => {
            if (!err) console.log(info);
            else console.log(err);
          }
        );
      }
    }
  }

  readTime = async id => {
    const res = await readCount(id);
    if (res) {
      console.log('阅读数+1');
    }
  };

  closeShare = () => {
    this.setState({
      showShare: false,
      publicShare: false,
    });
  };

  handleCanvas = async canvas => {
    const { type } = this.state;
    let base64Img = '';
    if (type === 'newPeopleCanvas') {
      base64Img = await handleCanvas2({ canvas, plist: this.plist });
      if (base64Img) {
        Toast.hide(this.shareToast);
        this.setState({
          base64Img,
        });
      }
    }
    if (type === 'zfb') {
      base64Img = await zfbCanvas({ canvas });
      if (base64Img) {
        Toast.hide(this.shareToast);
        this.setState({
          base64Img,
        });
      }
    }
  };

  render() {
    const { src, base64Img, type, data, shareText, url, isLoadCanvas, showShare, shareTitle, shareDesc, jumpTb, nameIsUrl, publicShare, shareTkl, shareImageUrl } = this.state;
    const injectedJavascript = `(function() {
      window.postMessage = function(data) {
        window.ReactNativeWebView.postMessage(data);
      };
    })()`;
    console.log('src====', src);
    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <WebView
          ref="webView"
          source={{ uri: src }}
          useWebKit
          originWhitelist={['http://*', 'https://*']}
          injectedJavaScript={injectedJavascript}
          onMessage={e => this.onMessage(e)}
          isJump={jumpTb}
          // style={{marginTop: 20}}
        />
        {showShare && base64Img && <WebShare closeShare={() => this.closeShare()} base64Img={base64Img} shareText={shareText} url={url} shareTitle={shareTitle} shareDesc={shareDesc} type={type} />}
        {type === 'onlyShareUrl' && <WebShare closeShare={() => this.closeShare()} shareText={shareText} url={url} shareTitle={shareTitle} shareDesc={shareDesc} type={type} nameIsUrl={nameIsUrl} />}
        {publicShare && <ShareModal2 closeShare={() => this.closeShare()} shareTitle={shareTitle} shareText={shareText} shareTkl={shareTkl} shareImageUrl={shareImageUrl} />}
        <View style={styles.canvasWrap}>{isLoadCanvas && <Canvas ref={this.handleCanvas} />}</View>
        <NavigationEvents onDidFocus={() => this.init()} onWillBlur={() => this.blur()} />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  isShow: state.fixedBtn.isShow,
  datas: state.fixedBtn.datas,
});
export default connect(mapStateToProps)(webView);

const styles = StyleSheet.create({
  qrCode: {
    position: 'absolute',
    zIndex: -1,
    opacity: 0,
  },
  canvasWrap: {
    position: 'absolute',
    zIndex: -1,
    opacity: 0,
  },
});
