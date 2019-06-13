/* eslint-disable default-case */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, Clipboard } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import Layout from '../constants/Layout';
import SalesmanList from '../pages/Salesman/SalesmanList';
import ServiceProviderList from '../pages/ServiceProvider/ServiceProviderList';
import Swiper from 'react-native-swiper';

const shadowOpt = {
  width: Layout.window.width - 80,
  height: 60,
  color: '#FFA926',
  border: 12,
  radius: 4,
  opacity: 0.08,
  x: -0,
  y: 8,
  style: {
    marginBottom: 2,
    marginLeft: 0,
    marginRight: 0,
    position: 'absolute',
    left: 35,
    top: 0,
  },
};

export default class HighVip extends Component {

  _keyExtractor = (item, index) => `${index}`;

  jumpPage = item => {
    const { jumpPage } = this.props;
    jumpPage(item);
  };

  async copy() {
    const { invitationCode } = this.props.userInfo;
    Clipboard.setString(invitationCode);
    storage.save({
      key: 'searchText',
      data: { searchText: invitationCode },
    });
    this.showToast('复制成功');
  }

  copyLink = () => {
    const { upLink } = this.props;
    Clipboard.setString(upLink);
    this.showToast('复制成功');
  };

  showToast(str) {
    Toast.show(str, {
      duration: 2000,
      position: 0,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  }

  onPressShare = () => {
    const { jumpPage } = this.props;
    jumpPage('InvitationShare');
  };

  adJump = (item, str) => {
    const { adJump } = this.props;
    adJump(item, str);
  };

  vipBgImg = () => {
    const {
      userInfo,
      userInfo: { isAgent, isStore },
    } = this.props;
    if (userInfo && userInfo.roleId !== undefined) {
      const type = userInfo.roleId;
      if (type == 0) {
        return require('@assets/personal/personal-vip-bg2.png');
      }
      if (type == 30) {
        return require('@assets/personal/personal-vip-bg1.png');
      }
      return require('@assets/personal/personal-vip-bg3.png');
    }
  };

  renderAdItem = topAdArr => {
    let arr = []
    topAdArr.map((item, index) => {
      arr.push(
        <View style={styles.topAdWrap} key={index}>
          <TouchableOpacity style={styles.topAdBox} activeOpacity={Layout.activeOpacity} onPress={() => this.adJump(item, 'centerAd')}>
            <Image style={styles.topAd} source={{ uri: item.imageUrl }} />
          </TouchableOpacity>
        </View>
      );
    });
    return arr;
  };

  render() {
    const {
      userInfo,
      userInfo: { isAgent, isStore },
      moneyInfo,
      friendCount,
      topAdArr
    } = this.props;
    const { isReview } = global;
    return (
      <View style={styles.highContainer}>
        <ImageBackground style={[styles.headWrap, { height: 265 }]} source={this.vipBgImg()}>
          {false && !isReview ? (
            <TouchableOpacity activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('VipIndex')}>
              <View style={styles.vipFitWrap}>
                <View style={styles.flex1} />
                <View style={styles.vipFit}>
                  <Image style={styles.vipFitImg} source={require('../../assets/personal-icon-vipFit.png')} />
                  <Text style={styles.vipFitText}>VIP会员权益</Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.vipFitWrap} />
          )}
          <View style={styles.headFlex}>
            <View style={styles.headLeft}>
              <TouchableOpacity style={styles.avatarImgWrap} onPress={() => this.jumpPage('Information')}>
                <Image source={{ uri: userInfo.headimgurl }} style={styles.avatarImg} />
              </TouchableOpacity>
              <View style={styles.userNameWrap}>
                <Text style={[styles.userName, userInfo.roleId > 30 && styles.userNameColor1, userInfo.roleId == 0 && styles.userNameColor2]} numberOfLines={1}>
                  {userInfo.nickname}
                </Text>
                <TouchableOpacity style={styles.userVips} activeOpacity={Layout.activeOpacity}>
                  <Image
                    style={[
                      styles.userVipsImg,
                      userInfo.roleId == 0 && styles.userNormalImg1,
                      userInfo.roleId == 30 && styles.userNormalImg2,
                      userInfo.isStore && styles.userNormalImg4,
                      (userInfo.roleId > 30 || userInfo.isAgent) && styles.userNormalImg3,
                    ]}
                    resizeMode='contain'
                    source={{ uri: userInfo.userIdIcon}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {userInfo.roleId == 0 && !isAgent && !isStore ? (
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FF9417', 'rgba(255,148,23,0.4)']} style={[styles.headRight]}>
                <Text style={[styles.headRightText, styles.headRightTextColor2]}>
                  邀请码
                  {userInfo.invitationCode}
                </Text>
                <TouchableOpacity>
                  <View style={[styles.headRightBtnWrap, styles.headRightBtnWrapColor2]}>
                    <Text style={[styles.headRightBtn, styles.headRightBtnColor2]} onPress={() => this.copy()}>
                      复制
                    </Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <View style={[styles.headRight, userInfo.roleId > 30 && styles.headRightColor1]}>
                <Text style={[styles.headRightText, userInfo.roleId > 30 && styles.headRightTextColor1]}>
                  邀请码
                  {userInfo.invitationCode}
                </Text>
                <TouchableOpacity>
                  <View style={[styles.headRightBtnWrap, userInfo.roleId > 30 && styles.headRightBtnWrapColor1]}>
                    <Text style={[styles.headRightBtn, userInfo.roleId > 30 && styles.headRightBtnColor1]} onPress={() => this.copy()}>
                      复制
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.getMoneyBoxWrap}>
            <View style={styles.getMoneyBox}>
              <View style={styles.selfMoney}>
                <TouchableOpacity style={styles.haveMoney} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('widthDraw')}>
                  <View style={styles.haveMoneyBtnWrap}>
                    <Text style={styles.haveMoneyTitle}>余额(元)</Text>
                    <View style={styles.haveMoneyBtn}>
                      <Text style={styles.haveMoneyBtnText}>提现</Text>
                    </View>
                  </View>
                  <Text style={[styles.haveMoneyCount, styles.haveMoneyCount1]} numberOfLines={1}>
                    {moneyInfo.balance || '0.00'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.haveMoney]} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('WaitBack')}>
                  <Text style={styles.haveMoneyTitle}>审核中(元)</Text>
                  <Text style={styles.haveMoneyCount} numberOfLines={1}>
                    {moneyInfo.examineBalance || '0.00'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.haveMoneyBorder} />
            </View>
          </View>
        </ImageBackground>
        <View style={styles.moneyDetailWrap}>
          <BoxShadow setting={shadowOpt} />
          <View style={styles.moneyDetail}>
            <TouchableOpacity style={styles.moneyDetailItem} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('profit')}>
              <Text style={styles.moneyDetailNum}>{moneyInfo.toDayProjectedIncome || '0.00'}</Text>
              <Text style={styles.moneyDetailInfo}>今日预计(元)</Text>
              <Text style={styles.moneyDetailLine} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moneyDetailItem} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('Monthfit')}>
              <Text style={styles.moneyDetailNum}>{moneyInfo.toMonthProjectedIncome || '0.00'}</Text>
              <Text style={styles.moneyDetailInfo}>本月预计(元)</Text>
              <Text style={styles.moneyDetailLine} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moneyDetailItem} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('Historyfit')}>
              <Text style={styles.moneyDetailNum}>{moneyInfo.historyIncome || '0.00'}</Text>
              <Text style={styles.moneyDetailInfo}>历史总计(元)</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inviteWrap}>
          <View style={styles.inviteContent}>
            <TouchableOpacity activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('MyInviter')}>
              <View style={styles.inviteContentLeft}>
                <Image style={styles.inviteContentImg} source={require('../../assets/personal-icon-friend-num.png')} />
                <Text style={styles.inviteContentInfo}>我的好友</Text>
                <View style={styles.inviteNumWrap}>
                  <Text style={styles.inviteNum}>{friendCount || '0'}人</Text>
                </View>
              </View>
            </TouchableOpacity>
            {!isReview && (
              <TouchableOpacity activeOpacity={Layout.activeOpacity} onPress={this.onPressShare}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FCDB7E', '#FDE9A1']} style={styles.inviteContentRight}>
                  <Text style={styles.inviteContentBtn}>邀好友,拿奖励</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {
          topAdArr.length ? 
          (<Swiper
            containerStyle={styles.topAdBox}
            key="adTop"
            autoplay={topAdArr.length > 1}
            loop
            activeDotColor="#fff"
            paginationStyle={{ bottom: 8 }}
            removeClippedSubviews={false}
          >
            {this.renderAdItem(topAdArr)}
          </Swiper>) : null
        }
        <Text style={styles.usual_title}>淘宝应用</Text>
        <View style={[styles.moneyDetailWrap, styles.moneyDetailWrap2]}>
          <View style={[styles.moneyDetail, styles.moneyDetail2]}>
            <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('Myorder')}>
              <Image style={styles.moneyDetailImg} source={require('@assets/personal/personal-icon-order.png')} />
              <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>淘宝订单</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('shopCar')}>
              <Image style={styles.moneyDetailImg} source={require('@assets/personal/personal-icon-shopCar.png')} />
              <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>淘宝购物车</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('Mycollect')}>
              <Image style={styles.moneyDetailImg} source={userInfo && this.renderIcon('collection')} />
              <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>我的收藏</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('cutPriceRemind')}>
              <Image style={styles.moneyDetailImg} source={require('@assets/personal/personal-icon-cutPrice.png')} />
              <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>降价提醒</Text>
            </TouchableOpacity>
          </View>
        </View>
        {userInfo.isAgent &&
          (() => {
            if (userInfo.roleId === 52) {
              return (
                <View>
                  <Text style={styles.usual_title}>服务商管理</Text>
                  <View style={[styles.moneyDetailWrap, styles.moneyDetailWrap2, {paddingLeft: 21,paddingRight: 21}]}>
                    <View style={[styles.moneyDetail, styles.moneyDetail2]}>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('ShopOwnerList')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/shopManage.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>店长管理</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('SalesmanList')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/busniess.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>业务员管理</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('CityFit')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/myFit.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>我的权益</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('MobileLogin')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/shop-show.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>门店演示</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            } else if (userInfo.roleId === 54) {
              return (
                <View>
                  <Text style={styles.usual_title}>服务商管理</Text>
                  <View style={[styles.moneyDetailWrap, styles.moneyDetailWrap2]}>
                    <View style={[styles.moneyDetail, styles.moneyDetail2]}>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('ShopOwnerList')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/shopManage.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>店长管理</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('SalesmanList')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/busniess.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>业务员管理</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('CityFit')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/myFit.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>我的权益</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.moneyDetail, styles.moneyDetail2]}>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('MobileLogin')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/shop-show.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>门店演示</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('ServiceProviderList')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/copyLink.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>服务商直升</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.moneyDetailItem2} />
                    </View>
                  </View>
                </View>
              );
            } else if (userInfo.roleId === 60) {
              return (
                <View>
                  <Text style={styles.usual_title}>服务商管理</Text>
                  <View style={[styles.moneyDetailWrap, styles.moneyDetailWrap2]}>
                    <View style={[styles.moneyDetail, styles.moneyDetail2]}>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('ShopOwnerList')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/shopManage.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>店长管理</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('SalesmanList')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/busniess.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>业务员管理</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('CityFit')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/myFit.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>我的权益</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.moneyDetail, styles.moneyDetail2]}>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('MobileLogin')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/shop-show.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>门店演示</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('ServiceProviderList')}>
                        <Image style={styles.moneyDetailImg} source={require('@assets/personal/copyLink.png')} />
                        <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>服务商直升</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.moneyDetailItem2} />
                    </View>
                  </View>
                </View>
              );
            }
          })()}
        {userInfo.isSalesman && (
          <View>
            <Text style={styles.usual_title}>业务员</Text>
            <View style={[styles.moneyDetailWrap, styles.moneyDetailWrap2]}>
              <View style={[styles.moneyDetail, styles.moneyDetail2]}>
                <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('SalesManShopownerList')}>
                  <Image style={styles.moneyDetailImg} source={require('@assets/personal/shopManage.png')} />
                  <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>店长管理</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={this.copyLink}>
                  <Image style={styles.moneyDetailImg} source={require('@assets/personal/copyLink.png')} />
                  <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>复制直升链接</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('MobileLogin')}>
                  <Image style={styles.moneyDetailImg} source={require('@assets/personal/shop-show.png')} />
                  <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>门店演示</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {userInfo.isStore && (
          <View>
            <Text style={styles.usual_title}>门店管理</Text>
            <View style={[styles.moneyDetailWrap, styles.moneyDetailWrap2, {paddingLeft: 21,paddingRight: 21}]}>
              <View style={[styles.moneyDetail, styles.moneyDetail2]}>
                <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('GoodsReport')}>
                  <Image style={styles.moneyDetailImg} source={require('@assets/personal/report.png')} />
                  <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>运营报表</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('GoodManage')}>
                  <Image style={styles.moneyDetailImg} source={require('@assets/personal/goods-manage.png')} />
                  <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>商品管理</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('OrderList')}>
                  <Image style={styles.moneyDetailImg} source={require('@assets/personal/order-manage.png')} />
                  <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>订单管理</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('shopMessageManage')}>
                  <Image style={styles.moneyDetailImg} source={require('@assets/personal/shopMessageManage.png')} />
                  <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2]}>门店管理</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {userInfo.storeWelfareModule&& <View>
          <Text style={styles.usual_title}>门店福利</Text>
          <View style={[styles.moneyDetailWrap, styles.moneyDetailWrap2,{marginTop: 8}]}>
            <View style={[styles.moneyDetail, styles.moneyDetail2]}>
              <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('zeroExamination')}>
                <Image style={[styles.moneyDetailImg,{width: 40,height: 40, marginBottom: 4}]} source={require('@assets/personal/medical-examination.png')} />
                <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2,{color: '#333'}]}>0元体检福利</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moneyDetailItem2} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpPage('zeroShopping')}>
                <Image style={[styles.moneyDetailImg,{width: 40,height: 40, marginBottom: 4}]} source={require('@assets/personal/zero-shop.png')} />
                <Text style={[styles.moneyDetailInfo, styles.moneyDetailInfo2,{color: '#333'}]}>新人0元购</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moneyDetailItem2}></TouchableOpacity>
            </View>
          </View>
        </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  highContainer: {
    backgroundColor: '#fff',
  },
  topAdWrap: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 15,
  },
  topAdBox: {
    width: '100%',
    height: 72,
    overflow: 'hidden',
  },
  topAd: {
    width: '100%',
    height: '100%',
  },
  headWrap: {
    paddingLeft: 16,
    backgroundColor: '#fff',
    position: 'relative',
  },
  vipFitWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    paddingRight: 12,
  },
  flex1: {
    flex: 1,
  },
  vipFit: {
    paddingLeft: 6,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4E4D4D',
    height: 24,
    borderRadius: 12,
  },
  vipFitImg: {
    width: 14,
    height: 14,
    marginRight: 2,
  },
  vipFitText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#F2CA89',
    lineHeight: 24,
  },
  headFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 44,
  },
  headLeft: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarImgWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userNameWrap: {
    width: 104,
  },
  userName: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#885401',
  },
  userNameColor1: {
    color: '#A46632',
  },
  userNameColor2: {
    color: '#fff',
  },
  userVips: {
    position: 'relative',
    height: 22,
  },
  userVipsImg: {
    width: 65,
    height: 21,
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: 10,
  },
  userNormalImg1: {
    width: 72,
    height: 22,
  },
  userNormalImg2: {
    width: 60,
    height: 21,
  },
  userNormalImg3: {
    width: 83,
    height: 20,
  },
  userNormalImg4: {
    width: 61,
    height: 20,
  },
  headRight: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingLeft: 12,
    paddingRight: 6,
    height: 30,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headRightColor1: {
    backgroundColor: '#F4C18E',
  },
  headRightText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 12,
    color: '#885401',
    marginLeft: 12,
  },
  headRightTextColor1: {
    color: '#82542C',
  },
  headRightTextColor2: {
    color: '#fff',
  },
  headRightBtnWrap: {
    width: 48,
    height: 22,
    marginLeft: 4,
    borderRadius: 11,
    backgroundColor: '#E2BE84',
  },
  headRightBtnWrapColor1: {
    backgroundColor: '#EAA158',
  },
  headRightBtnWrapColor2: {
    backgroundColor: '#fff',
  },
  headRightBtn: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 12,
    lineHeight: 22,
    color: '#885401',
  },
  headRightBtnColor1: {
    color: '#82542C',
  },
  headRightBtnColor2: {
    color: '#FF9416',
  },
  getMoneyBoxWrap: {
    paddingRight: 16,
    position: 'absolute',
    bottom: 20,
    left: 16,
    zIndex: 20,
  },
  getMoneyBox: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    position: 'relative',
  },
  selfMoney: {
    width: '100%',
    paddingTop: 22,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 22,
    flexDirection: 'row',
  },
  haveMoney: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  haveMoneyBtnWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  haveMoneyTitle: {
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
  },
  haveMoneyCount: {
    color: '#333',
    fontSize: 26,
    lineHeight: 28,
    fontFamily: 'DINA',
    marginTop: 5,
  },
  haveMoneyBtn: {
    paddingLeft: 12,
    paddingRight: 12,
    height: 20,
    backgroundColor: '#FC4277',
    borderRadius: 10,
    marginLeft: 8,
  },
  haveMoneyBtnText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#fff',
    lineHeight: 20,
  },
  haveMoneyCount1: {
    color: '#FC4277',
  },
  haveMoneyBorder: {
    width: 0.5,
    height: 34,
    backgroundColor: '#DFDFDF',
    position: 'absolute',
    top: 31,
    left: '50%',
  },
  moneyDetailWrap: {
    paddingLeft: 16,
    paddingRight: 16,
    position: 'relative',
    top: -22,
  },
  moneyDetail: {
    width: '100%',
    height: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  moneyDetailItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#885401',
  },
  moneyDetailLine: {
    width: 0.5,
    backgroundColor: '#DFDFDF',
    height: 24,
    position: 'absolute',
    right: 0,
    top: 10,
  },
  moneyDetailNum: {
    color: '#333',
    fontSize: 18,
    fontFamily: 'DINA',
  },
  moneyDetailInfo: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    position: 'relative',
  },
  moneyDetailWrap2: {
    paddingLeft: 32,
    paddingRight: 32,
    backgroundColor: '#fff',
    marginTop: 0,
    top: 0,
  },
  moneyDetail2: {
    height: 78,
    justifyContent: 'space-between',
    borderTopWidth: 0,
    borderTopColor: 'transparent',
  },
  moneyDetailImg: {
    width: 32,
    height: 32,
  },
  moneyDetailItem2: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#885401',
  },
  moneyDetailInfo2: {
    fontSize: 13,
    fontFamily: 'PingFangSC-Regular',
    color: '#666',
  },
  inviteWrap: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  inviteContent: {
    paddingLeft: 16,
    paddingRight: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(252,169,38,0.10)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  inviteContentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteContentImg: {
    width: 36,
    height: 36,
  },
  inviteContentInfo: {
    marginLeft: 10,
    fontFamily: 'PingFangSC-Medium',
    fontSize: 17,
    color: '#885401',
  },
  inviteNumWrap: {
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(252,66,119,0.10)',
    marginLeft: 4,
  },
  inviteNum: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#FC4277',
    paddingTop: 1,
    paddingBottom: 1,
  },
  inviteContentRight: {
    height: 26,
    borderRadius: 13,
    paddingLeft: 12,
    paddingRight: 12,
  },
  inviteContentBtn: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#885401',
    lineHeight: 26,
  },
  usual_title: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 18,
    color: '#333',
    paddingLeft: 16,
    marginTop: 20,
  },
});
