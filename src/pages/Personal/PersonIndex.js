/**
 * 个人中心
 *
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Toast from 'react-native-root-toast';
import RNAlibcSdk from 'react-native-alibc-sdk';
import { version } from '../../../package';
import HighVip from '../../components/highVip';
import { refreshUserInfo, getMoneyCount, myFriendCount, getAdImgs, appErrorLog, getUpLink } from '../../services/api';
import VipUpModal from '../../components/VipUpModal';
import Layout from '../../constants/Layout';
import SalesmanList from '../Salesman/SalesmanList';
import Swiper2 from 'react-native-swiper';

const activeOpacity = 0.8;
export default class Personal extends Component {
  state = {
    moneyInfo: {},
    vipType: 0,
    userInfo: {},
    inputValue: '',
    isVipUpModal: false,
    friendCount: 0,
    upLink: '',
    token: '',
    params: {},
    bottomAdArr: [],
    topAdArr: [],
  };
  async componentDidMount() {
    const { deviceId, platform, deviceModel, deviceBrand, userAgent } = Layout.device;
    const urlParams = {
      deviceId,
      platform,
      deviceModel,
      deviceBrand,
      userAgent,
      version,
    };
    const { token } =
      (await storage
        .load({
          key: 'token',
        })
        .catch(e => e)) || {};
    this.setState({ token: token, params: urlParams }, () => {
      console.log('token=====', this.state.token);
      console.log('params=====', this.state.params);
    });
  }
  init() {
    this.refreshUserInfo();
    this.getMoneyInfo();
    this.getFirendNum();
    this.getAdImgs();
  }

  jumpPage = async route => {
    /**
     * replace 替换路由
     * navigate 进入下一级
     * goBack 返回上一级
     */
    const { userInfo } = this.state;
    switch (route) {
      case 'profit':
        this.props.navigation.navigate('Profit');
        break;
      case 'Monthfit':
        this.props.navigation.navigate('Monthfit');
        break;
      case 'Historyfit':
        this.props.navigation.navigate('Historyfit');
        break;
      case 'Myorder':
        this.props.navigation.navigate('Myorder');
        AnalyticsUtil.event('personalIndex_go_myOrder');
        break;
      case 'Mycollect':
        this.props.navigation.navigate('Mycollect', {
          vipType: this.state.vipType,
        });
        AnalyticsUtil.event('personalIndex_go_myCollect');
        break;
      case 'cutPriceRemind':
        this.props.navigation.navigate('cutPriceRemind', {
          vipType: this.state.vipType,
        });
        AnalyticsUtil.event('personalIndex_go_myCollect');
        break;
      case 'widthDraw':
        this.props.navigation.navigate('WidthDraw');
        break;
      case 'Information':
        this.props.navigation.navigate('Information', {
          userInfo: this.state.userInfo,
        });
        break;
      case 'Dailytool':
        this.props.navigation.navigate('Dailytool');
        break;
      case 'VipIndex':
        this.props.navigation.navigate('VipIndex');
        break;
      case 'shopCar':
        const isLogin = await new Promise(resolve => {
          RNAlibcSdk.isLogin((err, isLogin) => {
            if (!err) {
              resolve(isLogin);
            }
          });
        });
        if (isLogin) {
          this.props.navigation.navigate('Cart', { title: '购物车', type: 'cart' });
          AnalyticsUtil.event('personalIndex_go_tb_shoppingCart');
        } else {
          RNAlibcSdk.login(err => {
            if (!err) {
              this.props.navigation.navigate('Cart', { title: '购物车', type: 'cart' });
              AnalyticsUtil.event('personalIndex_go_tb_shoppingCart');
            } else if (err.code === 1004) {
              Toast.show('授权已取消！');
            } else {
              appErrorLog(err);
              Toast.show('授权失败，请稍后重试！');
            }
          });
        }
        break;
      case 'Suggestion':
        this.props.navigation.navigate('Suggestion');
        break;
      case 'Settings':
        this.props.navigation.navigate('Settings');
        break;
      case 'WaitBack':
        this.props.navigation.navigate('WaitBack');
        break;
      case 'Question':
        this.props.navigation.navigate('WebView', {
          title: '常见问题',
          // src: 'https://www.vxiaoke360.com/H5/mlsh-question/index.html',
          src: 'http://192.168.10.111:3000/#/tm',
        });
        break;
      case 'shopMessageManage':
        this.props.navigation.navigate('WebView', {
          title: '门店管理',
          src: `http://family-h5.vxiaoke360.com/fromSubmit/index.html#/shopManage`,
          disabledReload: true,
          isUpload: true,
        });
        break;
      case 'CourseIndex':
        this.props.navigation.navigate('CourseIndex', { tagId: 4776705892005504 });
        break;
      case 'Service':
        this.props.navigation.navigate('Service', {
          vipType: this.state.vipType,
        });
        break;
      case 'MyInviter':
        this.props.navigation.navigate('MyInviter', { isAgent: userInfo.isAgent });
        AnalyticsUtil.event('personalIndex_go_myFriend');
        break;
      case 'HpWallet':
        this.props.navigation.navigate('HpWallet');
        break;
      case 'TodayList':
        this.props.navigation.navigate('TodayList');
        break;
      case 'InvitationShare':
        this.props.navigation.navigate('InvitationShare');
        AnalyticsUtil.event('personalIndex_click_inviteFriend');
        break;
      case 'OrderList': // 订单管理
        this.props.navigation.navigate('OrderList');
        break;
      case 'ShopOwnerList': // 店长管理
        this.props.navigation.navigate('ShopOwnerList');
        break;
      case 'GoodsReport': // 运营报表
        this.props.navigation.navigate('GoodsReport');
        break;
      case 'GoodManage': // 商品管理
        this.props.navigation.navigate('GoodManage');
        break;
      case 'StoreOrder': // 门店订单
        this.props.navigation.navigate('StoreOrder');
        break;
      case 'CityFit':
        this.props.navigation.navigate('WebView', {
          title: '我的权益',
          src: 'https://family-h5.vxiaoke360.com/h5-mlsh-store/index.html#/myRights',
        });
        break;
      case 'MobileLogin': // 门店演示
        this.props.navigation.navigate('MobileLogin');
        break;
      case 'SalesmanList':
        this.props.navigation.navigate('SalesmanList');
        break;
      case 'SalesManShopownerList':
        this.props.navigation.navigate('SalesManShopownerList');
        break;
      case 'zeroShopping':
        this.props.navigation.navigate('WebView', {
          title: '新人0元购',
          src: 'https://family-h5.vxiaoke360.com/h5-mlsh-new-people/index.html',
        });
        break;
      case 'zeroExamination':
        this.props.navigation.navigate('WebView', {
          title: '0元体检福利',
          src: 'http://family-h5.vxiaoke360.com/fromSubmit/index.html#/shanzhen',
        });
        break;
      case 'ServiceProviderList':
        this.props.navigation.navigate('ServiceProviderList', {
          type: userInfo.roleId === 60 ? 2 : 1,
        });
        break;
      default:
        break;
    }
  };

  adJump = async (item, str) => {
    console.log('adJump===', item);
    // 类型0，单纯图片，1 h5地址(自己写的h5地址)，2 商品类目列表商品界面，3, 9.9包邮，4 淘宝地址(跳出app去淘宝)，5 淘抢购（废弃）,  6 淘宝地址（app内 嵌入淘宝页面）7，话费充值 8,商品详情
    const { type, id, title, value, params } = item;
    AnalyticsUtil.eventWithAttributes(`${str}_click`, { title });
    const isJumpH5 = await this.isJumpH5(item.needLogin);
    if (!isJumpH5 && item.needLogin === 1) {
      return;
    }
    switch (type) {
      case 1:
        this.props.navigation.navigate('WebView', { title, id, src: value });
        break;
      case 2:
        this.props.navigation.navigate(value, { title, id, ...params });
        break;
      case 3:
        this.props.navigation.navigate('Nine', { title });
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
    }
  };

  // 业务逻辑
  async refreshUserInfo() {
    const res = await refreshUserInfo();
    console.log('usderinfo===', res);
    if (res) {
      if (res.roleId != 0) {
        this.setState({
          vipType: 1,
        });
      }
      if (res.openVipMsg == 1) {
        this.setState({
          isVipUpModal: true,
        });
      }
      if (res.isSalesman) {
        this.getUpLink();
      }
      this.setState({ userInfo: res });
      storage.save({
        key: 'userInfo',
        data: res,
      });
    }
  }

  // 获取钱信息汇总
  async getMoneyInfo() {
    const res = await getMoneyCount();
    console.log('getMoneyInfo===', res);
    if (res) {
      this.setState({
        moneyInfo: res,
      });
    }
  }

  // 弹框
  showToast(str) {
    Toast.show(str);
  }

  getInputValue(e) {
    console.log('输入的内容====', e);
    this.setState({
      inputValue: e,
    });
  }

  vipUpModal = () => {
    this.setState({
      isVipUpModal: false,
    });
  };

  // 好友数量
  async getFirendNum() {
    const res = await myFriendCount();
    this.setState({
      friendCount: res.myFriendCount,
    });
  }

  // 广告位
  async getAdImgs() {
    const res = await getAdImgs();
    console.log('getAdImgs===', res);
    if (res && res.length) {
      let topAdArr = [],
        bottomAdArr = [];
      res.map(item => {
        if (item.position === 5) {
          topAdArr.push(item);
        }
        if (item.position === 6) {
          bottomAdArr.push(item);
        }
      });
      this.setState({
        topAdArr,
        bottomAdArr,
      });
    }
  }

  async getUpLink() {
    const res = await getUpLink();
    if (res && res.shopkeeperRise) {
      this.setState({
        upLink: res.shopkeeperRise,
      });
    }
  }

  async isJumpH5(type) {
    if (type !== 1) {
      return false;
    }
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

  renderAdItem = bottomAdArr => {
    let arr = [];
    bottomAdArr.map((item, index) => {
      arr.push(
        <View style={styles.bottomAdWrap} key={index}>
          <TouchableOpacity style={styles.bottomAdBox} activeOpacity={Layout.activeOpacity} onPress={() => this.adJump(item, 'centerAd')}>
            <Image style={styles.bottomAd} source={{ uri: item.imageUrl }} />
          </TouchableOpacity>
        </View>
      );
    });
    return null;
  };

  render() {
    const { bottomAdArr } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={{ flex: 1 }}>
          <HighVip
            userInfo={this.state.userInfo}
            moneyInfo={this.state.moneyInfo}
            jumpPage={this.jumpPage}
            friendCount={this.state.friendCount}
            topAdArr={this.state.topAdArr}
            adJump={this.adJump}
            upLink={this.state.upLink}
          />
          {/* 常用工具 */}
          <View style={[styles.moreServies, this.state.vipType == 0 ? '' : styles.moreServies2]}>
            <View style={styles.moreServiesTitleWrap}>
              <Text style={styles.moreServiesTitle}>更多工具</Text>
            </View>
            <View style={styles.moreServiesWrap}>
              <TouchableOpacity style={styles.serviceListItem} activeOpacity={activeOpacity} onPress={() => this.jumpPage('StoreOrder')}>
                <Image source={require('@assets/personal/shop-order.png')} style={styles.serviceItemImg} />
                <Text style={styles.serviceItemText}>门店订单</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.serviceListItem} activeOpacity={activeOpacity} onPress={() => this.jumpPage('HpWallet')}>
                <Image source={require('../../../assets/icon-hpWallet.png')} style={styles.serviceItemImg} />
                <Text style={styles.serviceItemText}>惠拼钱包</Text>
              </TouchableOpacity>

              {this.state.userInfo.roleId < 40 ? (
                <TouchableOpacity style={styles.serviceListItem} onPress={() => this.jumpPage('Information')} activeOpacity={activeOpacity}>
                  <Image source={require('../../../assets/personal-icon-news.png')} style={styles.serviceItemImg} />
                  <Text style={styles.serviceItemText}>个人信息</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.serviceListItem} activeOpacity={activeOpacity} onPress={() => this.jumpPage('TodayList')}>
                  <Image source={require('../../../assets/personal/friendBuy.png')} style={styles.serviceItemImg} />
                  <Text style={styles.serviceItemText}>好友购买</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={[styles.moreServiesWrap]}>
              <TouchableOpacity style={styles.serviceListItem} activeOpacity={activeOpacity} onPress={() => this.jumpPage('Question')}>
                <Image source={require('../../../assets/personal-icon-question.png')} style={styles.serviceItemImg} />
                <Text style={styles.serviceItemText}>常见问题</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.serviceListItem} activeOpacity={activeOpacity} onPress={() => this.jumpPage('CourseIndex')}>
                <Image source={require('../../../assets/personal-icon-newUser.png')} style={styles.serviceItemImg} />
                <Text style={styles.serviceItemText}>新手教程</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.serviceListItem} activeOpacity={activeOpacity} onPress={() => this.jumpPage('Service')}>
                <Image source={require('../../../assets/personal-icon-ser.png')} style={styles.serviceItemImg} />
                <Text style={styles.serviceItemText}>专属客服</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.moreServiesWrap}>
              <TouchableOpacity style={styles.serviceListItem} onPress={() => this.jumpPage('Suggestion')} activeOpacity={activeOpacity}>
                <Image source={require('../../../assets/icon-message.png')} resizeMode="contain" style={styles.serviceItemImg} />
                <Text style={styles.serviceItemText}>意见反馈</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.serviceListItem} activeOpacity={activeOpacity} onPress={() => this.jumpPage('Settings')}>
                <Image source={require('../../../assets/personal-icon-set.png')} style={styles.serviceItemImg} />
                <Text style={styles.serviceItemText}> 设置 </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.serviceListItem} />
            </View>
          </View>
          {bottomAdArr.length ? (
            <Swiper2 containerStyle={styles.swiperWrap} key="adBottom" autoplay={bottomAdArr.length > 1} loop activeDotColor="#fff" paginationStyle={{ bottom: 22 }} removeClippedSubviews={false}>
              {this.renderAdItem(bottomAdArr)}
            </Swiper2>
          ) : null}
          <NavigationEvents onDidFocus={() => this.init()} />
        </ScrollView>

        {this.state.isVipUpModal && <VipUpModal vipUpModal={this.vipUpModal} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F4F4F4',
  },
  swiperWrap: {
    width: '100%',
    height: 164,
    paddingBottom: 14,
    backgroundColor: '#fff',
  },
  bottomAdWrap: {
    width: '100%',
    backgroundColor: '#fff',
  },
  bottomAdBox: {
    width: '100%',
    height: 150,
    backgroundColor: '#fff',
  },
  bottomAd: {
    width: '100%',
    height: '100%',
  },
  moreServies: {
    backgroundColor: '#FFF',
    paddingTop: 8,
    paddingBottom: 20,
  },
  moreServies2: {
    marginTop: 0,
    paddingTop: 8,
  },
  moreServiesTitleWrap: {
    height: 40,
    paddingLeft: 16,
  },
  moreServiesTitle: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 18,
    lineHeight: 40,
    color: '#333',
  },
  moreServiesWrap: {
    paddingTop: 16,
    paddingLeft: 32,
    paddingRight: 32,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceListItem: {
    width: 78,
    alignItems: 'center',
  },
  serviceItemImg: {
    width: 32,
    height: 32,
    marginBottom: 0,
  },
  serviceItemText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#666',
  },
});
