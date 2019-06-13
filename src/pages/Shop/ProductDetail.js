import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Clipboard, TouchableOpacity, ScrollView, AppState, Linking, StatusBar } from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import FastImage from 'react-native-fast-image';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import QRCode from 'react-native-qrcode-svg';
import { NavigationEvents } from 'react-navigation';
import FitImage from 'react-native-fit-image';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import fetch_blob from 'rn-fetch-blob';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Barrage from '@components/Barrage';
import drawText from '../../utils/drawText';
import ShareBox from '../../components/ShareBox';
import LoadingIcon from '../../components/LoadingIcon';
import Header from '../../components/Header';
import EmptyState from '../../components/EmptyState';
import Layout from '../../constants/Layout';
import { getStorePrdDetail, getBarrage } from '../../services/api';
import saveFile from '../../utils/saveFile';
import base64img from '../../utils/base64Img';
import { version } from '../../../package';
import { stringify } from 'qs';

export default class ProductDetail extends Component {
  static navigationOptions = {
    title: '商品详情',
    header: null,
  };

  state = {
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
    codeUrl: '',
    qrCodeInfo: 'https://www.vxiaoke360.com',
    shareImg: '',
    isSave: false,
    isLoadCanvas: false,
    isShareClick: false,
    canShowShareToast: true,
    canClick: true,
    authUrl: '',
    headerAlpha: 0,
    barrageList: [],
  };

  componentDidUpdate() {
    const ScrollView = this.refs.scrollView;
    if (ScrollView) {
      ScrollView.scrollBy(0, false);
    }
  }

  componentWillUnmount() {
    Toast.hide(this.shareToast);
  }

  /**
   * 初始化
   */
  init = async () => {
    const { needRefresh } = this.state;
    if (needRefresh) {
      const pid = this.props.navigation.getParam('pid', '');
      this.shopId = this.props.navigation.getParam('shopId', '');
      console.log('pid===', pid);
      this.setState(
        {
          pid,
        },
        () => {
          this.getPrdDetail();
          this.setState({
            canClick: true,
          });
        }
      );
    }
  };

