import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Platform, StatusBar, FlatList, RefreshControl, ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { BoxShadow } from 'react-native-shadow';
import Swiper from 'react-native-swiper';
import Layout from '@constants/Layout';
import ShopDItem from '@components/ShopDItem';
import ShareBox from '@components/ShareBox';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import QRCode from 'react-native-qrcode-svg';
import saveFile from '@utils/saveFile';
import Toast from 'react-native-root-toast';
import FetchBlob from 'rn-fetch-blob';
import { NavigationEvents } from 'react-navigation';
import { shopDetailInfo, shopDetailRecommendGoods, shopDetaiPlist, shopDetailSearch, shareStoreTime } from '../../services/api';
import base64Img from '../../utils/base64Img';

const shadowOpt = {
  width: 80,
  height: 80,
  color: '#999',
  border: 4,
  radius: 4,
  opacity: 0.08,
  x: 0,
  y: 0,
  style: {},
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f4f4',
  },
  qrCode: {
    position: 'absolute',
    zIndex: -1,
    opacity: 0,
    top: 300,
  },
  bgW: {
    backgroundColor: '#fff',
  },
  headerWrap: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backWrap: {
    width: 32,
    paddingLeft: 12,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    height: 32,
    flex: 1,
    flexDirection: 'row',
    paddingRight: 16,
    paddingLeft: 12,
  },
  searchBox: {
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    height: 32,
    paddingRight: 12,
    paddingLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginTop: 1,
    padding: 0,
  },
  cancelInner: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    width: 18,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelIcon: {
    marginTop: -2,
  },
  shopHeader: {
    width: Layout.window.width,
    height: 80,
    position: 'relative',
  },
  headerAB: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    paddingLeft: 16,
    paddingRight: 16,
    top: 16,
    left: 0,
  },
  shopBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Layout.window.width,
    height: 80,
  },
  shopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    height: 45,
  },
  shopIcon: {
    width: 80,
    height: 80,
  },
  shopTitleWrap: {
    marginLeft: 12,
    width: '60%',
  },
  shopTitle: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333',
  },
  shopTitleInfo: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  shareBtn: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  shareBtnText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#fff',
    lineHeight: 30,
  },
  listTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  titleLeft: {
    width: 11,
    height: 10,
    marginRight: 9,
  },
  titleRight: {
    width: 11,
    height: 10,
    marginLeft: 9,
  },
  listTitleText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#333',
  },
  speWrap: {
    width: '100%',
    marginTop: 14,
    height: 136,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerSwiper: {
    width: '100%',
    alignSelf: 'center',
  },
  swiperItem: {
    width: '100%',
    height: 136,
    paddingLeft: 12,
    paddingRight: 12,
  },
  speWrapBox: {
    height: 136,
    paddingLeft: 12,
    paddingRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  recBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
    width: 375,
    height: '100%',
    resizeMode: 'stretch',
  },
  speWrapLeft: {
    flex: 1,
    height: 112,
    padding: 16,
    paddingRight: 14,
    backgroundColor: '#fff',
    borderBottomRightRadius: 32,
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 2,
    borderTopRightRadius: 2,
    marginRight: 12,
  },
  speTitle: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
    color: '#333',
    height: 44,
  },
  spePrice: {
    fontFamily: 'DINA',
    fontSize: 13,
    color: '#FC4277',
  },
  spePriceNum: {
    fontSize: 26,
  },
  speImg: {
    width: 128,
    height: 128,
    borderRadius: 4,
  },
  productWrap: {
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#fff',
  },
  loadingText: {
    width: '100%',
    lineHeight: 30,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
    marginTop: 30,
    paddingBottom: 30,
  },
  canvasWrap: {
    position: 'absolute',
    zIndex: -1,
    opacity: 0,
    top: 300,
  },
  emptyWrap: {
    width: '100%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyImg: {
    width: 150,
    height: 150,
  },
  emptyInfo: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});
type Props = {
  navigation: Object,
  shopId: String,
  hideBack: Boolean,
};
export default class ShopDetail extends Component<Props> {
  static navigationOptions = {
    header: null,
  };

  state = {
    showHeader: true,
    pList: [],
    shopInfo: {},
    recommendList: [],
    loadMoreText: '',
    searchValue: '',
    currentPage: 1,
    showShareBox: false,
    shareImageUrl: '',
    codeUrl: '',
    qrCodeInfo: '',
    showEmpty: false,
    emptyText: '',
    shareTkl: '',
    refreshing: false,
  };

