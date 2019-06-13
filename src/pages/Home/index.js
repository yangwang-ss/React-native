/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Platform, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, RefreshControl, StatusBar, ToastAndroid, BackHandler, NetInfo } from 'react-native';
import Toast from 'react-native-root-toast';
import FastImage from 'react-native-fast-image';
import SwiperV from '@nart/react-native-swiper';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationEvents } from 'react-navigation';
import RNAlibcSdk from 'react-native-alibc-sdk';
import JPush from 'jpush-react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import Layout from '@constants/Layout';
import Products from '@components/PrdList';
import CategoryItem from '@components/PrdDoubleItem';
import CustomTabBar from '@components/CustomTabBar';
import LoginTip from '@components/LoginTip';
import SortTab from '@components/SortTab';
import Barrage from '@components/Barrage';
import NewToast from '@components/NewToast';
import BannerComponent from './BannerComponent';
import AdBannerComponents from './AdBannerComponents';
import ActiveCategoryComponent from './ActiveCategoryComponent';
import {
  getTopTabs,
  getBanners,
  getNotice,
  getActiveCategory,
  getIndexProducts,
  getParentCategory,
  getPrdByCategoryId,
  tbbcBinding,
  isTbAuth,
  getPrdByGuessLike,
  getAdImgs,
  appErrorLog,
  getInitStore,
  getBarrage,
} from '@api';
import NetwokErr from '../NetwokErr';
import store from '../../store/configureStore';
import fixedBtn from '../../actions/fixedBtn';

