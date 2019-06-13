import React, { Component } from 'react';
import {
  StyleSheet, Platform, Text, View, Image, ScrollView, TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationEvents } from 'react-navigation';
import Toast from 'react-native-root-toast';
import FastImage from 'react-native-fast-image';
import FavorPrd from '../../components/PrdDoubleList';
import ShareBox from '../../components/ShareBox';
import LoadingIcon from '../../components/LoadingIcon';
import Layout from '../../constants/Layout';
import Header from '../../components/Header';
// import HTML from 'react-native-render-html';

import {
  getCommissionPrdDetail,
  getCommissionPrdShareImg,
} from '../../services/api';

export default class Detail extends Component {
  static navigationOptions = {
    title: '商品详情',
    header: null,
  }

  state = {
    isIphoneX: false,
    isVip: false,
    showVipDialog: false,
    showShareBox: false,
    hasLoaded: false,
    showLoading: true,
    pid: '',
    shareImageUrl: '',
    shareTitle: '米粒生活',
    shareText: '',
    detailImgArr: [],
    detailData: {},
    banners: [],
    detailList: [],
    favorList: [],
  }

  /**
   * 列表渲染
   */
  bannerList = () => {
    const { banners } = this.state;
    const bannerView = banners.map((item, i) => (
      <FastImage
        style={styles.bannerImg}
        key={i}
        resizeMode={FastImage.resizeMode.cover}
        source={{ uri: item }}
      />
    ));
    return (
      <Swiper
        loop
        autoplay
        autoplayTimeout={Platform.OS === 'ios' ? 2.5 : 4}
        containerStyle={styles.bannerSwiper}
        renderPagination={this.renderPagination}
        removeClippedSubviews={false}
      >
        {bannerView}
      </Swiper>
    );
  }

  renderPagination = (i, total) => (
    <View key={i} style={styles.paginationStyle}>
      <Text style={styles.paginationText}>
        <Text style={styles.paginationText}>{i + 1}</Text>
/
        {total}
      </Text>
    </View>
  )

  setPrdDetailImg = async (imgs) => {
    const screenWidth = Layout.window.width;
    const getImgH = uri => new Promise((resolve, reject) => {
      Image.getSize(uri, (width, height) => {
        const imgH = Math.floor(screenWidth / width * height);
        resolve(imgH);
      });
    });
    const imgArr = []; let index = 0;
    const setImg = async (item) => {
      const imgH = await getImgH(item);
      console.log('imgH==', imgH);
      const imgItem = (
        <FastImage
          key={index}
          style={[styles.prdImg, { height: imgH }]}
          source={{ uri: item }}
        />
      );
      imgArr.push(imgItem);
      this.setState({
        detailImgArr: imgArr,
      });
      index++;
      if (index < imgs.length) {
        const item = imgs[index];
        setImg(item);
      }
    };
    setImg(imgs[index]);
  }

  renderNode = () => {
    const { detailImgArr } = this.state;
    return detailImgArr;
  }

  /**
   * 事件绑定
   */

  onPressGoBack = () => {
    console.log('onPressGoBack===');
    this.props.navigation.goBack();
  }

  onPressBackHome = () => {
    console.log('onPressBackHome===');
    this.props.navigation.navigate('MainPage');
  }

  onPressShare = () => {
    const { isVip } = this.state;
    if (isVip) {
      this.getCommissionPrdShareImg();
    } else {
      this.setState({
        showVipDialog: true,
      });
    }
  }