  _onScroll(event) {
    const h = event.nativeEvent.contentOffset.y;
    this.setState({
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

  linkingPhone = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log('不支持拨打电话功能');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
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

  setPrdDetailImg = srcArray => {
    const imgArr = [];
    let index = 0;
    const setImg = uri => {
      const imgItem = <FitImage key={index} source={{ uri }} />;
      imgArr.push(imgItem);
      this.setState({
        detailImgArr: imgArr,
      });
      index++;
      if (index < srcArray.length) {
        const item = srcArray[index].value;
        setImg(item);
      }
    };
    setImg(srcArray[index].value);
  };

  prdDetail = () => {
    const { detailImgArr } = this.state;
    return detailImgArr;
  };

  /**
   * 事件绑定
   */
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
          return resp.readFile('base64');
        })
        .then(base64Data => {
          resolve(`data:image/jpeg;base64,${base64Data}`);
        });
    });
  }

  // canvas分享图
  handleCanvas = async canvas => {
    const { detailData, banners, codeUrl } = this.state;
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

    drawText(ctx, detailData.title, 25, '14px PingFangSC-Medium', '#333', 16, 28);
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
    if (detailData.couponPrice && Number(detailData.couponPrice) > 0) {
      quanImage.src = base64img.img2;
    } else {
      quanImage.src = base64img.img3;
    }
    quanImage.addEventListener('load', () => {
      ctx.drawImage(quanImage, quanX, 74, 42, 16);
    });

    if (detailData.couponPrice && Number(detailData.couponPrice) > 0) {
      const quanPriceImage = new CanvasImage(canvas);
      quanPriceImage.src = base64img.img4;
      quanPriceImage.addEventListener('load', () => {
        ctx.drawImage(quanPriceImage, 248, 70, 110, 32);
        ctx.fillStyle = '#fff';
        ctx.font = '16px PingFangSC-Medium';
        ctx.fillText(`￥${detailData.couponPrice}`, 293, 90);
        ctx.fill();
      });

      ctx.fillStyle = '#999';
      ctx.font = '12px PingFangSC-Regular';
      ctx.fillText(`￥${detailData.salePrice}原价`, 16, 108);
      ctx.fill();
      ctx.save();
    }
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
    if (detailData.couponPrice && Number(detailData.couponPrice)) {
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
      const baseImg = data.substr(1, data.length - 2);
      this.setState(
        {
          shareImg: baseImg,
        },
        () => this.checkShareBtnStatus()
      );
    });
  };

  checkShareBtnStatus = async () => {
    const { isShareClick } = this.state;
    if (isShareClick) {
      const res = await saveFile({ fileType: 'base64', file: this.state.shareImg, location: 'cache' });
      if (res) {
        this.setState({
          shareImageUrl: res,
          canClick: true,
          isSave: true,
          canShowShareToast: true,
        });
        this.props.navigation.navigate('DetailShare', {
          shareImg: this.state.shareImg,
          imgArr: this.state.banners,
          sharePrice: this.state.detailData.sharePrice,
          pid: this.state.pid,
          shareImageUrl: this.state.shareImageUrl,
          isStoreGoods: true,
          title: this.state.detailData.title,
          sharePage: 'ProductDetail',
          salePrice: this.state.detailData.salePrice,
          discountPrice: this.state.detailData.discountPrice,
        });
        Toast.hide(this.shareToast);
      } else {
        Toast.show('请开启手机权限');
      }
    }
  };

  onPressGoBack = () => {
    this.props.navigation.goBack();
  };

  jumpDetail = item => {
    this.props.navigation.push('Detail', { pid: item.id });
    this.setState({ needRefresh: false });
  };

  /**
   * 接口请求
   */
  onPressShare = async () => {
    const { canClick } = this.state;
    console.log('=======123456');
    AnalyticsUtil.event('product_detail_click_share');
    if (canClick) {
      this.setState(
        {
          canClick: false,
        },
        () => {
          this.setState({
            isShareClick: true,
          });
          this.getPrdShareImg();
        }
      );
    }
  };

  async getCanvas(shareText) {
    const { pid } = this.state;
    const { isParent, userId } =
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
      this.setState(
        {
          // qrCodeInfo: shareText,
          // 注意是否是正式（h5-mlsh-store）或者是测试环境 （h5Test-mlsh-store）
          qrCodeInfo: `https://family-h5.vxiaoke360.com/h5-mlsh-store/index.html#/ShopDetail?id=${pid}&shopId=${this.shopId}`,
          // qrCodeInfo: `https://www.vxiaoke360.com/H5/mlsh-detail/index.html?id=${pid}&shareUserId=${userId}`,
        },
        () => {
          this.getQRcode();
        }
      );
    }
  }

  onPressBuy = async type => {
    Clipboard.setString('');
    if (type === 1) {
      AnalyticsUtil.event('product_detail_get_coupon');
    } else {
      AnalyticsUtil.event('product_detail_buy_product');
    }
    this.props.navigation.navigate('ConfirmOrder', { id: this.state.pid });
  };

  async getPrdDetail() {
    const { pid } = this.state;
    console.log('getPrdDetail===params', pid);
    const res = await getStorePrdDetail(pid);
    console.log('getPrdDetail===', res);
    if (res) {
      const bannerArr = [];
      if (res.images && res.images.length) {
        res.images.map(item => {
          bannerArr.push(item.value);
        });
      }
      this.getCanvas(res.shareGoodsTxt);
      this.setState(
        {
          hasLoaded: true,
          showLoading: false,
          banners: bannerArr,
          detailData: {
            couponPrice: res.couponPrice,
            pid: res.id,
            salePrice: res.salePrice,
            volume: res.volume,
            title: res.title,
            discountPrice: res.discountPrice,
            buyPrice: res.buyAwardPrice,
            sharePrice: res.shareAwardPrice,
            shareTxt: '分享奖',
            copywriting: res.copywriting,
            isSelfTaking: res.distribution !== 1,
            tags: res.tags,
            contactsMobile: res.store.contactsMobile,
          },
          shareText: res.title,
        },
        () => {
          const { descImages } = res;
          if (descImages && descImages.length) {
            this.setPrdDetailImg(descImages);
          }
        }
      );
      this.getBarrage();
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

  // 弹幕 getBarrage
  async getBarrage() {
    const res = await getBarrage();
    if (res) {
      this.setState({
        barrageList: res,
      });
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
        const res = await saveFile({ fileType: 'base64', file: this.state.shareImg, location: 'cache' });
        if (res) {
          this.setState({
            shareImageUrl: res,
            canClick: true,
            isSave: true,
            canShowShareToast: true,
          });
          Toast.hide(this.shareToast);
          this.props.navigation.navigate('DetailShare', {
            shareImg: this.state.shareImg,
            imgArr: this.state.banners,
            sharePrice: this.state.detailData.sharePrice,
            pid: this.state.pid,
            shareImageUrl: this.state.shareImageUrl,
            isStoreGoods: true,
            title: this.state.detailData.title,
            sharePage: 'ProductDetail',
            salePrice: this.state.detailData.salePrice,
            discountPrice: this.state.detailData.discountPrice,
          });
        } else {
          Toast.show('请开启手机权限');
        }
        return;
      }

      if (!this.state.isLoadCanvas) {
        const { pid } = this.state;
        const { deviceId, platform, deviceModel, deviceBrand, userAgent } = Layout.device;
        const urlParams = {
          deviceId,
          platform,
          deviceModel,
          deviceBrand,
          userAgent,
          version,
        };
        const userInfo =
          (await storage
            .load({
              key: 'userInfo',
            })
            .catch(e => e)) || {};
        this.setState(
          {
            qrCodeInfo: `https://www.vxiaoke360.com/H5/mlsh-detail/index.html?id=${pid}&shareUserId=${userInfo.userId}&${stringify(urlParams)}`,
          },
          () => {
            this.getQRcode();
          }
        );
      }
    } else {
      this.setState(
        {
          canClick: true,
        },
        () => {
          this.props.navigation.navigate('DetailShare', {
            shareImg: this.state.shareImg,
            imgArr: this.state.banners,
            sharePrice: this.state.detailData.sharePrice,
            pid: this.state.pid,
            shareImageUrl: this.state.shareImageUrl,
            isStoreGoods: true,
            title: this.state.detailData.title,
            sharePage: 'ProductDetail',
            salePrice: this.state.detailData.salePrice,
            discountPrice: this.state.detailData.discountPrice,
          });
        }
      );
    }
  }

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

  render() {
    const { banners, detailData, shareImageUrl, shareTitle, shareText, showShareBox, hasLoaded, headerAlpha, showLoading, showEmpty, barrageList } = this.state;
    const { isReview } = global;
    return (
      <AndroidBackHandler onBackPress={() => this.onBackButtonPressAndroid()} style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="#fff" />
        <Header alpha={headerAlpha} title="商品详情" navigation={this.props.navigation} />
        {hasLoaded && (
          <View style={styles.container}>
            <View style={[styles.navigation, { elevation: 1, opacity: 1 - headerAlpha }]}>
              <TouchableOpacity style={styles.btnBackWrap} activeOpacity={Layout.activeOpacity} onPress={this.onPressGoBack}>
                <Image style={styles.btnIconBack} source={require('../../../assets/detail/icon-back-white.png')} />
              </TouchableOpacity>
              {!isReview && (
                <TouchableOpacity style={styles.btnShareWrap} activeOpacity={Layout.activeOpacity} onPress={this.onPressShare}>
                  <Image style={styles.btnIconShare} source={require('../../../assets/detail/icon-top-share.png')} />
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
                  </View>
                  {detailData.couponPrice > 0 && (
                    <Text style={styles.defaultPrice}>
                      门店原价
                      <Text style={styles.defaultPriceNum}> ￥{detailData.salePrice}</Text>
                    </Text>
                  )}
                  <TouchableOpacity style={styles.titleWrap} activeOpacity={1} onPress={this.onPressCopyTitle}>
                    <View style={styles.titleLabelWrap}>
                      {detailData.tags.length > 0 && detailData.tags[0] && (
                        <View style={styles.prdIconWrap}>
                          <Text style={styles.prdIcon}>{detailData.tags[0]}</Text>
                        </View>
                      )}
                      {detailData.tags.length > 1 && detailData.tags[1] && (
                        <View style={[styles.prdIconWrap, styles.prdIconWrap2]}>
                          <Text style={styles.prdIcon}>{detailData.tags[1]}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.prdTitle}>
                      {detailData.tags.length > 0 && detailData.tags[0] && (
                        <Text style={styles.prdTitleIndent}>
                          {detailData.tags[0]}
                          {detailData.tags[0].substr(detailData.tags[0].length - 2, 1)}
                        </Text>
                      )}
                      {detailData.tags.length > 1 && detailData.tags[1] && (
                        <Text style={styles.prdTitleIndent}>
                          {detailData.tags[1]}
                          {detailData.tags[1].substr(detailData.tags[1].length - 2, 1)}
                        </Text>
                      )}
                      {detailData.title}
                    </Text>
                  </TouchableOpacity>
                  {Number(detailData.couponPrice) > 0 && (
                    <TouchableOpacity style={styles.quanWrap} activeOpacity={Layout.activeOpacity} onPress={() => this.onPressBuy(1)}>
                      <FastImage style={styles.bgQuan} resizeMode={FastImage.resizeMode.contain} source={require('../../../assets/detail/img-quan.png')} />
                      <View style={styles.quanInfo}>
                        <View style={styles.quanPriceWrap}>
                          <Text style={styles.quanIcon}>￥</Text>
                          <Text style={styles.quanPrice}>{detailData.couponPrice}</Text>
                        </View>
                        <View>
                          <Text style={styles.quanText1}>优惠券</Text>
                          <View style={styles.quanTextWrap}>
                            <Text style={styles.quanText2}>无门槛使用</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={[styles.prdInfo, styles.stepWrap]}>
                <View style={styles.stepBox}>
                  <Image style={styles.stepIcon} source={require('../../../assets/detail/icon-order.png')} />
                  <Text style={styles.stepText}>APP下单</Text>
                </View>
                <Image style={styles.stepLine} source={require('../../../assets/detail/icon-arrowLine.png')} />
                <View style={styles.stepBox}>
                  <Image style={styles.stepIcon} source={detailData.isSelfTaking ? require('../../../assets/detail/icon-shop.png') : require('../../../assets/detail/icon-carSend.png')} />
                  <Text style={styles.stepText}>{detailData.isSelfTaking ? '到达门店' : '同城配送'}</Text>
                </View>
                <Image style={styles.stepLine} source={require('../../../assets/detail/icon-arrowLine.png')} />
                <View style={styles.stepBox}>
                  <Image style={styles.stepIcon} source={require('../../../assets/detail/icon-finish.png')} />
                  <Text style={styles.stepText}>{detailData.isSelfTaking ? '提货' : '收货完成'}</Text>
                </View>
              </View>
              <View style={[styles.prdDetailWrap, isIphoneX() ? { paddingBottom: 78 } : '']}>
                <View style={styles.prdDetailTitle}>
                  <Image style={styles.iconLeft} source={require('../../../assets/detail/icon-details-left.png')} />
                  <Text style={styles.prdTitleText}>商品详情</Text>
                  <Image style={styles.iconRight} source={require('../../../assets/detail/icon-details-right.png')} />
                </View>
                <View>{this.prdDetail()}</View>
              </View>
              {!isReview && barrageList.length ? <Barrage barrageList={barrageList} top={100} /> : null}
            </ScrollView>
            <View style={[styles.fixBtnWrap, isIphoneX() ? { paddingBottom: 30 } : '']}>
              <View style={styles.btnInner}>
                <TouchableOpacity style={styles.fixBtnBackHome} activeOpacity={Layout.activeOpacity} onPress={this.onPressGoBack}>
                  <Image style={styles.fixBtnIconBack} resizeMode="contain" source={require('../../../assets/detail/icon-home.png')} />
                  <Text style={styles.fixBtnText}>返回门店</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fixBtnTel} activeOpacity={Layout.activeOpacity} onPress={() => this.linkingPhone(`tel:${detailData.contactsMobile}`)}>
                  <Image style={styles.fixBtnIconTel} resizeMode="contain" source={require('../../../assets/detail/icon-tel.png')} />
                  <Text style={styles.fixBtnText}>联系商家</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.btnOutter}>
                {
                  <TouchableOpacity activeOpacity={Layout.activeOpacity} onPress={this.onPressShare}>
                    <LinearGradient style={styles.fixBtnShare} start={{ x: 0.48, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FF8A17', '#FFC417']}>
                      <Text style={styles.fixShareTitle}>分享</Text>
                      {Number(detailData.sharePrice) > 0 && !isReview && <Text style={styles.fixShareText}>￥{detailData.sharePrice}</Text>}
                    </LinearGradient>
                  </TouchableOpacity>
                }
                <TouchableOpacity activeOpacity={Layout.activeOpacity} onPress={() => this.onPressBuy(2)}>
                  <LinearGradient style={[styles.fixBtnBuy]} start={{ x: 0.84, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FC4277', '#FF417E']}>
                    <Text style={styles.fixShareTitle}>购买</Text>
                    {!isReview && detailData.buyPrice && Number(detailData.buyPrice) > 0 && <Text style={styles.fixShareText}>￥{detailData.buyPrice}</Text>}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            <ShareBox closeShare={this.closeShare} showShareBox={showShareBox} shareImageUrl={shareImageUrl} shareTitle={shareTitle} shareText={shareText} fromSource="detail" />
            <View style={styles.qrCode}>
              <QRCode value={this.state.qrCodeInfo} logo={require('../../../assets/icon-mili.png')} getRef={c => (this.svg = c)} />
            </View>
            {this.state.codeUrl ? (
              <View style={styles.canvasWrap}>
                <Canvas ref={!this.state.isLoadCanvas && this.handleCanvas.bind(this)} />
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
  stepWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
  },
  stepBox: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    width: 64,
  },
  stepIcon: {
    width: 32,
    height: 32,
    marginLeft: 10,
    marginRight: 10,
  },
  stepText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  stepLine: {
    width: 45,
    height: 2,
    marginRight: 16,
    marginLeft: 16,
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
    alignItems: 'flex-end',
    alignContent: 'flex-end',
  },
  priceSymbol: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 12,
    color: '#FC4277',
    marginBottom: 2,
  },
  priceNum: {
    fontFamily: 'DINA',
    fontSize: 26,
    color: '#FC4277',
    marginRight: 2,
  },
  priceTextWrap: {
    paddingLeft: 8,
    paddingRight: 8,
    height: 18,
    borderRadius: 4,
    marginLeft: 8,
    marginBottom: 5,
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
    marginBottom: 2,
    lineHeight: 16,
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
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  titleLabelWrap: {
    flexDirection: 'row',
    position: 'absolute',
    top: 1,
    left: 0,
    zIndex: 99,
    elevation: 99,
  },
  prdIconWrap: {
    paddingLeft: 3,
    paddingRight: 3,
    height: 18,
    borderRadius: 2,
    backgroundColor: '#FFC800',
  },
  prdIconWrap2: {
    backgroundColor: '#FF487C',
    marginLeft: 3,
  },
  prdIcon: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 18,
    width: '100%',
  },
  prdTitleIndent: {
    fontFamily: 'PingFangSC-Medium',
    color: '#fff',
    fontSize: 11,
    opacity: 0,
  },
  prdTitle: {
    flex: 1,
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
    marginTop: 20,
    marginLeft: 20,
    paddingTop: 4,
  },
  quanPriceWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginRight: 8,
  },
  quanIcon: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 18,
    color: '#fff',
    marginBottom: 6,
  },
  quanPrice: {
    fontFamily: 'DINA',
    fontSize: 52,
    color: '#fff',
  },
  quanText1: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#fff',
    marginBottom: 2,
    marginTop: 6,
  },
  quanTextWrap: {
    width: 72,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#fff',
    borderRadius: 9,
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  quanText2: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 11,
    color: '#fff',
    lineHeight: 18,
    marginTop: 1,
  },
  prdCommentWrap: {
    marginTop: 8,
    marginBottom: 12,
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prdComment: {
    width: 343,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
  },
  commentNum: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#4a4a4a',
  },
  commentText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
    color: '#FC4277',
  },
  iconMore: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  prdDetailWrap: {
    backgroundColor: '#fff',
    paddingBottom: 50,
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
  fixBtnWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 9,
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 4,
    paddingBottom: 4,
  },
  btnInner: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 6,
    flex: 1,
  },
  fixBtnBackHome: {
    alignItems: 'center',
  },
  fixBtnIconBack: {
    width: 20,
    height: 20,
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
  fixBtnTel: {
    alignItems: 'center',
  },
  fixBtnIconTel: {
    width: 20,
    height: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  isReviewBtn: {
    width: 220,
    height: 40,
    borderRadius: 100,
  },
});