  componentDidMount() {
    const { navigation, shopId } = this.props;
    console.log('this.props', this.props);
    const newShopId = navigation.getParam('shopId') || shopId;
    this.shopId = newShopId;
    this.setState({
      // 注意是否是正式（h5-mlsh-store）或者是测试环境 （h5Test-mlsh-store）
      qrCodeInfo: `https://family-h5.vxiaoke360.com/h5-mlsh-store/index.html#/shopIndex?id=${this.shopId}`,
    });
    this.init(newShopId);
    storage.save({
      key: 'shopId',
      data: newShopId || '',
    });
  }

  onHeaderRefresh = () => {
    this.setState(
      {
        searchValue: '',
        showHeader: true,
        refreshing: true,
        currentPage: 1,
        showEmpty: false,
        loadMoreText: '',
      },
      () => {
        this.init(this.shopId);
      }
    );
  };

  // 事件绑定
  onChangeText = value => {
    this.setState({
      loadMoreText: '',
      searchValue: value,
    });
  };

  onSubmitEditing = () => {
    const { searchValue } = this.state;
    this.setState(
      {
        currentPage: 1,
        showHeader: false,
      },
      () => {
        this.getList(this.shopId, 1, searchValue);
      }
    );
  };

  onFooterLoad = () => {
    const { currentPage } = this.state;
    if (this.canLoadMore) {
      console.log('上拉加载===onFooterRefresh', currentPage);
      this.canLoadMore = false;
      this.getList(this.shopId, currentPage);
    }
  };