  onPressBuy = async () => {
    const { id } = this.state.detailData;
    const { isParent } = (await storage.load({
      key: 'userInfo',
    }).catch(e => e)) || {};
    const { token } = (await storage.load({
      key: 'token',
    }).catch(e => e)) || {};
    if (token && isParent) {
      this.props.navigation.navigate('VipOrderConfirm', { pid: id });
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
  }

  onPressCloseBuyVip = () => {
    console.log('onPressCloseBuyVip===');
    this.setState({
      showVipDialog: false,
    });
  }

  onPressBuyVip = () => {
    this.props.navigation.navigate('VipIndex');
  }

  jumpDetail = (item) => {
    console.log('jumpDetail====1', item);
    this.props.navigation.push('Detail', { pid: item.id });
  }

  // 上拉加载
  onFooterLoad = () => {};

  closeShare = () => {
    this.setState({
      showShareBox: false,
    });
  }

  _onScroll(event) {
    const h = event.nativeEvent.contentOffset.y;
    console.log(h / 100);
    this.setState({
      headerAlpha: h / 100,
    });
  }

  /**
   * 接口请求
   */
  async getCommissionPrdDetail() {
    const { pid } = this.state;
    const res = await getCommissionPrdDetail(pid);
    console.log('getCommissionPrdDetail===', res);
    if (res) {
      const { imgs } = res;
      if (imgs && imgs.length) {
        this.setPrdDetailImg(imgs);
      }
      this.setState({
        hasLoaded: true,
        showLoading: false,
        banners: res.imageUrls,
        detailList: res.details,
        detailData: res,
        isVip: res.vip,
        shareText: res.name,
        // content: res.content
      });
    } else {
      this.setState({ showLoading: false });
    }
  }

  async getCommissionPrdShareImg() {
    const toast = Toast.show('分享图片生成中...', {
      duration: 0,
      position: 0,
    });
    const { pid } = this.state;
    const res = await getCommissionPrdShareImg(pid);
    console.log('getCommissionPrdShareImg===', res);
    if (res && res.img) {
      this.setState({
        shareImageUrl: res.img,
        showShareBox: true,
      }, () => {
        Toast.hide(toast);
      });
    } else {
      setTimeout(() => {
        Toast.hide(toast);
      }, 800);
    }
  }


  /**
   * 初始化
   */
  init = async () => {
    const isIphoneX = Layout.device.deviceModel.indexOf('iPhone X') > -1;
    const pid = this.props.navigation.getParam('pid', '');
    console.log('pid===', pid, isIphoneX);
    this.setState({ pid, isIphoneX }, () => {
      this.getCommissionPrdDetail();
    });
  }

  componentDidMount() {
    // this.init()
  }

  render() {
    const {
      favorList, isIphoneX, banners,
      isVip, detailData, showLoading,
      showVipDialog, shareImageUrl, content,
      shareTitle, shareText, showShareBox,
      hasLoaded, headerAlpha,
    } = this.state;
    const { isReview } = global;
    return (
      <View style={styles.container}>
        <Header alpha={headerAlpha} title="商品详情" navigation={this.props.navigation} />
        {
        hasLoaded
        && (
        <View style={{ flex: 1, elevation: 1 }}>
          <View style={[styles.navigation, { elevation: 1, opacity: 1 - headerAlpha }]}>
            <TouchableOpacity style={[styles.btnBackWrap]} activeOpacity={0.5} onPress={this.onPressGoBack}>
              <Image style={styles.btnIconBack} source={require('../../../assets/detail/icon-back-white.png')} />
            </TouchableOpacity>
            {
              !isReview
              && (
              <TouchableOpacity style={[styles.btnShareWrap]} activeOpacity={Layout.activeOpacity} onPress={this.onPressShare}>
                <Image style={styles.btnIconShare} source={require('../../../assets/detail/icon-top-share.png')} />
              </TouchableOpacity>
              )
            }
          </View>
          <ScrollView
            onScroll={e => this._onScroll(e)}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            <View style={styles.wrapper}>
              {
                banners.length > 0 && this.bannerList()
              }
            </View>
            <View style={styles.prdInfo}>
              <View style={styles.infoWrap}>
                <View style={styles.infoPrice}>
                  <View style={styles.priceWrap}>
                    <Text style={styles.priceSymbol}>￥ </Text>
                    <Text style={styles.priceNum}>{detailData.salePrice}</Text>
                    <View style={styles.priceTextWrap}>
                      <Text style={styles.priceText}>专享价</Text>
                    </View>
                  </View>
                  <Text style={styles.sales}>
月销
                    {detailData.volume || 0}
                  </Text>
                </View>
                <View style={styles.titleWrap}>
                  <Text style={styles.prdTitle}>{detailData.name}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.prdDetailWrap, isIphoneX ? { marginBottom: 80 } : { marginBottom: 50 }]}>
              <View style={styles.prdDetailTitle}>
                <Image style={styles.iconLeft} source={require('../../../assets/detail/icon-details-left.png')} />
                <Text style={styles.prdTitleText}>商品详情</Text>
                <Image style={styles.iconRight} source={require('../../../assets/detail/icon-details-right.png')} />
              </View>
              <View style={styles.imgWrap}>{this.renderNode()}</View>
            </View>
          </ScrollView>
          <View style={[styles.fixBtnWrap, isIphoneX ? { paddingBottom: 30 } : '']}>
            <View style={styles.btnInner}>
              <TouchableOpacity style={styles.fixBtnBackHome} activeOpacity={Layout.activeOpacity} onPress={this.onPressBackHome}>
                <Image style={styles.fixBtnIconBack} source={require('../../../assets/detail/icon-home.png')} />
                <Text style={styles.fixBtnText}>首页</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnOutter}>
              {
                !isReview
                && (
                <TouchableOpacity activeOpacity={Layout.activeOpacity} onPress={this.onPressShare}>
                  <LinearGradient
                    style={styles.fixBtnShare}
                    start={{ x: 0.84, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['#FF3A79', '#FF55B9']}
                  >
                    <Text style={styles.fixShareTitle}>{detailData.shareTxt}</Text>
                    {Number(detailData.shareAwardPrice) > 0 && (
                    <Text style={styles.fixShareText}>
￥
                      {detailData.shareAwardPrice}
                    </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                )
              }
              <TouchableOpacity activeOpacity={Layout.activeOpacity} onPress={this.onPressBuy}>
                <LinearGradient
                  style={[styles.fixBtnBuy, isReview && styles.isReviewBtn]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={['#FC4277', '#FF4C7F']}
                >
                  <Text style={styles.fixBuyText}>立即购买</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          {
            showVipDialog
            && (
            <View style={styles.vipDialogWrap}>
              <View style={styles.vipDialogContent}>
                <Text style={[styles.dialogText, { marginTop: 36 }]}>购买任意高佣专区商品</Text>
                <Text style={[styles.dialogText, { marginTop: 12 }]}>即可赚高额分享奖励</Text>
                <TouchableOpacity style={styles.btnBuyVip} activeOpacity={Layout.activeOpacity} onPress={this.onPressCloseBuyVip}>
                  <Text style={styles.btnBuyVipText}>确定</Text>
                </TouchableOpacity>
              </View>
            </View>
            )
          }
          <ShareBox
            closeShare={this.closeShare}
            showShareBox={showShareBox}
            shareImageUrl={shareImageUrl}
            shareTitle={shareTitle}
            shareText={shareText}
          />
        </View>
        )
      }
        <LoadingIcon showLoading={showLoading} />
        <NavigationEvents onDidFocus={() => this.init()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  btnBackWrap: {
    position: 'absolute',
    left: 20,
    width: 32,
    height: 32,
    zIndex: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
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
  btnIconBack: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  btnShareWrap: {
    position: 'absolute',
    right: 20,
    width: 32,
    height: 32,
    zIndex: 3,
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
    height: 375,
  },
  bannerSwiper: {
    width: '100%',
    height: 375,
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
  },
  infoWrap: {
    width: '100%',
    marginTop: 12,
    paddingLeft: 16,
    paddingRight: 16,
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
    width: 38,
    height: 16,
    borderRadius: 4,
    marginLeft: 5,
    marginBottom: 4,
    textAlign: 'center',
    backgroundColor: 'rgba(252,66,119,0.20)',
  },
  priceText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    textAlign: 'center',
    color: '#FC4277',
    lineHeight: 16,
  },
  sales: {
    marginBottom: 4,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999999',
  },
  defaultPrice: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  titleWrap: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  prdIcon: {
    marginTop: 2,
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  prdTitle: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
    color: '#333',
  },
  quanWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  bgQuan: {
    width: 343,
    height: 90,
  },
  quanInfo: {
    position: 'absolute',
    top: 10,
    left: 24,
  },
  quanPriceWrap: {
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
    right: 12,
  },
  btnQuan: {
    width: 80,
    height: 32,
    lineHeight: 32,
    textAlign: 'center',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
    color: '#FC4277',
    borderRadius: 16,
    overflow: 'hidden',
  },
  prdCommentWrap: {
    marginTop: 8,
    marginBottom: 8,
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
    flex: 1,
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
    width: 40,
    height: 18,
    resizeMode: 'contain',
    marginRight: 5,
  },
  iconRight: {
    width: 40,
    height: 18,
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  fixBtnBackHome: {
    // marginLeft:25,
  },
  fixBtnIconBack: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  fixBtnText: {
    marginTop: 4,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  fixBtnCollection: {
    marginLeft: 25,
    textAlign: 'center',
  },
  fixBtnIconCollection: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
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
    top: '50%',
    left: '50%',
    marginTop: -81,
    marginLeft: -135,
    width: 270,
    height: 192,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  dialogText: {
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    width: 230,
    textAlign: 'center',
  },
  btnBuyVip: {
    width: 222,
    height: 44,
    borderRadius: 24,
    marginTop: 30,
    marginBottom: 16,
    backgroundColor: '#FC4277',
  },
  btnBuyVipText: {
    textAlign: 'center',
    lineHeight: 44,
    color: '#fff',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
  },
  dialogText2: {
    color: '#FC4277',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
  },

  imgWrap: {
    width: Layout.window.width,
    paddingTop: 12,
  },
  prdImg: {
    width: '100%',
  },
});
