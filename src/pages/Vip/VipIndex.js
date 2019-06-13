import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, ScrollView, Platform, Clipboard } from 'react-native';
import Swiper from 'react-native-swiper';
import { NavigationEvents } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-root-toast';
import { refreshUserInfo, getInviteImg, vipRightNew } from '../../services/api';
import Layout from '../../constants/Layout';
import VipCard from '../../components/VipCard';
import store from '../../store/configureStore';
import vipUpModalAction from '../../actions/vipUpModal';
import NoVip from '../../components/NoVip';
import ShareBox from '../../components/ShareBox';

export default class VipIndex extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    isVip: false,
    isPartner: false,
    showShareBox: false,
    shareImageUrl: '',
    shareTitle: '米粒生活',
    userInfo: {},
    bannerList: [],
    isVipUpModal: true,
  };

  vipUpModal = () => {
    this.setState({
      isVipUpModal: false,
    });
  };

  init() {
    this.setState(
      {
        bannerList: [],
      },
      () => {
        this.refreshUserInfo();
        this.getVipRight();
        this.scrollView.scrollTo({ y: 0 });
      }
    );
  }

  onPressShare = () => {
    this.props.navigation.navigate('InvitationShare');
    AnalyticsUtil.event('vipIndex_click_invite_friend');
  };

  closeShare = () => {
    this.setState({
      showShareBox: false,
    });
  };

  onPressJumpVipSystem() {
    const { userInfo } = this.state;
    this.props.navigation.navigate('VipSystem', { vipType: userInfo.roleId });
    AnalyticsUtil.event('vipIndex_click_know_rules');
  }

  getImgHeight = async list => {
    const screenWidth = Layout.window.width;
    const srcArray = [...list];
    const getImgH = uri =>
      new Promise((resolve, reject) => {
        console.log('uri===', uri);
        Image.getSize(uri, (width, height) => {
          const imgH = Math.floor((screenWidth / width) * height);
          resolve(imgH);
        });
      });
    const imgArr = [];
    let index = 0;
    const setImg = async uri => {
      const imgH = await getImgH(uri);
      const imgItem = { src: uri, imgH };
      imgArr.push(imgItem);
      index++;
      if (index < list.length) {
        const item = srcArray[index];
        setImg(item);
      } else {
        this.setState({
          bannerList: imgArr,
        });
      }
    };
    setImg(srcArray[index]);
  };

  copy(str) {
    Clipboard.setString(str);
    storage.save({
      key: 'searchText',
      data: { searchText: str },
    });
    this.showToast('复制成功');
  }

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

  // 用户身份
  async refreshUserInfo() {
    const res = await refreshUserInfo();
    console.log('usderinfo====', res);
    if (res) {
      if (res.roleId == 0) {
        this.setState({
          isPartner: false,
          isVip: false,
        });
      } else if (res.roleId == 30) {
        this.setState({
          isPartner: false,
          isVip: true,
        });
      } else {
        this.setState({
          isPartner: true,
          isVip: true,
        });
      }
    }
  }

  // 分享图
  async getShareImg() {
    const res = await getInviteImg();
    if (res.img) {
      this.setState({
        shareImageUrl: res.img,
      });
      console.log('shareIMG=====', this.state.shareImageUrl);
    } else {
      this.showTost('获取分享图失败请稍后重试');
    }
  }

  async getVipRight() {
    const res = await vipRightNew();
    console.log('banner=====', res);
    if (res.flag === 1) {
      store.dispatch(vipUpModalAction({ isShow: true, text: res.role }));
    }
    if (res) {
      const bannerList = (res && res.pictures) || [];
      this.getImgHeight(bannerList);
      this.setState({
        userInfo: res,
      });
    }
  }

  jumpPage() {
    this.props.navigation.navigate('CommissionIndex');
  }

  jumpMyInvite = () => {
    this.props.navigation.navigate('MyInviter');
    AnalyticsUtil.event('vipIndex_go_myFriend');
  };

  bannerList() {
    const { bannerList } = this.state;
    return bannerList.map((item, i) => <FastImage key={i} style={{ width: '100%', height: item.imgH, borderRadius: 8 }} source={{ uri: item.src }} resizeMode={FastImage.resizeMode.contain} />);
  }

  onPressGoBack = () => {
    console.log('onPressGoBack===');
    this.props.navigation.goBack();
  };

  render() {
    const { userInfo, bannerList, isVip, isPartner } = this.state;
    const btnBgColor = isVip || isPartner ? '#fff' : '';
    const bgColor = isPartner || isPartner ? 'rgba(225,205,161,0.16)' : '#f4f4f4';
    const progressWidth = `${(userInfo.alreadyInvitedCount / userInfo.needInvite).toFixed(2) * 100}%`;
    const { showBackBtn } = this.props;
    return (
      <View>
        {showBackBtn && (
          <View style={[styles.navigation]}>
            <TouchableOpacity style={styles.btnBackWrap} activeOpacity={Layout.activeOpacity} onPress={this.onPressGoBack}>
              <Image style={styles.btnIconBack} source={require('../../../assets/detail/icon-back-white.png')} />
            </TouchableOpacity>
          </View>
        )}
        <ScrollView ref={ref => (this.scrollView = ref)}>
          <View style={[styles.container, { backgroundColor: bgColor }]}>
            {(isVip || isPartner) && (
              <TouchableOpacity style={styles.btnFixedWrap} activeOpacity={0.85} onPress={() => this.onPressJumpVipSystem()}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#CFB482', '#E1CDA1']} style={styles.btnWrapBg}>
                  <Text style={styles.btnWraptext1}>了解米粒会员制度</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            {!isVip && !isPartner && (
              <ImageBackground style={styles.headWrap} source={{ uri: 'http://family-img.vxiaoke360.com/vipIndex-head-bg.png' }}>
                <Image style={styles.avatar} source={{ uri: userInfo.avatar }} />
                <View style={styles.nickWrap}>
                  <Image style={styles.avatarIcon} source={require('../../../assets/vipIndex-icon1.png')} />
                  <View style={styles.avatarNickWrap}>
                    <Text style={styles.avatarNick}>{userInfo.role || '普通会员'}</Text>
                  </View>
                </View>
                <View style={styles.inviteCodeWrap}>
                  <Text style={styles.inviteCode}>
                    邀请码：
                    {userInfo.invitationCode}
                  </Text>
                  <TouchableOpacity style={styles.btnCopy} activeOpacity={0.85} onPress={() => this.copy(userInfo.invitationCode)}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#CFB482', '#E1CDA1']} style={styles.btnCopy}>
                      <Text style={styles.btnCopyTxt}>复制</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View style={styles.introduceWrap}>
                  <Image style={styles.vipIcon2} source={require('../../../assets/vipIndex-icon2.png')} />
                  <Text style={styles.vipIcon2Text}>成为米粒生活VIP</Text>
                </View>
              </ImageBackground>
            )}

            {/*= =========升级vip显示卡片========== */}
            {(isVip || isPartner) && <VipCard userInfo={userInfo} jumpPage={this.jumpMyInvite} />}

            <View style={[styles.banenrWrapBox, isVip || isPartner ? styles.banenrWrapBox2 : '']}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#e1cda1', '#be9d65']} style={styles.banenrWrap}>
                <View style={styles.bannerTitleHeight}>
                  <View style={styles.iconTitleWrap}>
                    <Image style={styles.iconTitleBg} resizeMode="contain" source={{ uri: 'http://family-img.vxiaoke360.com/vipIndex-title-bg.png' }} />
                    <Text style={styles.iconTitleText}>尊享超级权益</Text>
                  </View>
                </View>
                <View style={styles.bannerContent}>
                  {bannerList.length > 0 && (
                    <Swiper
                      loop
                      autoplay
                      autoplayTimeout={Platform.OS === 'ios' ? 2.5 : 4}
                      horizontal
                      scrollEnabled
                      showsButtons={false}
                      showsPagination
                      paginationStyle={{ bottom: 4 }}
                      dot={
                        <View
                          style={{
                            backgroundColor: 'rgba(66,66,66, 0.2)',
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            marginRight: 4,
                          }}
                        />
                      }
                      activeDot={
                        <View
                          style={{
                            backgroundColor: 'rgba(66,66,66, 0.7)',
                            width: 12,
                            height: 6,
                            borderRadius: 3,
                            marginRight: 4,
                          }}
                        />
                      }
                      removeClippedSubviews={false}
                    >
                      {this.bannerList()}
                    </Swiper>
                  )}
                </View>
              </LinearGradient>
            </View>
            <View style={[styles.btnVipWrap, { backgroundColor: btnBgColor }]}>
              {!isPartner && (
                <View style={styles.inviteWrap}>
                  <Text style={styles.inviteText}>
                    邀请
                    <Text style={{ color: 'red' }}>{userInfo.needInvite}</Text>
                    位好友 免费升级
                    {userInfo.roleNew}
                  </Text>
                  <View style={styles.progressWrap}>
                    <Text style={styles.progressTxt}>
                      已邀请
                      {userInfo.alreadyInvitedCount}人
                    </Text>
                    <View style={[styles.progressOutter, { width: progressWidth }]}>
                      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#E1CDA1', '#BE9D65']} style={styles.progressInner} />
                    </View>
                  </View>
                </View>
              )}
              <TouchableOpacity style={[styles.btnWrap, isVip || isPartner ? { marginBottom: 100 } : '']} activeOpacity={0.85} onPress={() => this.onPressShare()}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#262626', '#4e4d4d']} style={styles.btnWrapBg}>
                  <Text style={styles.btnWraptext}>邀好友，升级享更高权益</Text>
                </LinearGradient>
              </TouchableOpacity>
              {!isVip && !isPartner && (
                <TouchableOpacity style={styles.btnWrap} activeOpacity={0.85} onPress={() => this.onPressJumpVipSystem()}>
                  <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#CFB482', '#E1CDA1']} style={styles.btnWrapBg}>
                    <Text style={styles.btnWraptext1}>了解米粒会员制度</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
            {!isVip && !isPartner && <NoVip />}
          </View>
          <NavigationEvents onWillFocus={payload => this.init()} />
        </ScrollView>
        <ShareBox closeShare={this.closeShare} showShareBox={this.state.showShareBox} shareImageUrl={this.state.shareImageUrl} shareTitle={this.state.shareTitle} shareText={this.state.shareText} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f4f4',
    position: 'relative',
  },
  btnFixedWrap: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    width: '100%',
    paddingLeft: 12,
    paddingRight: 12,
    zIndex: 1,
    elevation: 1,
  },
  btnVipWrap: {
    marginTop: 50,
    paddingTop: 20,
  },
  headWrap: {
    width: '100%',
    height: 298,
    alignItems: 'center',
  },
  btnBackWrap: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    position: 'absolute',
    top: 34,
    left: 16,
    zIndex: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: 52,
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
  nickWrap: {
    position: 'relative',
    marginTop: 14,
    flexDirection: 'row',
  },
  avatarIcon: {
    width: 22,
    height: 21,
    position: 'absolute',
    left: -11,
    bottom: 0,
    zIndex: 10,
  },
  avatarNickWrap: {
    height: 16,
    backgroundColor: '#fbefde',
    borderRadius: 4,
    paddingLeft: 11,
    paddingRight: 6,
  },
  avatarNick: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 12,
    lineHeight: 16,
    color: '#c1a16a',
  },
  inviteCodeWrap: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  inviteCode: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#DFCA9D',
    marginRight: 64,
  },
  btnCopy: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  btnCopyTxt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  introduceWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  vipIcon2: {
    width: 25,
    height: 19,
  },
  vipIcon2Text: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 20,
    color: '#dec89b',
    marginLeft: 10,
  },
  banenrWrapBox: {
    paddingLeft: 16,
    paddingRight: 16,
    height: 255,
    position: 'relative',
    top: 30,
  },
  banenrWrapBox2: {
    top: 0,
    marginTop: 30,
  },
  banenrWrap: {
    width: '100%',
    borderRadius: 8,
  },
  bannerContent: {
    backgroundColor: '#fff',
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
  },
  btnWrap: {
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 20,
  },
  btnWrapBg: {
    width: '100%',
    height: 54,
    resizeMode: 'center',
    borderRadius: 27,
  },
  btnWraptext: {
    width: '100%',
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 18,
    lineHeight: 54,
    color: '#ffe4b1',
    textAlign: 'center',
  },
  btnWraptext1: {
    width: '100%',
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 18,
    lineHeight: 54,
    color: '#8B572A',
    textAlign: 'center',
  },
  bannerTitleHeight: {
    paddingBottom: 16,
  },
  iconTitleWrap: {
    width: '100%',
    height: 16,
    alignItems: 'center',
    position: 'relative',
    marginTop: 19,
  },
  iconTitleBg: {
    width: 286,
    height: 16,
  },
  iconTitleText: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    position: 'absolute',
    top: -4,
    left: 0,
    width: '100%',
  },
  iconTitle2: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 12,
    height: 17,
    lineHeight: 17,
    color: '#c1a16a',
    textAlign: 'center',
    width: '100%',
    marginTop: 15,
  },
  inviteWrap: {
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 12,
    paddingRight: 12,
  },
  inviteText: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 12,
    color: '#424242',
    marginBottom: 8,
  },
  progressWrap: {
    position: 'relative',
    width: '100%',
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DDCDB2',
    overflow: 'hidden',
  },
  progressOutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    width: 0,
    borderRadius: 8,
  },
  progressInner: {
    width: '100%',
    height: 16,
    borderRadius: 8,
  },
  progressTxt: {
    position: 'absolute',
    top: 0,
    right: 6,
    zIndex: 3,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 11,
    color: '#8B5729',
  },
});