  hederComponent() {
    const { shopInfo, showHeader, recommendList, showEmpty } = this.state;
    if (showHeader) {
      return (
        <View style={styles.bgW}>
          <ImageBackground style={styles.shopHeader} source={require('../../../assets/Shop/detail-bg.png')}>
            {/* <Image style={styles.shopBg} source={require('../../../assets/Shop/detail-bg.png')} resizeMode="stretch" /> */}
            <View style={styles.headerAB}>
              <BoxShadow setting={shadowOpt}>
                <Image style={styles.shopIcon} source={{ uri: shopInfo.icon }} />
              </BoxShadow>
              <View style={styles.shopRight}>
                <View style={styles.shopTitleWrap}>
                  <Text style={styles.shopTitle} numberOfLines={1}>
                    {shopInfo.name}
                  </Text>
                  <Text style={styles.shopTitleInfo} numberOfLines={1}>
                    {shopInfo.introduce}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => this.onPressShare()} activeOpacity={0.85}>
                  <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FE77AF', '#FC4277']} style={styles.shareBtn}>
                    <Text style={styles.shareBtnText}>分享门店</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
          {!showEmpty ? (
            <View style={styles.listTitle}>
              <Image style={styles.titleLeft} source={require('../../../assets/Shop/detail-title1.png')} />
              <Text style={styles.listTitleText}>今日必买</Text>
              <Image style={styles.titleRight} source={require('../../../assets/Shop/detail-title2.png')} />
            </View>
          ) : null}
          {recommendList.length ? (
            <View style={{ flex: 1 }}>
              <View style={styles.speWrap}>{this.bannerList()}</View>
              <View style={{ width: '100%', height: 8, backgroundColor: '#f4f4f4' }} />
            </View>
          ) : null}
        </View>
      );
    }
    return null;
  }

  async init(id) {
    this.getShopInfo(id);
    this.getRecommend(id);
    this.getList(id, 1);
    this.canClick = true;
    const { invitationCode } = await storage.load({ key: 'userInfo' }).catch(e => e);
    this.invitationCode = invitationCode;
  }

  emptyComponent() {
    const { showEmpty, emptyText } = this.state;
    console.log('-------', emptyText);
    if (showEmpty) {
      return (
        <View style={styles.emptyWrap}>
          <Image style={styles.emptyImg} resizeMode="center" source={{ uri: 'http://family-img.vxiaoke360.com/search-empty.png' }} />
          <Text style={styles.emptyInfo}>{emptyText}</Text>
        </View>
      );
    }
    return null;
  }

  // 业务
  renderList(ele) {
    const { item, index } = ele;
    return (
      <View style={styles.productWrap}>
        <ShopDItem data={item} jumpDetail={this.jumpDetail} index={index} />
      </View>
    );
  }

  // 接口请求

  async getShopInfo(id) {
    const res = await shopDetailInfo(id);
    if (res) {
      const tkl = `${res.name}\n${res.introduce}\n打开米粒生活，查看门店更多优惠\n-----------------\nhttps://www.vxiaoke360.com/H5/mlsh-download-yyb/index.html\n-----------------\n邀请码: ${this
        .invitationCode || ''}`;
      console.log('999999', tkl);
      this.setState({
        shopInfo: res,
        shareTkl: tkl,
      });
    }
  }

  async getRecommend(id) {
    const res = await shopDetailRecommendGoods(id);
    if (res && res.length) {
      this.setState({
        recommendList: res,
      });
    }
  }

  async getList(id, page, value) {
    const { pList } = this.state;
    let newList = [...pList];
    if (page === 1) {
      newList = [];
    }
    let res;
    if (value) {
      res = await shopDetailSearch(this.shopId, encodeURI(value));
    } else {
      res = await shopDetaiPlist(id, page);
    }
    if (res && res.length) {
      if (res.length > 11) {
        this.canLoadMore = true;
      }
      page += 1;
      this.setState({
        pList: [...newList, ...res],
        currentPage: page,
        loadMoreText: res.length > 11 ? '加载中...' : '-我是有底线的-',
        showEmpty: false,
        refreshing: false,
      });
    } else {
      const list = newList.length;
      let loadMoreText;
      if (list) {
        if (list) {
          loadMoreText = '-我是有底线的-';
        } else {
          loadMoreText = '';
        }
      } else {
        loadMoreText = '';
      }
      this.setState({
        pList: newList,
        loadMoreText,
        emptyText: value ? '没有找到您要的宝贝~' : '老板很懒,还没有添加宝贝~',
        showEmpty: !list,
        refreshing: false,
      });
    }
  }

  jumpDetail = id => {
    const { navigation } = this.props;
    navigation.navigate('ProductDetail', { pid: id, shopId: this.shopId });
  };

  clearSearch = () => {
    this.setState(
      {
        searchValue: '',
        showHeader: true,
      },
      () => {
        this.getList(this.shopId, 1);
      }
    );
  };

  closeShare = () => {
    this.setState({
      showShareBox: false,
    });
  };

  // 点击分享
  onPressShare = async () => {
    if (!this.isChecked) {
      const { shareImageUrl } = this.state;
      if (shareImageUrl) {
        this.setState({
          showShareBox: true,
        });
        return;
      }
      console.log('9999999', this.state.shareTkl);
      this.setState({
        qrCodeInfo: '',
        codeUrl: '',
      });
      this.shareToast = Toast.show('分享图片生成中...', {
        duration: 0,
        position: 0,
      });
      this.isChecked = true;
      this.setState({
        qrCodeInfo: `https://family-h5.vxiaoke360.com/h5-mlsh-store/index.html#/Shop?id=${this.shopId}`,
      });
      console.log('000---------0000', this.state.qrCodeInfo);
      const codeUrl = await this.getQRCode();
      if (!codeUrl) {
        Toast.hide(this.shareToast);
        Toast.show('获取二维码失败');
        this.isChecked = false;
        this.currentPid = '';
        return;
      }
      this.setState({
        codeUrl,
      });
      const base64 = await this.getCanvas();
      if (!base64) {
        Toast.hide(this.shareToast);
        Toast.show('获取分享图失败');
        this.isChecked = false;
        return;
      }
      const res = await saveFile({
        fileType: 'base64',
        file: base64,
        location: 'cache',
      });

      if (res) {
        this.setState(
          {
            shareImageUrl: res,
            showShareBox: true,
          },
          () => {
            this.isChecked = false;
          }
        );
        Toast.hide(this.shareToast);
      }
    }
    shareStoreTime(this.shopId);
  };

  // 获取二维码ref
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

  // canvas图片写入
  loadedImg = image => new Promise(resolve => image.addEventListener('load', resolve));
  // 保存图片到本地

  downloadImage = url => {
    return new Promise(resolve => {
      FetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', url)
        .then(resp => {
          return resp.readFile('base64');
        })
        .then(base64Data => {
          resolve(`data:image/jpeg;base64,${base64Data}`);
        });
    });
  };

  // canvas分享图
  handleCanvas = async canvas => {
    const { recommendList, shopInfo, codeUrl } = this.state;
    let shareImageUrl = '';
    if (recommendList[0].shareImageUrl) {
      shareImageUrl = recommendList[0].shareImageUrl;
    } else {
      shareImageUrl = recommendList[0].thumbnail;
    }
    if (!(canvas instanceof Object) && recommendList.length) {
      return;
    }
    canvas.width = 375;
    canvas.height = 660;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 375, 660);

    // 背景图
    const bgImg = new CanvasImage(canvas);
    bgImg.src = base64Img.img6;
    await this.loadedImg(bgImg);
    ctx.drawImage(bgImg, 0, 0, 375, 660);
    ctx.save();

    ctx.shadowOffsetY = 8; // 阴影Y轴偏移
    ctx.shadowOffsetX = 0; // 阴影Y轴偏移
    ctx.shadowBlur = 16; // 模糊尺寸
    ctx.shadowColor = 'rgba(153,153,153, 0.3)'; // 颜色

    // 店铺icon
    const shopIcon = new CanvasImage(canvas);
    shopIcon.src = await this.downloadImage(shopInfo.icon);
    await this.loadedImg(shopIcon);
    ctx.drawImage(shopIcon, 141, 48, 94, 94);
    // ctx.save();
    ctx.restore();

    ctx.fillStyle = '#333';
    ctx.font = '18px PingFangSC-Medium';
    ctx.textAlign = 'center';
    ctx.fillText(shopInfo.name, 187.5, 172);

    ctx.fillStyle = '#666';
    ctx.font = '13px PingFangSC-Regular';
    ctx.textAlign = 'center';
    ctx.fillText(shopInfo.introduce, 187.5, 196);
    ctx.fill();
    ctx.save();

    // 商品图
    const banner1 = new CanvasImage(canvas);
    if (shareImageUrl instanceof Array) {
      banner1.src = await this.downloadImage(shareImageUrl[0]);
    } else {
      console.log(8888888, shareImageUrl);
      banner1.src = await this.downloadImage(shareImageUrl);
    }
    await this.loadedImg(banner1);
    ctx.drawImage(banner1, 0, 217, 250, 250);
    ctx.save();

    if (shareImageUrl instanceof Array && shareImageUrl.length > 1) {
      const banner2 = new CanvasImage(canvas);
      banner2.src = await this.downloadImage(shareImageUrl[1]);
      await this.loadedImg(banner2);
      ctx.drawImage(banner2, 250, 217, 125, 125);
      ctx.save();
    } else {
      ctx.drawImage(banner1, 250, 217, 125, 125);
      ctx.save();
    }
    if (shareImageUrl instanceof Array && shareImageUrl.length > 2) {
      const banner3 = new CanvasImage(canvas);
      banner3.src = await this.downloadImage(shareImageUrl[2]);
      await this.loadedImg(banner3);
      ctx.drawImage(banner3, 250, 342, 125, 125);
      ctx.save();
    } else {
      ctx.drawImage(banner1, 250, 342, 125, 125);
      ctx.save();
    }

    ctx.fillStyle = '#fff';
    ctx.fillRect(24, 498, 124, 124);

    const codeImg = new CanvasImage(canvas);
    codeImg.src = codeUrl;
    await this.loadedImg(codeImg);
    ctx.drawImage(codeImg, 30, 504, 112, 112);
    ctx.save();

    const name = shopInfo.name.length > 12 ? shopInfo.name.substr(0, 12) : shopInfo.name;
    ctx.fillStyle = '#333';
    ctx.font = '16px PingFangSC-Medium';
    ctx.textAlign = 'left';
    ctx.fillText(name, 158, 518);

    const intro = shopInfo.introduce.length > 15 ? shopInfo.introduce.substr(0, 15) : shopInfo.introduce;
    ctx.fillStyle = '#666';
    ctx.font = '12px PingFangSC-Regular';
    ctx.textAlign = 'left';
    ctx.fillText(intro, 158, 540);
    ctx.fill();
    ctx.save();

    canvas.toDataURL('image/jpeg').then(async data => {
      this.canvasImg = data.substr(1, data.length - 2);
    });
  };

  // 页面渲染
  bannerList = () => {
    const { recommendList } = this.state;
    const bannerView = recommendList.map((item, i) => (
      <TouchableOpacity activeOpacity={0.85} style={styles.swiperItem} key={i} onPress={() => this.jumpDetail(item.id)}>
        <ImageBackground style={styles.speWrapBox} source={require('@assets/Shop/shop-detail-bg.png')}>
          {/* <Image style={styles.recBg} source={require('@assets/Shop/shop-detail-bg.png')} /> */}
          <View style={styles.speWrapLeft}>
            <Text style={styles.speTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.spePrice}>
              ¥<Text style={styles.spePriceNum}>{item.discountPrice}</Text>
            </Text>
          </View>
          <Image style={styles.speImg} source={{ uri: item.thumbnail }} />
        </ImageBackground>
      </TouchableOpacity>
    ));
    return (
      <Swiper
        containerStyle={styles.bannerSwiper}
        autoplay
        loop
        autoplayTimeout={Platform.OS === 'ios' ? 2.5 : 4}
        activeDotColor="#fff"
        paginationStyle={{ bottom: 4 }}
        removeClippedSubviews={false}
        dot={
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              width: 5,
              height: 5,
              borderRadius: 2.5,
              marginRight: 4,
            }}
          />
        }
        activeDot={
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 1)',
              width: 5,
              height: 5,
              borderRadius: 2.5,
              marginRight: 4,
            }}
          />
        }
      >
        {bannerView}
      </Swiper>
    );
  };

  // 功能函数
  _keyExtractor = (item, index) => `${index}`;

  loadingText = () => {
    const { loadMoreText } = this.state;
    if (loadMoreText) {
      return <Text style={styles.loadingText}>{loadMoreText}</Text>;
    }
    return null;
  };

  blur() {
    this.setState(
      {
        showHeader: true,
        searchValue: '',
      },
      () => {
        Toast.hide(this.shareToast);
        this.getList(this.shopId, 1);
      }
    );
  }

  render() {
    const { pList, searchValue, showShareBox, shopInfo, recommendList, codeUrl, qrCodeInfo, shareImageUrl, shareTitle, shareText, shareTkl, refreshing } = this.state;
    const { hideBack, navigation } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
        <View style={[styles.headerWrap, { height: global.headerHeight, paddingTop: global.statusBarHeight }]}>
          {!hideBack ? (
            <TouchableOpacity style={styles.backWrap} onPress={() => navigation.goBack()}>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'} size={25} color="#666" />
            </TouchableOpacity>
          ) : null}
          <View style={styles.searchWrap}>
            <View style={styles.searchBox}>
              <Image style={styles.searchIcon} source={require('../../../assets/icon-search2.png')} />
              <TextInput
                style={styles.searchInput}
                placeholder="请输入商品关键词..."
                onChangeText={this.onChangeText}
                returnKeyType="search"
                onSubmitEditing={this.onSubmitEditing}
                value={searchValue}
              />
              <TouchableOpacity style={styles.cancelInner} onPress={this.clearSearch}>
                <Ionicons style={styles.cancelIcon} name="ios-close" size={22} color="#999" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <Image
          source={{ uri: this.state.shareImg }}
          style={{ width: 375, height: 660 }}
        /> */}
        <FlatList
          data={pList}
          keyExtractor={this._keyExtractor}
          renderItem={item => this.renderList(item)}
          onEndReachedThreshold={0.2}
          onEndReached={this.onFooterLoad}
          ListHeaderComponent={() => this.hederComponent()}
          ListFooterComponent={() => this.loadingText()}
          ListEmptyComponent={() => this.emptyComponent()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onHeaderRefresh} />}
        />
        {qrCodeInfo ? (
          <View style={styles.qrCode}>
            <QRCode value={qrCodeInfo} logo={require('../../../assets/icon-mili.png')} getRef={c => (this.svg = c)} />
          </View>
        ) : null}
        {showShareBox ? (
          <ShareBox closeShare={this.closeShare} showShareBox={showShareBox} shareImageUrl={shareImageUrl} shareTitle={shareTitle} shareText={shareText} fromSource="ShopDetail" shareTkl={shareTkl} />
        ) : null}

        {codeUrl && shopInfo && recommendList.length ? (
          <View style={styles.canvasWrap}>
            <Canvas ref={this.handleCanvas.bind(this)} />
          </View>
        ) : null}
        <NavigationEvents onDidBlur={() => this.blur()} />
      </View>
    );
  }
}
