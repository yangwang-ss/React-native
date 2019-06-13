import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Clipboard, TouchableOpacity, ScrollView, AppState } from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import FastImage from 'react-native-fast-image';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import QRCode from 'react-native-qrcode-svg';
import { NavigationEvents } from 'react-navigation';
import RNAlibcSdk from 'react-native-alibc-sdk';
import Fetchblob from 'rn-fetch-blob';
import FitImage from 'react-native-fit-image';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import axios from 'axios';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Barrage from '@components/Barrage';
import drawText from '../utils/drawText';
import FavorPrd from '../components/PrdDoubleList';
import ShareBox from '../components/ShareBox';
import LoadingIcon from '../components/LoadingIcon';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import Layout from '../constants/Layout';
import { getPrdDetail, getPrdFavor, addCollectPrd, deleteCollectPrd, getPrdShopInfo, saveDetail, isTbAuth, getBarrage } from '../services/api';
import saveFile from '../utils/saveFile';
import base64img from '../utils/base64Img';
import authVerification from '../utils/authVerification';

export default class Detail extends Component {
  static navigationOptions = {
    title: '商品详情',
    header: null,
  };

  state = {
    isCollected: false,
    isVip: false,
    showShareBox: false,
    hasLoaded: false,
    showEmpty: false,
    showLoading: true,
    needRefresh: true,
    pid: '',
    shareImageUrl: '',
    shareTitle: '米粒生活',
    shareText: '',
    detailData: {},
    banners: [],
    detailImgArr: [],
    favorList: [],
    shopInfo: {},
    codeUrl: '',
    qrCodeInfo: 'https://www.vxiaoke360.com',
    isSave: false,
    isLoadCanvas: false,
    isShareClick: false,
    canShowShareToast: true,
    canClick: true,
    authUrl: '',
    headerAlpha: 0,
    barrageList: [],
  };

  /**
   * 列表渲染
   */
  bannerList = () => {
    const { banners } = this.state;
    const bannerView = banners.map((item, i) => <Image style={styles.bannerImg} key={i} resizeMode="cover" source={{ uri: item }} />);

    return (
      <Swiper loop ref="scrollView" autoplay containerStyle={styles.bannerSwiper} renderPagination={this.renderPagination} removeClippedSubviews={false}>
        {bannerView}
      </Swiper>
    );
  };

  renderPagination = (i, total) => (
    <View key={i} style={styles.paginationStyle}>
      <Text style={styles.paginationText}>
        <Text style={styles.paginationText}>{i + 1}</Text>/{total}
      </Text>
    </View>
  );

  analysisImg(content) {
    const imgReg = /\/\/img.*?(jpg|png)/gi;
    let srcArray = [];
    if (content) {
      srcArray = content.match(imgReg); // arr 为包含所有img标签的数组
    }
    console.log('srcArray===', srcArray);
    srcArray = srcArray.map(item => (item.indexOf('http') > 0 ? item : `https:${item}`));
    return srcArray;
  }

  setPrdDetailImg = async srcArray => {
    const imgArr = [];
    let index = 0;
    const setImg = async uri => {
      if (uri.indexOf('alicdn') > -1 && uri.indexOf('.jpg') > -1) {
        uri += '_640x640.jpg';
      }
      const imgItem = <FitImage key={index} source={{ uri }} />;
      imgArr.push(imgItem);
      this.setState({
        detailImgArr: imgArr,
      });
      index++;
      if (index < srcArray.length) {
        const item = srcArray[index];
        setImg(item);
      }
    };
    setImg(srcArray[index]);
  };

  prdDetail = () => {
    const { detailImgArr } = this.state;
    return detailImgArr;
  };

  /**
   * 事件绑定
   */

  // canvas图片写入
  loadedImg = image => new Promise(resolve => image.addEventListener('load', resolve));

