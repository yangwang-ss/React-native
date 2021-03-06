/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { StatusBar, View, StyleSheet, Text, TouchableOpacity, Platform, AppState, Clipboard, NativeModules, NativeEventEmitter, ImageBackground, Image, ActivityIndicator } from 'react-native';
import Toast from 'react-native-root-toast';
import LinearGradient from 'react-native-linear-gradient';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import QRCode from 'react-native-qrcode-svg';
import fetch_blob from 'rn-fetch-blob';
import RNAlibcSdk, { AlibcTradeWebView } from 'react-native-alibc-sdk';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { NavigationEvents } from 'react-navigation';
import Layout from '../constants/Layout';
import ShareBox from '../components/ShareBox';
import drawText from '../utils/drawText';
import saveFile from '../utils/saveFile';
import { expainUrl, validUrls, getTKL, isTbAuth, shoppingCartCount } from '../services/api';
import authVerification from '../utils/authVerification';

let NativeModule = null;
if (Platform.OS === 'ios') {
  const nativeBridge = NativeModules.RNEventEmitter; // 你的类名
  NativeModule = new NativeEventEmitter(nativeBridge);
}
// 1 查找中  2 查找成功 3 查找失败
const SELECT_NO = 0;
const SELECT_ING = 1;
const SELECT_SUCCESS = 2;
const SELECT_FAIL = 3;
export default class Cart extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: '省钱购物车',
      headerLeft: (
        <View style={styles.headerLeft}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              paddingRight: 11,
              height: 40,
              width: 40,
              justifyContent: 'center',
            }}
            onPress={() => {
              if (typeof navigation.state.params.goBackPage === 'function') {
                navigation.state.params.goBackPage();
              } else {
                navigation.goBack();
              }
            }}
          >
            <EvilIcons name="chevron-left" size={40} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.goBack();
            }}
            style={{ paddingRight: 20, height: 40, justifyContent: 'center' }}
          >
            <Text style={{ color: '#666', fontSize: 16 }}>关闭</Text>
          </TouchableOpacity>
        </View>
      ),
      headerRight: (
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
              if (typeof navigation.state.params.reloadPage === 'function') {
                navigation.state.params.reloadPage();
              }
            }}
          >
            <EvilIcons name="refresh" size={35} color="#666" />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.nav = this.props.navigation;
  }

  state = {
    src: '',
    showShareBox: false,
    shareImageUrl: '',
    shareTitle: '米粒生活',
    shareText: '',
    codeUrl: '',
    qrCodeInfo: 'https://www.vxiaoke360.com',
    shareImg: '',
    isSave: false,
    isLoadCanvas: false,
    isShareClick: false,
    canShowShareToast: true,
    prdTKL: '',
    authUrl: '',
  };

  filterUrls = [];

  // 获取二维码ref
  getQRcode = () => {
    let time = null;
    if (this.svg && this.svg.toDataURL) {
      clearTimeout(time);
      setTimeout(() => {
        this.getQrcodeUrl();
      }, 100);
    } else {
      time = setTimeout(() => {
        this.getQRcode();
      }, 1);
    }
  };

  getQrcodeUrl = () => {
    if (this.svg && this.svg.toDataURL) {
      this.svg.toDataURL(this.qrcodeCallback);
    }
  };

  qrcodeCallback = dataURL => {
    this.setState({
      codeUrl: `data:image/jpeg;base64,${dataURL}`,
    });
  };

  // canvas图片写入
  loadedImg = image => new Promise(resolve => image.addEventListener('load', resolve));

  downloadImage(url) {
    return new Promise(resolve => {
      fetch_blob
        .config({
          fileCache: true,
        })
        .fetch('GET', url)
        // the image is now dowloaded to device's storage
        .then(resp => {
          // the image path you can use it directly with Image component
          imagePath = resp.path();
          return resp.readFile('base64');
        })
        .then(base64Data => {
          resolve(`data:image/jpeg;base64,${base64Data}`);
        });
    });
  }

  // canvas分享图
  handleCanvas = async canvas => {
    const { detailData, codeUrl } = this.state;
    this.setState({
      isLoadCanvas: true,
    });
    if (!(canvas instanceof Object)) {
      return;
    }
    canvas.width = 375;
    canvas.height = 660;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 375, 480);

    ctx.fillStyle = '#F4F4F4';
    ctx.fillRect(0, 480, 375, 660);
    ctx.save();

    let icons = '';
    if (detailData.source === 0) {
      icons = 'https://image.vxiaoke360.com/Foij5K0p3eOq-Ag5pIoldEmOFR6w';
    } else {
      icons = 'https://image.vxiaoke360.com/FinWWzlfd8MqKyrEQCqPs8ZGBZnG';
    }
    const image = new CanvasImage(canvas);
    image.src = await this.downloadImage(icons);
    image.addEventListener('load', () => {
      ctx.drawImage(image, 16, 16, 14, 14);
    });
    drawText(ctx, detailData.title, 25, '14px PingFangSC-Medium', '#333', 38, 28);
    ctx.save();

    ctx.fillStyle = '#FC4277';
    ctx.font = '12px PingFangSC-Semibold';
    ctx.fillText('￥', 16, 88);

    ctx.font = '26px PingFangSC-Semibold';
    ctx.fillText(detailData.discountPrice, 30, 88);
    ctx.fill();
    ctx.save();
    const quanX = detailData.discountPrice.indexOf('.') > 0 ? detailData.discountPrice.length * 25 + 15 : detailData.discountPrice.length * 25 + 20;
    const quanImage = new CanvasImage(canvas);
    if (detailData.couponPrice) {
      quanImage.src = await this.downloadImage('https://image.vxiaoke360.com/Ftw7AdGaaraQToj-1R7STc-EjeRg');
    } else {
      quanImage.src = await this.downloadImage('https://image.vxiaoke360.com/FmkKVVrnFd0ApmgUZQr_5Z2HNMR9');
    }
    quanImage.addEventListener('load', () => {
      ctx.drawImage(quanImage, quanX, 74, 42, 16);
    });
    if (detailData.couponPrice) {
      const quanPriceImage = new CanvasImage(canvas);
      quanPriceImage.src = await this.downloadImage('https://image.vxiaoke360.com/Fp8BgDo_R4r9W5qsmTKiTpfJVJ-8');
      quanPriceImage.addEventListener('load', () => {
        ctx.drawImage(quanPriceImage, 248, 70, 110, 32);
        ctx.fillStyle = '#fff';
        ctx.font = '16px PingFangSC-Medium';
        ctx.fillText(`￥${detailData.couponPrice}`, 293, 90);
        ctx.fill();
      });
    }
    ctx.save();

    ctx.fillStyle = '#999';
    ctx.font = '12px PingFangSC-Regular';
    ctx.fillText(`￥${detailData.zkFinalPrice}原价   月销${detailData.salesNum}`, 16, 108);
    ctx.fill();
    ctx.save();
    const productImage = new CanvasImage(canvas);
    productImage.src = await this.downloadImage(detailData.picUrl);
    await this.loadedImg(productImage);
    ctx.drawImage(productImage, 16, 120, 343, 343);
    ctx.save();

    const priceLabel = new CanvasImage(canvas);
    priceLabel.src = await this.downloadImage('https://image.vxiaoke360.com/Fs4-JhfATTPyIx1OKMm0Vn94KCrI');

    await this.loadedImg(priceLabel);
    ctx.drawImage(priceLabel, 180, 358, 188, 90);

    let qText = '';
    let qWidth = 264;
    if (detailData.couponPrice) {
      qText = '券后￥';
    } else {
      qText = '优惠价￥';
      qWidth = 280;
    }
    ctx.fillStyle = '#fff';
    ctx.font = '16px PingFangSC-Regular';
    ctx.fillText(qText, 216, 420);
    ctx.fill();
    ctx.save();
    ctx.font = '32px PingFangSC-Medium';
    ctx.fillText(detailData.discountPrice, qWidth, 420);
    ctx.fill();

    const codeImg = new CanvasImage(canvas);
    codeImg.src = codeUrl;

    await this.loadedImg(codeImg);
    ctx.drawImage(codeImg, 118, 490, 130, 130);
    ctx.save();

    ctx.font = '14px PingFangSC-Regular';
    ctx.fillStyle = '#666';
    ctx.fillText('长按识别二维码进入', 92, 648);
    ctx.fill();
    ctx.font = '14px PingFangSC-Medium';
    ctx.fillStyle = '#FC4277';
    ctx.fillText('米粒生活', 218, 648);
    ctx.fill();
    try {
      canvas.toDataURL('image/jpeg').then(async data => {
        const baseImg = data.substr(1, data.length - 2);
        this.setState(
          {
            shareImg: baseImg,
          },
          () => this.checkShareBtnStatus()
        );
      });
    } catch (error) {
      console.log(2, error);
    }
  };

  checkShareBtnStatus = async () => {
    const { isShareClick } = this.state;
    if (isShareClick) {
      const res = await saveFile({
        fileType: 'base64',
        file: this.state.shareImg,
        location: 'cache',
      });
      if (res) {
        this.setState({
          shareImageUrl: res,
          showShareBox: true,
          canClick: true,
          isSave: true,
          canShowShareToast: true,
        });
        Toast.hide(this.shareToast);
      } else {
        Toast.show('请开启手机权限');
      }
    }
  };

  onPressShare = async () => {
    const { prdTKL } = this.state;
    const isAuth = await authVerification({
      navigation: this.props.navigation,
    });
    if (isAuth) {
      this.setState({
        isShareClick: true,
      });
      if (!prdTKL) {
        // 保证接口请求一次
        this.getPrdTKL();
      }
      this.getPrdShareImg();
    }
  };

  onBackButtonPressAndroid = () => {
    this._goBackPage();
    return true;
  };

  async getCanvas() {
    const { isParent, pid, userId } =
      (await storage
        .load({
          key: 'userInfo',
        })
        .catch(e => e)) || {};
    const { token } =
      (await storage
        .load({
          key: 'token',
        })
        .catch(e => e)) || {};
    if (token && isParent) {
      const { id } = this.state.detailData;
      this.setState(
        {
          qrCodeInfo: `https://www.vxiaoke360.com/H5/mlsh-detail/index.html?id=${id}&shareUserId=${userId}`,
        },
        () => {
          this.getQRcode();
        }
      );
    }
  }

  async getPrdShareImg() {
    if (!this.state.isSave) {
      if (this.state.canShowShareToast) {
        this.setState({
          canShowShareToast: false,
        });
        this.shareToast = Toast.show('分享图片生成中...', {
          duration: 0,
          position: 0,
        });
      }
      if (this.state.shareImg) {
        const res = await saveFile({
          fileType: 'base64',
          file: this.state.shareImg,
          location: 'cache',
        });
        if (res) {
          this.setState({
            shareImageUrl: res,
            showShareBox: true,
            canClick: true,
            isSave: true,
            canShowShareToast: true,
          });
          Toast.hide(this.shareToast);
        } else {
          Toast.show('请开启手机权限');
        }
        return;
      }

      if (!this.state.isLoadCanvas) {
        const { pid, userId } =
          (await storage
            .load({
              key: 'userInfo',
            })
            .catch(e => e)) || {};
        const { id } = this.state.detailData;
        this.setState(
          {
            qrCodeInfo: `https://www.vxiaoke360.com/H5/mlsh-detail/index.html?id=${id}&shareUserId=${userId}`,
          },
          () => {
            this.getQRcode();
          }
        );
      }
    } else {
      this.setState({
        showShareBox: true,
      });
    }
  }

  // 分享
  closeShare = () => {
    this.setState({
      showShareBox: false,
    });
  };

  async componentWillMount() {
    const src = this.props.navigation.getParam('src', '');
    const type = this.props.navigation.getParam('type', '');

    console.log('porps', src);
    this.filterUrls = (await validUrls()) || [];
    this.setState({ src, type });
    this.props.navigation.setParams({
      goBackPage: this._goBackPage,
      reloadPage: this._reloadPage,
    });
  }

  componentDidMount() {
    if (NativeModule) {
      NativeModule.addListener('getCartData', data => this.onCartData(data));
      NativeModule.addListener('onMessage', data => this.onMessage(data));
    }
    AppState.addEventListener('change', this._handleAppStateChange);

    setTimeout(() => {
      this.setState({
        isLoadWebView: true,
      });
    }, 500);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    clearInterval(this.timer);
    clearInterval(this.timer2);
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this.init();
    }
  };

  _onNavigationStateChange = ({ url, canGoBack, loading }) => {
    this.urlLoaded = !loading;
    if (this.urlLoaded) {
      const result = this.filterUrls.filter(item => url.indexOf(item) > -1);
      if (result.length) {
        this.setState({
          detailUrl: url,
          isShow: true,
        });
      } else {
        this.setState({
          isShow: false,
        });
      }
    }

    this.setState({
      backButtonEnabled: canGoBack,
    });
  };

  _goBackPage = () => {
    if (this.state.backButtonEnabled) {
      this.setState({
        detailUrl: '',
        isShow: false,
        detailData: '',
        showShareBox: false,
        shareImageUrl: '',
        codeUrl: '',
        shareImg: '',
        isSave: false,
        isLoadCanvas: false,
        isShareClick: false,
        canShowShareToast: true,
      });
      Toast.hide(this.shareToast);
      this.refs.webView.goBack();
    } else {
      // 否則返回到上一個頁面
      this.nav.goBack();
    }
  };

  _reloadPage = () => {
    if (this.refs.webView && this.refs.webView.reload) {
      this.refs.webView.reload();
    }
    if (this.selectCouponStatus !== SELECT_ING) {
      this.isLoadedCartData = false;
      this.intercept = false;
    }
  };

  expainUrl = async () => {
    const { detailUrl } = this.state;
    if (detailUrl) {
      const detailData = await expainUrl(detailUrl);
      this.setState({
        detailData,
        shareText: detailData.title,
      });
      this.getCanvas();
    }
  };

  init = async () => {
    this.expainUrl();
    // 防止渠道授权物理键返回引起的授权状态不正确的问题
    const authObj =
      (await storage
        .load({
          key: 'tbAuth',
        })
        .catch(e => e)) || {};
    if (authObj && authObj instanceof Object && !authObj.message) {
      if (authObj.isAuth) {
        this._reloadPage();
        const newAuthObj = await isTbAuth();
        storage.save({
          key: 'tbAuth',
          data: newAuthObj,
        });
      }
    }
  };

  onPressBuy = async () => {
    Clipboard.setString('');
    const isAuth = await authVerification({
      navigation: this.props.navigation,
    });
    if (isAuth) {
      const { tbkCouponConvert, id } = this.state.detailData;
      const { coupon_click_url, item_url, coupon_info } = tbkCouponConvert || {};
      if (!coupon_click_url && !item_url) {
        RNAlibcSdk.show(
          {
            type: 'detail',
            payload: id,
            openType: 'native',
          },
          (err, info) => {
            if (!err) console.log(info);
            else console.log(err);
          }
        );
      } else {
        RNAlibcSdk.show(
          {
            type: 'url',
            payload: (coupon_info && coupon_click_url) || item_url,
            openType: 'native',
          },
          (err, info) => {
            if (!err) console.log(info);
            else console.log(err);
          }
        );
      }
    }
  };

  // 获取淘口令
  async getPrdTKL() {
    const { id } = this.state.detailData;
    const res = await getTKL(id);
    console.log('获取淘口令');
    if (res) {
      this.setState({
        prdTKL: res,
      });
    }
    return true;
  }

  isLoadedCartData = false;

  onCartData = e => {
    const cartDataApi = e.data;
    if (cartDataApi && !this.isLoadedCartData) {
      this.isLoadedCartData = true;
      this.loadScript = `
      try{
        window.mtopjsonp1 = function(result) {
          if(window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(result))
          } else {
            window.postMessage(JSON.stringify(result))
          }
        }
        function createScript(){
          var head = document.getElementsByTagName('head')[0];
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = '${cartDataApi}';
          head.appendChild(script);
        }
        createScript()
      } catch(e) {
      }
      `;
    }
  };

  requestCartData = loadScript => {
    if (this.refs.webView && this.refs.webView.injectJavaScript) {
      console.log('数据劫持成功！');
      this.setState({
        statusText: '数据拉取中，请耐心等待……',
      });
      this.refs.webView.injectJavaScript(loadScript);
    }
  };

  onMessage({ type = '', data }) {
    if (type === 'cartData' && !this.intercept) {
      this.intercept = true;
      let newData = '';
      try {
        newData = JSON.parse(data);
      } catch (e) {
        console.log(e);
        return;
      }
      if (newData instanceof Object && newData.data && newData.data.data) {
        this.setState({
          statusText: '数据拉取成功！',
        });
        const newData2 = newData.data.data;
        const items = [];
        for (const key in newData2) {
          if (newData2[key].tag === 'itemv2' && newData2[key].fields.valid) {
            items.push(newData2[key]);
          }
        }
        const sortObj = items.sort((obj1, obj2) => {
          const value1 = obj1.id;
          const value2 = obj2.id;
          return value2 - value1;
        });
        const ids = sortObj.map(item => item.fields.itemId);
        if (ids.length > 0) {
          this.shoppingCartCount(ids);
        }
      } else {
        this.intercept = false;
        this.canClick = true;
        console.log(newData);
        Toast.show('数据拉取失败，请稍后重试!');
        clearInterval(this.timer);
        this.setState({
          cartDataLoading: false,
        });
        this._reloadPage();
      }
    }
  }

  canClick = true;

  selectCoupon = async () => {
    clearInterval(this.timer);
    clearInterval(this.timer2);
    const isAuth = await authVerification({
      navigation: this.props.navigation,
    });
    if (isAuth && this.canClick) {
      let isInjectScript = false;
      const polling = () => {
        this.canClick = false;
        if (!this.cartData && !isInjectScript) {
          isInjectScript = true;
          this.requestCartData(this.loadScript);
        }
        this.setState({
          cartDataLoading: true,
        });
        switch (this.selectCouponStatus) {
          case SELECT_SUCCESS:
            clearInterval(this.timer);
            clearInterval(this.timer2);
            this.canClick = true;
            this.props.navigation.navigate('CartDetail', {
              data: this.cartData,
            });
            this.setState({
              cartDataLoading: false,
            });
            break;
          case SELECT_FAIL:
            this.canClick = true;
            Toast.show('查券失败，请稍后重试!');
            clearInterval(this.timer);
            this.setState({
              cartDataLoading: false,
            });
            break;
          default:
            break;
        }
      };
      this.timer2 = setInterval(() => {
        if (this.urlLoaded) {
          clearInterval(this.timer2);
          this.timer = setInterval(() => {
            polling.bind(this)();
          }, 500);
        }
      }, 500);
    }
  };

  shoppingCartCount = ids => {
    console.log('请求接口！');
    this.setState({
      statusText: '努力查券中，请耐心等待……',
    });
    this.selectCouponStatus = SELECT_ING;
    shoppingCartCount(ids)
      .then(result => {
        if (result) {
          this.cartData = result;
          this.selectCouponStatus = SELECT_SUCCESS;
        } else {
          this.selectCouponStatus = SELECT_FAIL;
        }
      })
      .catch(() => {
        this.selectCouponStatus = SELECT_FAIL;
      });
  };

  render() {
    const { isShow, detailData, isLoadWebView, showShareBox, shareTitle, shareText, shareImageUrl, prdTKL, cartDataLoading, statusText } = this.state;
    const isIphoneX = Layout.device.deviceModel.indexOf('iPhone X') > -1;

    let sharePriceView = null;
    if (detailData) {
      sharePriceView =
        detailData.sharePrice && Number(detailData.sharePrice) > 0 ? (
          <Text style={styles.shareText}>
            分享商品可奖￥
            {detailData.sharePrice}
          </Text>
        ) : (
          <Text style={styles.shareText}>点此分享商品给好友</Text>
        );
    }
    let isShare = true;
    if (detailData && (!detailData.tbkCouponConvert || (detailData.tbkCouponConvert && !detailData.tbkCouponConvert.coupon_click_url && !detailData.tbkCouponConvert.item_url))) {
      isShare = false;
    }
    let isCoupon = true;
    if (detailData && !detailData.couponPrice) {
      isCoupon = false;
    }
    const { isReview } = global;
    let cartView = null;
    if (isLoadWebView) {
      cartView = (
        <AlibcTradeWebView
          style={{ width: Layout.window.width - 24, height: '100%' }}
          ref="webView"
          onGetCartData={this.onCartData}
          onStateChange={this._onNavigationStateChange}
          onMessage={e => this.onMessage(e)}
          param={{ type: 'mycard', openType: 'h5' }}
        />
      );
    }
    return (
      <AndroidBackHandler onBackPress={() => this.onBackButtonPressAndroid()} style={{ flex: 1, height: Layout.window.height }}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <ImageBackground
          source={require('../../assets/cart_bg.png')}
          style={{
            width: '100%',
            height: 124,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <Image source={require('../../assets/icon-cart-search.png')} style={{ width: 44, height: 44 }} />
          <TouchableOpacity style={styles.searchBtn} onPress={this.selectCoupon}>
            <Text style={styles.searchBtnText}>点击查询购物车优惠券</Text>
          </TouchableOpacity>
        </ImageBackground>
        <View
          style={{
            paddingLeft: 12,
            paddingRight: 12,
            backgroundColor: '#f0f0f0',
            flex: 1,
            width: Layout.window.width,
          }}
        >
          {cartView}
          {Boolean(detailData) && isShare && !isReview ? (
            <View style={styles.header}>
              {sharePriceView}
              <TouchableOpacity style={styles.btnShareBox} onPress={this.onPressShare}>
                <LinearGradient style={styles.btnShare} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FC4277', '#FF55B9']}>
                  <Text style={styles.shareTitle}>立即分享</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            isShow && (
              <View style={styles.header}>
                <Text style={{ color: '#ed5f84' }}>{isReview ? '请点击页面底部“一键找券”按钮' : '请点击页面底部“一键找券查佣金”按钮'}</Text>
              </View>
            )
          )}
          {isShow && (
            <View style={[styles.footer, isIphoneX ? { height: 100 } : '']}>
              <TouchableOpacity onPress={this.expainUrl}>
                <LinearGradient style={styles.btn} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FC4277', '#FF55B9']}>
                  <Text style={styles.btn_text}>{isReview ? '一键找券' : '一键找券查佣金'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          {!isShow && (
            <View style={[styles.footer, isIphoneX ? { height: 100 } : '']}>
              <Text style={[{ color: '#ed5f84' }]}>{isReview ? '点击商品去详情领券' : '点击商品去详情查看返佣'}</Text>
            </View>
          )}
          {Boolean(detailData) && (
            <View style={[styles.footer, styles.btnOutter, isIphoneX ? { height: 100 } : '']}>
              {isCoupon && !isReview && (
                <TouchableOpacity onPress={this.onPressBuy}>
                  <LinearGradient style={styles.fixBtnShare} start={{ x: 0.48, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FF7700', '#FFBE0F']}>
                    <Text style={styles.fixShareTitle}>
                      领￥
                      {detailData.couponPrice}券
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={this.onPressBuy}>
                <LinearGradient style={[isCoupon && !isReview ? styles.fixBtnBuy : styles.bigFixBtnBuy]} start={{ x: 0.84, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FC4277', '#FF417E']}>
                  {!isReview && detailData.buyPrice > 0 ? (
                    <Text style={styles.fixShareTitle}>
                      自购奖￥
                      {detailData.buyPrice}
                    </Text>
                  ) : (
                    <Text style={styles.fixShareTitle}>立即购买</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          <ShareBox closeShare={this.closeShare} showShareBox={showShareBox} shareImageUrl={shareImageUrl} shareTitle={shareTitle} shareText={shareText} shareTkl={prdTKL} fromSource="detail" />

          <View style={styles.qrCode}>
            <QRCode value={this.state.qrCodeInfo} logo={require('../../assets/icon-mili.png')} getRef={c => (this.svg = c)} />
          </View>
          {this.state.codeUrl ? (
            <View style={styles.canvasWrap}>
              <Canvas ref={!this.state.isLoadCanvas && this.handleCanvas.bind(this)} />
            </View>
          ) : null}
        </View>
        <NavigationEvents onDidFocus={() => this.init()} />
        {cartDataLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{ color: '#fff' }}>{statusText}</Text>
          </View>
        )}
      </AndroidBackHandler>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    margin: 10,
  },
  btnShareBox: {
    position: 'absolute',
    right: 10,
    top: 6,
  },
  btnShare: {
    width: 78,
    height: 34,
    borderRadius: 4,
  },
  shareText: {
    color: '#ed5f84',
  },
  shareTitle: {
    color: '#fff',
    lineHeight: 34,
    textAlign: 'center',
  },
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
  vipDialogWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  vipDialogContent: {
    position: 'absolute',
    top: '53%',
    left: '50%',
    marginTop: -162,
    marginLeft: -135,
    width: 270,
    height: 324,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCloseDialogWrap: {
    position: 'absolute',
    top: -50,
    right: 0,
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogLine: {
    width: 1,
    height: 30,
    backgroundColor: '#000',
  },
  closeDialogImg: {
    width: 24,
    height: 24,
  },
  dialogTopImg: {
    width: 270,
    height: 150,
    marginBottom: 16,
  },
  dialogText: {
    color: '#885401',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
  },
  btnBuyVip: {
    width: 222,
    height: 44,
    borderRadius: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  btnBuyVipText: {
    textAlign: 'center',
    lineHeight: 44,
    color: '#885401',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
  },
  dialogText2: {
    color: '#885401',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
  },
  header: {
    position: 'absolute',
    width: Layout.window.width,
    height: 46,
    backgroundColor: '#fcedf1',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: Layout.window.width,
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: 295,
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_text: {
    color: '#fff',
    fontSize: 16,
  },
  fixBuyTextWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    lineHeight: 40,
  },
  fixBtnShare: {
    width: 160,
    height: 40,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixShareTitle: {
    color: '#fff',
    fontFamily: 'PingFangSC-Medium',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 40,
  },
  fixBtnBuy: {
    width: 160,
    height: 40,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
  bigFixBtnBuy: {
    width: Layout.window.width - 40,
    height: 40,
    borderRadius: 100,
  },
  btnOutter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBtn: {
    width: 184,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  searchBtnText: {
    color: '#FC4277',
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
  },
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