const headerHeight = 124;
type Props = {
  navigation: Object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  adModalWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 99,
    elevation: 99,
  },
  adModalBg: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  adModalBox: {
    position: 'absolute',
    top: '26%',
    left: 0,
    width: '100%',
    paddingLeft: 65,
    paddingRight: 65,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  adModalImgWrap: {
    width: '100%',
    height: 260,
    backgroundColor: '#f60',
    borderRadius: 20,
    overflow: 'hidden',
  },
  adModalImg: {
    width: '100%',
    height: '100%',
  },
  adModalCloseBox: {
    width: 39,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  adModalCloseLine: {
    height: 48,
    width: 2,
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
  },
  adModalCloseBtn: {
    marginTop: -5,
  },
  refreshingTextWrap: {
    position: 'absolute',
    top: 70,
    left: 0,
    zIndex: 3,
    width: Layout.window.width,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  refreshingText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
  },
  loadingTextWrap: {
    width: Layout.window.width,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  loadingTextEmpty: {
    marginTop: 200,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
  },
  recommend: {
    width: Layout.window.width,
    overflow: 'hidden',
  },
  linearGradient: {
    position: 'absolute',
    width: '100%',
    height: 217,
  },
  searchBox: {
    marginTop: 50,
    marginRight: 12,
    marginLeft: 12,
    borderRadius: 16,
  },
  shopName: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'PingFangSC-Semibold',
    flex: 1,
    marginLeft: 6,
    marginRight: 6,
    textAlign: 'center',
  },
  headBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 32,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  searchInput: {
    width: '100%',
    height: 32,
    marginTop: 12,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#999',
    textAlign: 'left',
  },
  topTabtextStyle: {
    color: '#fff',
    fontFamily: 'PingFangSC-Medium',
  },
  topTabLineStyle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
  },
  tabs: {
    fontSize: 14,
    color: '#fff',
    marginRight: 24,
    fontFamily: 'PingFangSC-Medium',
  },
  tabOnly: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 6,
  },
  wrapper: {
    width: Layout.window.width,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  bannerWrap: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  category: {
    paddingTop: 15,
    paddingLeft: 6,
    paddingRight: 6,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  categoryFour: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityItem: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryImg: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    marginBottom: 5,
  },
  activityImg: {
    width: 48,
    height: 48,
    resizeMode: 'cover',
    marginBottom: 5,
  },
  categoryImgText: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
    backgroundColor: 'transparent',
  },
  categoryText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activityText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  productsWrap: {
    backgroundColor: '#f4f4f4',
  },
  parentCategoryWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#fff',
    width: '100%',
  },
  parentCategoryContent: {
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  sortTabsWrap: {
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderTopColor: '#f4f4f4',
    borderBottomColor: '#f4f4f4',
    backgroundColor: '#fff',
  },
  categoryPrdWrap: {
    backgroundColor: '#f4f4f4',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
  },
  mlshNoticeWrap: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 52,
  },
  noticeWrap: {
    position: 'absolute',
    top: '50%',
    left: '32%',
    marginTop: -22,
    width: '62%',
    height: 34,
    justifyContent: 'center',
  },
  mlshNotice: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  mlshNoticeText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333',
  },
  mlshNoticeImg: {
    width: '100%',
    height: '100%',
    marginBottom: 10,
  },
  prefectureWrap: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: 16,
  },
  prefectureContent: {
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginBottom: 17,
  },
  prefectureItem: {
    width: '50%',
  },
  prefectureImg: {
    width: '100%',
    height: 140,
  },
  shoppingCart: {
    width: 26,
    height: 21,
  },
  scanIcon: {
    width: 26,
    height: 21,
  },
});
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.tabs = [{ name: '推荐', id: 'recommend' }, { name: '猜你喜欢', id: 'guessLike' }];
    this.state = {
      scrollHeight: 0,
      refreshing: false,
      hasCoupon: true,
      hasNotice: true,
      canChangeTab: true,
      loadMoreText: '',
      loadingState: {
        loading: '加载中...',
        noMoreData: '-我是有底线的-',
        empty: '空空如也~',
      },
      curPage: 1,
      pageSize: 10,
      curCategoryPage: 1,
      curTabId: 'recommend',
      sortTab: 0,
      sortType: '',
      sortParams: '',
      prefecture: [],
      noticeList: [],
      tabs: [{ name: '推荐', id: 'recommend' }, { name: '猜你喜欢', id: 'guessLike' }],
      activeCategory: [],
      parentCategory: [],
      banners: [],
      dataList: [],
      categoryDataList: [],
      isConnected: true,
      isShowLogin: false,
      adImgs: {},
      isModalAd: false,
      storeInfo: {},
      showNewToast: false,
      barrageList: [],
    };
  }

  async componentDidMount() {
    AnalyticsUtil.beginLogPageView('Home');
    this.netStatus();
    this.init();
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

  /**
   * 列表渲染
   */
  tabList = () => {
    const { tabs } = this.state;
    return (
      <ScrollableTabView
        tabBarActiveTextColor="#fff"
        tabBarInactiveTextColor="#333"
        tabBarTextStyle={[styles.topTabtextStyle]}
        tabBarUnderlineStyle={styles.topTabLineStyle}
        onChangeTab={this.tabChange}
        renderTabBar={() => <CustomTabBar />}
      >
        {tabs.map((item, i) => (
          <Text tabLabel={item.name} tabId={item.id} number={item.id} key={i} />
        ))}
      </ScrollableTabView>
    );
  };

  productList = () => {
    return this.state.dataList.map((item, i) => {
      return <Products storeInfo={this.state.storeInfo} key={i} item={item} index={i} jumpDetail={this.jumpDetail} />;
    });
  };

  categoryItem = () => {
    const { categoryDataList } = this.state;
    return categoryDataList.map((item, i) => {
      if (i % 2 == 0) {
        item.needMR = true;
      } else {
        item.needMR = false;
      }
      return <CategoryItem key={i} item={item} index={i} jumpDetail={this.jumpDetail} />;
    });
  };

  parentCategoryList = () => {
    const { parentCategory } = this.state;
    return this.setCategory(parentCategory, 'tabCategory');
  };

  setCategory = (category, type) => {
    const array = [...category];
    const result = [];
    let itemNum = 4;
    if (type == 'activity') {
      itemNum = 5;
    }
    for (let i = 0, len = array.length; i < len; i += itemNum) {
      result.push(array.slice(i, i + itemNum));
    }
    return result.map((elem, index) => {
      if (elem.length < itemNum) {
        for (let index = 0; index <= itemNum - elem.length; index++) {
          elem.push({});
        }
      }
      return (
        <View key={index} style={styles.categoryFour}>
          {elem.map((item, i) => {
            const { name, title } = item;
            let emptyItem = '';
            let categoryItem = '';
            if (name || title) {
              if (type == 'activity') {
                categoryItem = (
                  <TouchableOpacity style={[styles.activityItem]} onPress={() => this.bannerJump(item, 'category')} activeOpacity={Layout.activeOpacity}>
                    <Image style={styles.activityImg} source={{ uri: item.imageUrl }} roundAsCircle imageStyle={{ borderRadius: 30 }} />
                    <Text style={styles.activityText}>{item.title}</Text>
                  </TouchableOpacity>
                );
              } else {
                categoryItem = (
                  <TouchableOpacity style={styles.categoryItem} onPress={() => this.categoryJump(item, i)} activeOpacity={Layout.activeOpacity}>
                    <Image style={styles.categoryImg} source={{ uri: item.icon }} roundAsCircle imageStyle={{ borderRadius: 30 }} />
                    <Text style={styles.categoryText}>{item.name || ''}</Text>
                  </TouchableOpacity>
                );
              }
            } else if (type == 'activity') {
              emptyItem = (
                <View style={styles.activityItem}>
                  <View style={styles.activityImg} />
                  <Text style={styles.activityText}>{item.title || ''}</Text>
                </View>
              );
            } else {
              emptyItem = (
                <View style={styles.categoryItem}>
                  <Text style={styles.categoryImgText} />
                  <Text style={styles.categoryText}>{item.name || ''}</Text>
                </View>
              );
            }
            return <View key={i}>{name || title ? categoryItem : emptyItem}</View>;
          })}
        </View>
      );
    });
  };

  prefectureRender = () => {
    const { prefecture } = this.state;
    return prefecture.map((item, i) => (
      <TouchableOpacity key={i} style={styles.prefectureItem} onPress={() => this.bannerJump(item, 'prefecture')} activeOpacity={Layout.activeOpacity}>
        <FastImage style={[styles.prefectureImg]} resizeMode={FastImage.resizeMode.cover} source={{ uri: item.imageUrl }} />
      </TouchableOpacity>
    ));
  };

  noticeList = () => {
    const { noticeList } = this.state;
    return noticeList.map((item, i) => (
      <TouchableOpacity key={i} style={styles.mlshNotice} onPress={() => this.noticeJump(item)} activeOpacity={Layout.activeOpacity}>
        <Text style={styles.mlshNoticeText} numberOfLines={1}>
          {item.notice}
        </Text>
      </TouchableOpacity>
    ));
  };

  /**
   * 事件绑定
   */
  tabChange = info => {
    console.log('tabChange===', info.ref.props);
    const item = info.ref.props;
    const { curTabId, canChangeTab } = this.state;
    if (curTabId == item.tabId || !canChangeTab) return;
    if (item.tabId == 'recommend') {
      this.setState({
        curTabId: 'recommend',
      });
    } else if (item.tabId == 'guessLike') {
      const { tabId, tabLabel } = item;
      AnalyticsUtil.eventWithAttributes('topTab_click', { tabId, tabLabel });
      this.setState(
        {
          curTabId: tabId,
          curCategoryPage: 1,
          canChangeTab: false,
          categoryDataList: [],
        },
        () => {
          this.getPrdByGuessLike();
        }
      );
    } else {
      const { tabId, tabLabel } = item;
      AnalyticsUtil.eventWithAttributes('topTab_click', { tabId, tabLabel });
      this.setState(
        {
          curTabId: tabId,
          curCategoryPage: 1,
          canChangeTab: false,
          parentCategory: [],
          categoryDataList: [],
        },
        () => {
          this.getParentCategory(item.tabId);
          this.getPrdByCategoryId();
        }
      );
    }
  };

  searchJump = () => {
    AnalyticsUtil.event('enter_search');
    this.props.navigation.navigate('SearchIndex');
  };

  bannerJump = async (item, str) => {
    console.log('bannerJump===', str, item);
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
    if (str === 'indexAd' && item.isStoreInfo && item.isShow !== 1) {
      return;
    }
    const isJumpH5 = await this.isJumpH5(item.needLogin);
    if (!isJumpH5 && item.needLogin === 1) {
      return;
    }
    switch (type) {
      case 1:
        this.props.navigation.navigate('WebView', { title, id, src: value });
        break;
      case 2:
        if (str === 'category') {
          this.props.navigation.navigate('CategorySecond', {
            title,
            id: value,
          });
        } else {
          this.props.navigation.navigate(value, { title, id, ...params });
        }
        break;
      case 3:
        if (item.isStoreInfo) {
          this.props.navigation.navigate('ShopDetail', { shopId: id });
        } else {
          this.props.navigation.navigate('Nine', { title });
        }
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
        this.props.navigation.navigate('TWebView', { title, id, src: value });
        break;
      case 7:
        this.props.navigation.navigate('ReachargeIndex', { title });
        break;
      case 8:
        this.props.navigation.navigate('Detail', { pid: value });
        break;
      default:
        break;
    }
  };

  categoryJump = async (item, index) => {
    console.log('categoryJump===', item, index);
    const { id, name, params } = item;
    AnalyticsUtil.eventWithAttributes('category_click', { name, index });
    const isJumpH5 = await this.isJumpH5(item.needLogin);
    if (!isJumpH5 && item.needLogin === 1) {
      return;
    }
    this.props.navigation.navigate('Category', {
      title: name,
      cid: id,
      ...params,
    });
  };

  jumpDetail = item => {
    AnalyticsUtil.eventWithAttributes('enter_Detail', {
      id: item.id,
      title: item.title,
    });
    this.props.navigation.navigate('Detail', { pid: item.id });
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

  async noticeJump(item) {
    const { type, value, title, pid } = item;
    AnalyticsUtil.eventWithAttributes('notice_click', item);
    console.log('noticeJump=', item);
    const isJumpH5 = await this.isJumpH5(item.needLogin);
    if (!isJumpH5 && item.needLogin === 1) {
      return;
    }
    switch (type) {
      case 1:
        this.props.navigation.navigate('WebView', { title, src: value });
        break;
      case 2:
        this.props.navigation.navigate(value, { title, pid });
        break;
      case 3:
        this.props.navigation.navigate('TWebView', { title, src: value });
        break;
      default:
        break;
    }
  }

  async isLogin() {
    const { token } = (await storage.load({
      key: 'token',
    }).catch(e => e)) || {};
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  async isJumpH5(type) {
    if (type !== 1) {
      return false;
    }
    const { isParent } = (await storage.load({
      key: 'userInfo',
    }).catch(e => e)) || {};
    const { token } = (await storage.load({
      key: 'token',
    }).catch(e => e)) || {};
    if (token && isParent) {
      return true;
    } else if (token && !isParent) {
      if (isParent === undefined || isParent === null) {
        storage.remove({
          key: 'token',
        });
        this.props.navigation.navigate('Auth');
      }
      this.props.navigation.navigate('Invitation');
      return false;
    } else {
      this.props.navigation.navigate('Auth');
      return false;
    }
  }

  // 下拉刷新
  onHeaderRefresh = () => {
    console.log('onHeaderRefresh==触发');
    const { curTabId } = this.state;
    if (curTabId == 'recommend') {
      this.setState(
        {
          refreshing: true,
          curPage: 1,
          dataList: [],
        },
        () => {
          this.init();
        }
      );
    } else if (curTabId == 'guessLike') {
      this.setState(
        {
          refreshing: true,
          curCategoryPage: 1,
          categoryDataList: [],
        },
        () => {
          this.getPrdByGuessLike();
        }
      );
    } else {
      this.setState(
        {
          refreshing: true,
          curCategoryPage: 1,
          categoryDataList: [],
        },
        () => {
          this.getPrdByCategoryId();
        }
      );
    }
  };

  // 上拉加载
  onFooterLoad = () => {
    console.log('onFooterLoad==触发');
    this.getPrdByCategoryId();
  };

  _onScroll(event) {
    if (!this.isLoaded) return;
    const { curTabId } = this.state;
    this.setState({
      scrollHeight: event.nativeEvent.contentOffset.y,
    });
    if (event.nativeEvent.contentOffset.y + Layout.window.height - 100 > this.state.contentHeight) {
      console.log(this.state.curPage);
      if (curTabId === 'recommend') {
        this.getIndexProducts();
      } else if (curTabId === 'guessLike') {
        this.getPrdByGuessLike();
      } else {
        this.getPrdByCategoryId();
      }
    }
  }

  _onContentSizeChange(w, h) {
    this.setState({
      contentHeight: h,
    });
  }

  changeSort = (item, sortType, sortParams) => {
    this.setState(
      {
        curCategoryPage: 1,
        categoryDataList: [],
        sortType,
        sortTab: item.sortIndex,
        sortParams,
      },
      () => {
        this.getPrdByCategoryId();
      }
    );
  };

  changeTagQuan = () => {
    let { hasCoupon } = this.state;
    hasCoupon = !hasCoupon;
    this.setState(
      {
        hasCoupon,
        curCategoryPage: 1,
        categoryDataList: [],
      },
      () => {
        this.getPrdByCategoryId();
      }
    );
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

  listHandle = res => {
    let { loadingState, curCategoryPage } = this.state;
    let loadMoreText = loadingState.loading;
    if (res && res.length) {
      curCategoryPage++;
      this.setState(
        {
          refreshing: false,
          canChangeTab: true,
          categoryDataList: [...this.state.categoryDataList, ...res],
          loadMoreText: '',
          curCategoryPage,
        },
        () => {
          this.isLoaded = true;
        }
      );
    } else {
      if (this.state.categoryDataList.length) {
        loadMoreText = loadingState.noMoreData;
      } else {
        loadMoreText = loadingState.empty;
      }
      this.setState({
        refreshing: false,
        canChangeTab: true,
        loadMoreText,
      });
      this.isLoaded = true;
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
  // 推荐商品
  isLoaded = true;

  async getIndexProducts() {
    this.isLoaded = false;
    let { loadingState, curPage, pageSize } = this.state;
    let loadMoreText = loadingState.loading;
    this.setState({ loadMoreText });
    const params = {
      page: curPage,
      pageSize,
    };
    const res = await getIndexProducts(params);
    console.log('getIndexProducts===', res);
    if (res && res.length) {
      curPage++;
      this.setState(
        {
          refreshing: false,
          dataList: [...this.state.dataList, ...res],
          loadMoreText: loadingState.loading,
          curPage,
        },
        () => {
          this.isLoaded = true;
        }
      );
    } else {
      if (this.state.dataList.length) {
        loadMoreText = loadingState.noMoreData;
      } else {
        loadMoreText = loadingState.empty;
      }
      this.setState({
        refreshing: false,
        loadMoreText,
      });
      this.isLoaded = true;
    }
  }

  // 顶部tab
  async getTopTabs() {
    const res = await getTopTabs();
    console.log('getTopTabs===', res);
    if (res && res.length) {
      const tabs = [...this.tabs, ...res];
      tabs.forEach((elem, i) => {
        if (i != 0) {
          elem.active = false;
        }
      });
      this.setState({ tabs });
    }
  }

  // 推荐banner
  async getBanners() {
    const res = await getBanners();
    console.log('getBanners===', res);
    if (res && res.length) {
      this.setState({
        banners: res,
      });
    }
  }

  // 推荐活动类目
  async getActiveCategory(position) {
    console.log('position===', position);
    const res = await getActiveCategory(position || 1);
    console.log('getActiveCategory===', res);
    if (res && res.length) {
      if (position == 1) {
        this.setState({
          activeCategory: res,
        });
      } else {
        this.setState({
          prefecture: res,
        });
      }
    }
  }

  // 父级类目
  async getParentCategory(parentId) {
    const res = await getParentCategory(parentId);
    console.log('getParentCategory===', res);
    if (res && res.length) {
      this.setState({
        parentCategory: res,
      });
    }
  }

  // 父级类目商品
  async getPrdByCategoryId() {
    if (!this.isLoaded) {
      return;
    }
    this.isLoaded = false;
    const { loadingState, hasCoupon, curCategoryPage, pageSize, sortParams, curTabId } = this.state;
    const loadMoreText = loadingState.loading;
    this.setState({ loadMoreText });
    const { deviceId: deviceValue, deviceType } = Layout.device;
    const params = {
      categoryId: curTabId,
      sort: sortParams,
      page: curCategoryPage,
      pageSize,
      deviceValue,
      deviceType,
      hasCoupon,
    };
    const res = await getPrdByCategoryId(params);
    console.log('getPrdByCategoryId===', res);
    this.listHandle(res);
  }

  // 猜你喜欢商品
  async getPrdByGuessLike() {
    if (!this.isLoaded) {
      return;
    }
    this.isLoaded = false;
    const { loadingState, curCategoryPage, pageSize } = this.state;
    const loadMoreText = loadingState.loading;
    this.setState({ loadMoreText });
    const params = {
      page: curCategoryPage,
      pageSize,
    };
    const res = await getPrdByGuessLike(params);
    console.log('getPrdByGuessLike===', res);
    this.listHandle(res);
  }

  // 公告
  async getNotice() {
    const res = await getNotice();
    console.log('getNotice===', res);
    if (res && res.length) {
      this.setState({
        noticeList: res,
      });
    }
  }

  // 广告位
  async getAdImgs(storeInfo) {
    this.showNewToast = false;
    this.showFixed = false;
    const res = await getAdImgs();
    console.log('getAdImgs===', res);
    if (res && res.length) {
      const { adImgs } = this.state;
      const adImgArr = [];
      if (storeInfo) {
        storeInfo.type = 3;
        storeInfo.isStoreInfo = true;
        adImgArr.push(storeInfo);
      }
      res.map(item => {
        if (item.position === 3) {
          adImgArr.push(item);
          adImgs.indexAd = adImgArr;
        } else if (item.position === 4) {
          adImgs.indexModalAd = item;
        } else if (item.position === 9) {
          this.showFixed = true;
          if (!this.isFirst) {
            this.showNewToast = true;
            this.isFirst = true;
          }
          this.newToastObj = item;
          store.dispatch(fixedBtn({ isShow: !this.state.isShowLogin, datas: item }));
        }
      });
      if (!this.showFixed) {
        store.dispatch(fixedBtn({ isShow: false }));
      }
      this.setState({
        adImgs,
        showNewToast: this.showNewToast,
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
      storage.save({
        key: 'storeInfo',
        data: res,
      });
    }
    this.getAdImgs(res);
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

  blur() {
    this.setState({
      showNewToast: false,
    });
  }

  /**
   * 初始化
   */
  init = () => {
    this.initData();
    this.getTopTabs();
    this.getBanners();
    this.getNotice();
    this.getActiveCategory(1);
    this.getActiveCategory(2);
    this.getIndexProducts();
    this.getBarrage();
  };

  initData = () => {
    this.setState({
      curPage: 1,
    });
  };

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

  modifyLogin = () => {
    this.setState({
      isShowLogin: false,
    });
  };

  onDidFocus() {
    this.isShowLogin();
    this.getInitStore();
  }

  async isShowLogin() {
    const boo = await this.isLogin();
    this.setState({
      isShowLogin: !boo,
    });
  }

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

  closeNewToast = () => {
    this.setState({
      showNewToast: false,
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

  render() {
    const {
      loadMoreText,
      sortType,
      loadingState,
      sortTab,
      curTabId,
      banners,
      refreshing,
      tabs,
      parentCategory,
      hasCoupon,
      hasNotice,
      prefecture,
      noticeList,
      isConnected,
      isShowLogin,
      adImgs,
      isModalAd,
      activeCategory,
      storeInfo,
      showNewToast,
      barrageList,
    } = this.state;
    const { isReview } = global;
    return (
      <AndroidBackHandler onBackPress={() => this.onBackButtonPressAndroid()} style={styles.container}>
        <StatusBar barStyle="light-content" />
        {curTabId === 'recommend' && <LinearGradient style={[styles.linearGradient, { zIndex: 0 }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#e63cb3', '#f03066']} />}
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#e63cb3', '#f03066']}
          style={{
            height: (global.statusBarHeight + 10 || 0) + headerHeight,
            zIndex: 1,
            elevation: 1,
            width: '100%',
          }}
        >
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
          {tabs.length > 2 && this.tabList()}
        </LinearGradient>
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

        {isConnected ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ justifyContent: 'space-between' }}
            onContentSizeChange={(w, h) => this._onContentSizeChange(w, h)}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onHeaderRefresh} />}
            onScroll={e => this._onScroll(e)}
          >
            {curTabId == 'recommend' ? (
              <View style={styles.recommend}>
                <View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    paddingTop: 60,
                  }}
                >
                  <Image source={require('@assets/img-arc.png')} style={{ width: '100%', height: 40 }} />
                  <View
                    style={{
                      width: '100%',
                      height: 200,
                      backgroundColor: '#fff',
                    }}
                  />
                </View>
                <View style={styles.bannerWrap}>
                  <BannerComponent banners={banners} bannerJump={(item, str) => this.bannerJump(item, str)} />
                </View>
                <View style={styles.category}>
                  <ActiveCategoryComponent activeCategory={activeCategory} bannerJump={(item, str) => this.bannerJump(item, str)} categoryJump={(item, index) => this.categoryJump(item, index)} />
                </View>
                {hasNotice && (noticeList && noticeList.length > 0) && (
                  <View style={styles.mlshNoticeWrap}>
                    <FastImage style={styles.mlshNoticeImg} resizeMode={FastImage.resizeMode.contain} source={require('@assets/bg-notice.png')} />
                    <SwiperV
                      containerStyle={styles.noticeWrap}
                      horizontal={false}
                      autoplay
                      loop
                      index={0}
                      scrollEnabled={false}
                      showsPagination={false}
                      autoplayTimeout={Platform.OS === 'ios' ? 2.5 : 6}
                      removeClippedSubviews={false}
                    >
                      {this.noticeList()}
                    </SwiperV>
                  </View>
                )}
                {adImgs.indexAd && !isReview && <AdBannerComponents banners={adImgs.indexAd} bannerJump={this.bannerJump} />}
                {prefecture && prefecture.length > 0 && (
                  <View style={styles.prefectureWrap}>
                    <View style={styles.prefectureContent}>{this.prefectureRender()}</View>
                  </View>
                )}
                <View style={styles.productsWrap}>{this.productList()}</View>
              </View>
            ) : (
              <View>
                {parentCategory.length > 0 && curTabId !== 'guessLike' && (
                  <View>
                    <View style={styles.parentCategoryWrap}>
                      <View style={styles.parentCategoryContent}>{this.parentCategoryList()}</View>
                    </View>
                    <View style={styles.sortTabsWrap}>
                      <SortTab sortType={sortType} sortTab={sortTab} changeSort={this.changeSort} hasCoupon={hasCoupon} changeTagQuan={this.changeTagQuan} />
                    </View>
                  </View>
                )}
                <View style={[styles.categoryPrdWrap, curTabId !== 'guessLike' && parentCategory.length > 0 && { paddingTop: 0 }]}>{this.categoryItem()}</View>
              </View>
            )}
            <View style={[styles.loadingTextWrap, loadMoreText == loadingState.empty && styles.loadingTextEmpty]}>
              <Text style={styles.loadingText}>{loadMoreText}</Text>
            </View>
          </ScrollView>
        ) : (
          <NetwokErr />
        )}
        {barrageList.length ? <Barrage barrageList={barrageList} top={157} /> : null}
        {showNewToast && !isShowLogin ? <NewToast closeNewToast={this.closeNewToast} navigation={this.props.navigation} datas={this.newToastObj} /> : null}
        {!isReview && isShowLogin && <LoginTip navigation={this.props.navigation} modifyLogin={this.modifyLogin} getInitStore={this.getInitStore.bind(this)} getAdImgs={() => this.getAdImgs()} />}
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
        <NavigationEvents onDidFocus={() => this.onDidFocus()} onDidBlur={() => this.blur()} />
      </AndroidBackHandler>
    );
  }
}