  downloadImage = url => {
    return new Promise(resolve => {
      Fetchblob.config({
        fileCache: true,
      })
        .fetch('GET', url)
        // the image is now dowloaded to device's storage
        .then(resp => {
          // the image path you can use it directly with Image component
          return resp.readFile('base64');
        })
        .then(base64Data => {
          resolve(`data:image/jpeg;base64,${base64Data}`);
        });
    });
  };

  // canvas分享图
  handleCanvas = async canvas => {
    console.log('怎么才才能走到这儿');
    const { detailData, banners, codeUrl } = this.state;
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
      icons = base64img.img0;
    } else {
      icons = base64img.img1;
    }

    const image = new CanvasImage(canvas);
    image.src = icons;
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
      quanImage.src = base64img.img2;
    } else {
      quanImage.src = base64img.img3;
    }
    quanImage.addEventListener('load', () => {
      ctx.drawImage(quanImage, quanX, 74, 42, 16);
    });

    if (detailData.couponPrice) {
      const quanPriceImage = new CanvasImage(canvas);
      quanPriceImage.src = base64img.img4;
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
    productImage.src = await this.downloadImage(banners[0]);
    await this.loadedImg(productImage);
    ctx.drawImage(productImage, 16, 120, 343, 343);
    ctx.save();

    const priceLabel = new CanvasImage(canvas);
    priceLabel.src = base64img.img5;

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
    canvas.toDataURL('image/jpeg').then(async data => {
      this.canvasImg = data.substr(1, data.length - 2);
    });
  };

  onPressGoBack = () => {
    console.log('onPressGoBack===');
    this.props.navigation.goBack();
  };

  onPressBackHome = () => {
    console.log('onPressBackHome===');
    this.props.navigation.navigate('MainPage');
  };

  getQRCode = () => {
    let flag = 0;
    return new Promise(resolve => {
      const timer = setInterval(() => {
        flag += 1;
        if (this.svg && this.svg.toDataURL) {
          clearInterval(timer);
          this.svg.toDataURL(dataURL => {
            resolve(`data:image/jpeg;base64,${dataURL}`);
          });
          return;
        }
        if (flag > 10) {
          clearInterval(timer);
          resolve(false);
        }
      }, 500);
    });
  };

  getCanvas = () => {
    let flag = 0;
    return new Promise(resolve => {
      const timer = setInterval(() => {
        flag += 1;
        if (this.canvasImg) {
          console.log(this.canvasImg);
          clearInterval(timer);
          resolve(this.canvasImg);
          return;
        }
        if (flag > 10) {
          clearInterval(timer);
          resolve(false);
        }
      }, 500);
    });
  };

  onPressShare = async () => {
    const { pid } = this.state;
    try {
      const { navigation } = this.props;
      if (!this.isChecked) {
        AnalyticsUtil.event('product_detail_click_share');
        this.isChecked = true;
        if (this.currentPid === pid) {
          navigation.push('DetailShare', {
            shareImg: this.shareImg,
            imgArr: this.state.banners,
            sharePrice: this.state.detailData.sharePrice,
            pid: this.state.pid,
            shareImageUrl: this.state.shareImageUrl,
          });
          this.isChecked = false;
          return;
        }
        this.canvasImg = '';
        this.setState({
          qrCodeInfo: '',
          codeUrl: '',
        });
        this.shareToast = Toast.show('分享图片生成中...', {
          duration: 0,
          position: 0,
        });
        this.currentPid = pid;
        const { userId } =
          (await storage
            .load({
              key: 'userInfo',
            })
            .catch(e => e)) || {};
        this.setState({
          qrCodeInfo: `https://www.vxiaoke360.com/H5/mlsh-detail/index.html?id=${pid}&shareUserId=${userId}`,
        });
        const base64 = await this.getQRCode();
        if (!base64) {
          Toast.hide(this.shareToast);
          Toast.show('获取二维码失败');
          this.isChecked = false;
          this.currentPid = '';
        }
        this.setState({
          codeUrl: base64,
        });
        this.canvasImg = await this.getCanvas();
        if (!this.canvasImg) {
          Toast.hide(this.shareToast);
          Toast.show('获取分享图失败');
          this.isChecked = false;
          this.currentPid = '';
        }
        this.shareImageUrl = await saveFile({ fileType: 'base64', file: this.canvasImg, location: 'cache' });
        navigation.push('DetailShare', {
          shareImg: this.canvasImg,
          imgArr: this.state.banners,
          sharePrice: this.state.detailData.sharePrice,
          pid: this.state.pid,
          shareImageUrl: this.shareImageUrl,
        });
        this.isChecked = false;
        this.currentPid = '';
        Toast.hide(this.shareToast);
      }
    } catch (e) {
      console.log(e);
    }
  };

  onPressCollection = async () => {
    console.log('onPressCollection===', this.state.isCollected);
    const { isParent } =
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
      const isCollected = !this.state.isCollected;
      if (isCollected) {
        this.addCollectPrd();
      } else {
        this.deleteCollectPrd();
      }
      this.setState({ isCollected });
    } else if (token && !isParent) {
      if (isParent === undefined || isParent === null) {
        storage.remove({
          key: 'token',
        });
        navigation.navigate('Auth');
        return;
      }
      this.props.navigation.navigate('Invitation');
    } else {
      this.props.navigation.navigate('Auth');
    }
  };

  onPressBuy = async type => {
    Clipboard.setString('');
    if (type == 1) {
      AnalyticsUtil.event('product_detail_get_coupon');
    } else {
      AnalyticsUtil.event('product_detail_buy_product');
    }
    const isAuth = await authVerification({ navigation: this.props.navigation });
    if (isAuth) {
      const { couponPrice, couponUrl, url } = this.state;
      const path = parseInt(couponPrice) ? couponUrl : url;
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
  };

  jumpDetail = item => {
    console.log('jumpDetail====1', item);
    this.props.navigation.push('Detail', { pid: item.id });
    this.setState({ needRefresh: false });
  };

  jumpTB = async () => {
    const isAuth = await authVerification({ navigation: this.props.navigation });
    if (isAuth) {
      const { shopClickUrl } = this.state.shopInfo;
      if (!shopClickUrl) return;
      RNAlibcSdk.show(
        {
          type: 'url',
          payload: shopClickUrl,
          openType: 'native',
        },
        (err, info) => {
          if (!err) console.log(info);
          else console.log(err);
        }
      );
    }
  };

  // 上拉加载
  onFooterLoad = () => {};

  _onScroll(event) {
    const h = event.nativeEvent.contentOffset.y;
    this.setState({
      scrollHeight: h,
      headerAlpha: h / 100,
    });
  }

  closeShare = () => {
    this.setState({
      showShareBox: false,
      canClick: true,
    });
  };

  onPressCopyTitle = () => {
    const {
      detailData: { title },
    } = this.state;
    if (!title) return;
    Clipboard.setString(title);
    Toast.show('商品标题已复制！', { position: 0 });
    storage.save({
      key: 'searchText',
      data: { searchText: title },
    });
  };

  saveDetail(pics) {
    const pid = this.props.navigation.getParam('pid', '');
    saveDetail(pid, pics);
  }

  getDetailPics = url => {
    console.log(url);
    axios.get(url).then(result => {
      const srcArray = this.analysisImg(result.data);
      if (srcArray instanceof Array && srcArray.length > 0) {
        this.saveDetail(srcArray);
        this.setPrdDetailImg(srcArray);
      } else {
        const { banner } = this.state;
        this.setPrdDetailImg(banner);
      }
    });
  };

  /**
   * 接口请求
   */
  async getPrdDetail() {
    const { pid } = this.state;
    const src = this.props.navigation.getParam('src', 0);
    console.log('getPrdDetail===params', pid, src);
    const res = await getPrdDetail(pid, src);
    console.log('getPrdDetail===', res);
    if (res) {
      this.setState(
        {
          hasLoaded: true,
          showLoading: false,
          banners: res.imageUrls,
          isCollected: res.isCollected != 0,
          detailData: {
            couponEndTime: res.couponEndTime,
            couponPrice: res.couponPrice,
            couponStartTime: res.couponStartTime,
            pid: res.id,
            zkFinalPrice: res.zkFinalPrice,
            salesNum: res.salesNum,
            source: res.source,
            title: res.title,
            discountPrice: res.discountPrice,
            buyPrice: res.buyPrice,
            sharePrice: res.sharePrice,
            shareTxt: res.shareTxt,
            copywriting: res.copywriting,
          },
          shopInfo: {
            shopTitle: res.shopTitle,
          },
          isVip: res.vip,
          couponPrice: res.couponPrice,
          couponUrl: res.tbkCouponConvert && res.tbkCouponConvert.coupon_click_url,
          url: res.tbkItemConvert && res.tbkItemConvert.click_url,
          shareText: res.title,
          vipUpgradeLevel: res.vipUpgradeLevel,
          vipUpgradeBuyPrice: res.vipUpgradeBuyPrice,
        },
        () => {
          const { pics = {} } = res;
          if (pics.imgUrls instanceof Array && pics.imgUrls.length) {
            this.setPrdDetailImg(pics.imgUrls);
          } else if (pics.detailUrl) {
            this.getDetailPics(pics.detailUrl);
          } else {
            this.setPrdDetailImg(res.imageUrls);
          }
        }
      );
      this.getPrdShopInfo(res.shopTitle);
      this.getPrdFavor(res.categoryLeafName);
    } else {
      this.setState({
        showLoading: false,
        showEmpty: true,
      });
      setTimeout(() => {
        this.props.navigation.goBack();
      }, 2000);
    }
  }

  async getPrdFavor(cname) {
    const { pid } = this.state;
    const res = await getPrdFavor(pid, cname);
    console.log('getPrdFavor===', res);
    if (res && res.length) {
      this.setState({
        favorList: res,
      });
    }
  }

  async addCollectPrd() {
    const { pid } = this.state;
    const res = await addCollectPrd(pid);
    console.log('addCollectPrd===', res);
    if (res) {
      this.setState({ isCollected: true });
    }
  }

  async deleteCollectPrd() {
    const { pid } = this.state;
    const res = await deleteCollectPrd(pid);
    console.log('deleteCollectPrd===', res);
    if (res) {
      this.setState({ isCollected: false });
    }
  }

  async getPrdShopInfo(shopTitle) {
    const res = await getPrdShopInfo(encodeURI(shopTitle));
    console.log('getPrdShopInfo===', res);
    if (res) {
      this.setState({ shopInfo: res });
    }
  }

  // 弹幕 getBarrage
  async getBarrage() {
    const res = await getBarrage();
    if (res) {
      this.setState({
        barrageList: res,
      });
    }
  }

  /**
   * 初始化
   */
  init = async () => {
    const { needRefresh } = this.state;
    if (needRefresh) {
      const pid = this.props.navigation.getParam('pid', '');
      this.setState(
        {
          pid,
        },
        () => {
          this.getPrdDetail();
          this.getBarrage();
          this.shareImg = '';
          this.setState({
            canClick: true,
            detailData: {},
            shareImageUrl: '',
            isSave: false,
            isShareClick: false,
          });
        }
      );
    }

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
  };

  onBackButtonPressAndroid = () => {
    this._goBackPage();
    return true;
  };

  _goBackPage = () => {
    if (this.state.authUrl) {
      this.setState({
        authUrl: '',
      });
    } else {
      // 否則返回到上一個頁面
      this.props.navigation.goBack();
    }
  };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this.init();
    }
  };

  componentDidUpdate() {
    const ScrollView = this.refs.scrollView;
    if (ScrollView) {
      ScrollView.scrollBy(0, false);
    }
  }

  componentWillUnmount() {
    Toast.hide(this.shareToast);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  toVipIndex = async () => {
    const { isParent } =
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
      this.props.navigation.navigate('VipPage');
    } else {
      this.props.navigation.navigate('Auth');
    }
  };

  render() {
    const {
      favorList,
      banners,
      isCollected,
      isVip,
      detailData,
      shareImageUrl,
      shopInfo,
      shareTitle,
      shareText,
      showShareBox,
      hasLoaded,
      headerAlpha,
      showLoading,
      showEmpty,
      vipUpgradeLevel,
      vipUpgradeBuyPrice,
      authUrl,
      barrageList,
    } = this.state;
    const { isReview } = global;
    let sharePriceView = null;
    if (Number(detailData.sharePrice) > 0) {
      sharePriceView = isVip ? <Text style={styles.fixShareText}>￥{detailData.sharePrice}</Text> : <Text style={styles.fixShareText}>￥{detailData.sharePrice}</Text>;
    }
    let hasShopTitle = false;
    let hasShopIcon = false;
    if (shopInfo && shopInfo.shopTitle) {
      hasShopTitle = true;
    }
    if (shopInfo && shopInfo.shopIcon) {
      hasShopIcon = true;
    }
    return (
      <AndroidBackHandler onBackPress={() => this.onBackButtonPressAndroid()} style={styles.container}>
        <Header alpha={headerAlpha} title="商品详情" navigation={this.props.navigation} />
        {hasLoaded && (
          <View style={styles.container}>
            <View style={[styles.navigation, { elevation: 1, opacity: 1 - headerAlpha }]}>
              <TouchableOpacity style={styles.btnBackWrap} activeOpacity={Layout.activeOpacity} onPress={this.onPressGoBack}>
                <Image style={styles.btnIconBack} source={require('../../assets/detail/icon-back-white.png')} />
              </TouchableOpacity>
              {!isReview && (
                <TouchableOpacity style={styles.btnShareWrap} activeOpacity={Layout.activeOpacity} onPress={this.onPressShare}>
                  <Image style={styles.btnIconShare} source={require('../../assets/detail/icon-top-share.png')} />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView onScroll={e => this._onScroll(e)} scrollEventThrottle={20} contentContainerStyle={{ alignItems: 'center' }}>
              <View style={styles.wrapper}>{banners.length > 0 && this.bannerList()}</View>
              <View style={styles.prdInfo}>
                <View style={styles.infoWrap}>
                  <View style={styles.infoPrice}>
                    <View style={styles.priceWrap}>
                      <Text style={styles.priceSymbol}>￥ </Text>
                      <Text style={styles.priceNum}>{detailData.discountPrice}</Text>
                      {detailData.couponPrice > 0 ? <Text style={[styles.priceText, styles.priceText2]}>券后</Text> : <Text style={[styles.priceText, styles.priceText2]}>优惠价</Text>}
                      {!isReview && detailData.buyPrice > 0 ? (
                        <View style={styles.priceTextWrap}>
                          <Text style={styles.priceText}>奖{detailData.buyPrice}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.sales}>
                      月销：
                      {detailData.salesNum}
                    </Text>
                  </View>
                  {detailData.zkFinalPrice > 0 && (
                    <Text style={styles.defaultPrice}>
                      {detailData.source == 0 ? '淘宝原价' : '天猫原价'}
                      <Text style={styles.defaultPriceNum}> ￥{detailData.zkFinalPrice}</Text>
                    </Text>
                  )}
                  {!isReview && vipUpgradeLevel && vipUpgradeBuyPrice > 0 && (
                    <TouchableOpacity onPress={this.toVipIndex} style={styles.updateMember}>
                      <Text style={styles.updateMemberText}>
                        现在升级
                        {vipUpgradeLevel}
                        ，可得佣金￥
                        {vipUpgradeBuyPrice}
                      </Text>
                      <Text style={styles.updateMemberText}>立即升级>></Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.titleWrap} activeOpacity={1} onPress={this.onPressCopyTitle}>
                    <Text>
                      <Image style={styles.prdIcon} source={detailData.source == 0 ? require('../../assets/detail/icon-tb.png') : require('../../assets/detail/icon-tm.png')} />
                      <Text style={styles.prdTitle}> {detailData.title}</Text>
                    </Text>
                  </TouchableOpacity>
                  {detailData.couponPrice > 0 && (
                    <View style={styles.quanWrap}>
                      <FastImage style={styles.bgQuan} resizeMode={FastImage.resizeMode.contain} source={require('../../assets/detail/img-quan-tb.png')} />
                      <View style={styles.quanInfo}>
                        <View style={styles.quanPriceWrap}>
                          <Text style={styles.quanPrice}>{detailData.couponPrice}元</Text>
                          <Text style={styles.quanText}>无门槛优惠券</Text>
                        </View>
                        <View style={styles.quanDateWarp}>
                          <Text style={styles.quanDate}>
                            使用期限：
                            {detailData.couponStartTime}-{detailData.couponEndTime}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.btnQuanWrap} activeOpacity={Layout.activeOpacity} onPress={() => this.onPressBuy(1)}>
                        <LinearGradient style={styles.btnQuan} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FFF', 'rgba(255,255,255,0.80)']}>
                          <View>
                            <Text style={styles.btnQuanTxt}>立即领取</Text>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              {hasShopTitle && (
                <TouchableOpacity style={styles.shopInfoWrap} activeOpacity={Layout.activeOpacity} onPress={this.jumpTB}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {hasShopIcon && <Image style={styles.shopIcon} source={{ uri: shopInfo.shopIcon }} />}
                    <View>
                      <Text style={styles.shopName}>{shopInfo.shopTitle}</Text>
                      <View style={styles.shopTagWrap}>
                        <Text style={styles.shopTag}>{detailData.source == 0 ? '淘宝' : '天猫'}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.goShop}>
                    <Text style={styles.goShopTitle}>进店逛逛</Text>
                  </View>
                </TouchableOpacity>
              )}
              <View style={styles.prdDetailWrap}>
                <View style={styles.prdDetailTitle}>
                  <Image style={styles.iconLeft} source={require('../../assets/detail/icon-details-left.png')} />
                  <Text style={styles.prdTitleText}>商品详情</Text>
                  <Image style={styles.iconRight} source={require('../../assets/detail/icon-details-right.png')} />
                </View>
                <View>{this.prdDetail()}</View>
              </View>
              {favorList.length > 0 ? (
                <View>
                  <View style={styles.favorWrap}>
                    <Image style={styles.iconDotLeft} source={require('../../assets/vip/line-left.png')} />
                    <Text style={styles.favorTitle}>你可能还喜欢</Text>
                    <Image style={styles.iconDotRight} source={require('../../assets/vip/line-right.png')} />
                  </View>
                  <View style={[styles.favorContent, isIphoneX() ? { paddingBottom: 50 } : { paddingBottom: 30 }]}>
                    <FavorPrd list={favorList} jumpDetail={this.jumpDetail} onFooterLoad={this.onFooterLoad} />
                  </View>
                </View>
              ) : (
                <Text style={[isIphoneX() ? { height: 80 } : { height: 50 }]} />
              )}
              {!isReview && barrageList.length ? <Barrage barrageList={barrageList} top={100} /> : null}
            </ScrollView>
            <View style={[styles.fixBtnWrap, isIphoneX() ? { paddingBottom: 30 } : '']}>
              <View style={styles.btnInner}>
                <TouchableOpacity style={styles.fixBtnBackHome} activeOpacity={Layout.activeOpacity} onPress={this.onPressBackHome}>
                  <Image style={styles.fixBtnIconBack} resizeMode="contain" source={require('../../assets/detail/icon-home.png')} />
                  <Text style={styles.fixBtnText}>首页</Text>
                </TouchableOpacity>
                {isCollected ? (
                  <TouchableOpacity style={styles.fixBtnCollection} activeOpacity={Layout.activeOpacity} onPress={this.onPressCollection}>
                    <Image style={styles.fixBtnIconCollection} resizeMode="contain" source={require('../../assets/detail/collection-selected.png')} />
                    <Text style={[styles.fixBtnText, styles.fixBtnText2]}>已收藏</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.fixBtnCollection} activeOpacity={Layout.activeOpacity} onPress={this.onPressCollection}>
                    <Image style={styles.fixBtnIconCollection} resizeMode="contain" source={require('../../assets/detail/collection-normal.png')} />
                    <Text style={styles.fixBtnText}>收藏</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.btnOutter}>
                <TouchableOpacity activeOpacity={Layout.activeOpacity} onPress={this.onPressShare}>
                  <LinearGradient style={styles.fixBtnShare} start={{ x: 0.48, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FF8A17', '#FFC417']}>
                    <Text style={styles.fixShareTitle}>{!isReview && Number(detailData.sharePrice) > 0 ? detailData.shareTxt : '分享'}</Text>
                    {!isReview && sharePriceView}
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={Layout.activeOpacity} onPress={() => this.onPressBuy(2)}>
                  <LinearGradient style={[styles.fixBtnBuy]} start={{ x: 0.84, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FC4277', '#FF417E']}>
                    {detailData.buyPrice > 0 && !isReview ? (
                      <View style={styles.fixBuyTextWrap}>
                        <Text style={styles.fixBuyText1}>自购奖</Text>
                        <Text style={styles.fixBuyText2}>￥{detailData.buyPrice}</Text>
                      </View>
                    ) : (
                      <Text style={styles.fixBuyText}>立即购买</Text>
                    )}
                    <Text style={styles.fixBuyText}>立即购买</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            <ShareBox closeShare={this.closeShare} showShareBox={showShareBox} shareImageUrl={shareImageUrl} shareTitle={shareTitle} shareText={shareText} fromSource="detail" />
            <View style={styles.qrCode}>{Boolean(this.state.qrCodeInfo) && <QRCode value={this.state.qrCodeInfo} logo={require('../../assets/icon-mili.png')} getRef={c => (this.svg = c)} />}</View>
            {this.state.codeUrl ? (
              <View style={styles.canvasWrap}>
                <Canvas ref={this.handleCanvas.bind(this)} />
              </View>
            ) : null}
          </View>
        )}
        {showEmpty ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <EmptyState source="detail" />
          </View>
        ) : null}
        <LoadingIcon showLoading={showLoading} />
        <NavigationEvents onDidFocus={() => this.init()} />
      </AndroidBackHandler>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
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
  navigation: {
    position: 'absolute',
    top: 32,
    left: 0,
    zIndex: 3,
    width: Layout.window.width,
    height: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnBackWrap: {
    marginLeft: 20,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  btnIconBack: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  btnShareWrap: {
    marginRight: 20,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  btnIconShare: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  wrapper: {
    width: '100%',
    height: Layout.window.width,
  },
  bannerSwiper: {
    width: '100%',
    height: Layout.window.width,
  },
  bannerImg: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 14,
    right: 20,
    width: 52,
    height: 24,
    borderRadius: 26,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationText: {
    color: 'white',
    fontSize: 14,
  },
  prdInfo: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 8,
    paddingLeft: 12,
    paddingRight: 12,
  },
  infoWrap: {
    width: '100%',
    marginTop: 8,
  },
  infoPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  priceSymbol: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 12,
    color: '#FC4277',
    marginBottom: 4,
  },
  priceNum: {
    fontFamily: 'DINA',
    fontSize: 26,
    color: '#FC4277',
  },
  priceTextWrap: {
    paddingLeft: 8,
    paddingRight: 8,
    height: 18,
    borderRadius: 4,
    marginLeft: 8,
    marginBottom: 7,
    textAlign: 'center',
    backgroundColor: 'rgba(252,66,119,0.20)',
  },
  priceText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    textAlign: 'center',
    color: '#FC4277',
    lineHeight: 18,
  },
  priceText2: {
    fontSize: 10,
    marginBottom: 5,
    lineHeight: 16,
  },
  sales: {
    marginBottom: 4,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  defaultPrice: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  defaultPriceNum: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  titleWrap: {
    position: 'relative',
    marginTop: 8,
    marginBottom: 12,
  },
  prdIcon: {
    width: 13,
    height: 13,
  },
  prdTitle: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 15,
    color: '#333',
  },
  quanWrap: {
    position: 'relative',
    marginBottom: 12,
    width: '100%',
    height: 100,
  },
  bgQuan: {
    width: '100%',
    height: 100,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  quanInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginLeft: 20,
    paddingTop: 4,
  },
  quanPriceWrap: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  quanPrice: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 26,
    color: '#fff',
  },
  quanText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
    marginBottom: 4,
  },
  quanDateWarp: {
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  quanDate: {
    padding: 2,
    paddingLeft: 8,
    paddingRight: 8,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#fff',
  },
  btnQuanWrap: {
    position: 'absolute',
    top: 30,
    right: '5%',
  },
  btnQuan: {
    borderRadius: 16,
    width: '100%',
    height: 32,
    paddingHorizontal: '3%',
    overflow: 'hidden',
  },
  btnQuanTxt: {
    lineHeight: 32,
    textAlign: 'center',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
    color: '#FC4277',
    borderRadius: 16,
  },
  prdDetailWrap: {
    backgroundColor: '#fff',
  },
  prdDetailTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    width: Layout.window.width,
  },
  iconLeft: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    marginRight: 5,
  },
  iconRight: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    marginLeft: 7,
  },
  prdTitleText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  prdDetail: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
  },
  prdDetailText: {
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  favorContent: {
    paddingTop: 10,
    marginBottom: 40,
  },
  favorWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 10,
  },
  favorTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    marginRight: 12,
  },
  iconDotLeft: {
    width: 40,
    height: 18,
    resizeMode: 'contain',
  },
  iconDotRight: {
    width: 40,
    height: 18,
    resizeMode: 'contain',
  },
  fixBtnWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 9,
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  btnInner: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 6,
    flex: 1,
  },
  fixBtnIconBack: {
    width: 22,
    height: 22,
  },
  fixBtnText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  fixBtnText2: {
    color: '#FC4277',
  },
  fixBtnCollection: {
    alignItems: 'center',
  },
  fixBtnIconCollection: {
    width: 22,
    height: 22,
    marginBottom: 2,
  },
  btnOutter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 4,
  },
  fixBtnShare: {
    width: 124,
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
  },
  fixShareText: {
    fontFamily: 'PingFangSC-Regular',
    textAlign: 'center',
    fontSize: 10,
    color: '#fff',
  },
  fixBtnBuy: {
    width: 124,
    height: 40,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
  isReviewBtn: {
    width: 220,
    height: 40,
    borderRadius: 100,
  },
  fixBuyTextWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  fixBuyText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    lineHeight: 40,
  },
  fixBuyText1: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
  },
  fixBuyText2: {
    fontFamily: 'PingFangSC-Regular',
    textAlign: 'center',
    fontSize: 10,
    color: '#fff',
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
  shopInfoWrap: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#fff',
  },
  shopIcon: {
    width: 36,
    height: 36,
    marginRight: 8,
  },
  shopName: {
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
  },
  shopTagWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#fa0130',
    width: 32,
    height: 16,
    marginTop: 4,
  },
  shopTag: {
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
  },
  arrowDown: {
    position: 'absolute',
    bottom: -16,
    left: '50%',
    marginLeft: -8,
    marginTop: 1,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 8,
    borderTopColor: 'rgba(0,0,0,0.75)',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
  },
  prdImg: {
    width: '100%',
  },
  goShop: {
    borderWidth: 0.5,
    borderColor: '#FC4277',
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    height: 30,
    borderRadius: 15,
  },
  goShopTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#FC4277',
    lineHeight: 30,
  },
  updateMember: {
    backgroundColor: '#FFF1D7',
    borderRadius: 4,
    flexDirection: 'row',
    height: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 8,
  },
  updateMemberText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#8B572A',
  },
});
