import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import Toast from 'react-native-root-toast';
import FriendList from '../../components/FriendList';
import {
  myFriendCount, getFriendCount, getPartners, getTeamOrders, upPartner, storeUpPartner, friendCountGroupRoleId,
  getStorePartners, getStoreTeamOrders,
} from '../../services/api';
import ShareBox from '../../components/ShareBox';
import BuyVip from '../../components/BuyVip';
import FriendSort from '../../components/FriendSort';
import Layout from '../../constants/Layout';
import TeamInfo from '../../components/TeamInfo';
import LoadingText from '../../components/LoadingText';
import FriendConfirm from '../../components/FriendConfirm';

const shadowValue = {
  width: Layout.window.width - 46,
  height: 40,
  color: '#885401',
  border: 10,
  radius: 20,
  opacity: 0.1,
  x: 22,
  y: 14,
  style: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
};

export default class MyInviter extends Component {
  static navigationOptions = {
    title: '我的邀请',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  };

  state = {
    showShareBox: false,
    shareImageUrl: '',
    shareTitle: '米粒生活',
    shareText: '',
    teacherInfo: {},
    friendCount: 0,
    pList: [],
    loadingState: '',
    currentPage: 1,
    sortType: 'descs',
    sortTab: '',
    sortParams: 'invitation_date',
    showVipDialog: false,
    showEmpty: false,
    vipType: '',
    roleId: '',
    showHeadInvite: false,
    showFriendInfo: false,
    listItem: {},
    showConfirm: false,
    referralsNum: 0,
    upgradeUser: {},
    roleList: [],
    touchItem: true,
    isCanUpgrade: false,
    roleType: 3,
  };

  async componentDidMount() {
    const userInfo =
      (await storage
        .load({
          key: 'userInfo',
        })
        .catch(e => e)) || {};
    console.log('isagent====', userInfo);
    this.setState(
      {
        isCanUpgrade: userInfo.isAgent || userInfo.isStore,
        roleType: userInfo.isAgent ? 1 : userInfo.isStore ? 2 : 3,
      },
      () => {
        this.onHeaderRefresh();
      }
    );
  }

  _keyExtractor = (item, index) => `${index}`;

  // 下拉刷新
  onHeaderRefresh = () => {
    const { sortType, sortParams, roleType } = this.state;
    console.log('下拉刷新===onHeaderRefresh', sortType, sortParams);
    this.canLoadMore = false;
    this.setState(
      {
        currentPage: 1,
        pList: [],
        loadMoreText: '',
      },
      () => {
        this.getList(1, sortType, sortParams);
      }
    );
    this.getFirendNum();
    this.getRoles();
    if (roleType !== 3) {
      this.getReferralsNum();
    }
  };

  // 上拉加载
  onFooterLoad = () => {
    const { currentPage, sortType, sortParams, vipType, roleId } = this.state;
    console.log('上拉加载===onFooterRefresh', currentPage);
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getList(currentPage, sortType, sortParams, vipType, roleId);
    }
  };

  // 类目切换
  changeSort = (item, sortType, sortParams, vipType, roleId) => {
    if (this.canLoadMore) {
      if (sortParams) {
        this.setState(
          {
            currentPage: 1,
            pList: [],
            sortType,
            sortTab: item.sortIndex,
            sortParams: sortParams || '',
            vipType,
            roleId,
          },
          () => {
            if (vipType) {
              this.getList(1, sortType, sortParams, vipType, roleId);
            } else {
              this.getList(1, sortType, sortParams);
            }
          }
        );
      } else {
        this.setState({
          sortTab: item.sortIndex,
        });
      }
    }
  };

  // 点击升级好友
  clickUpgrade = e => {
    if (e) {
      this.setState({
        showFriendInfo: false,
        showConfirm: true,
        upgradeUser: e,
      });
    }
  };

  closeUp = () => {
    this.setState({
      showFriendInfo: false,
    });
  };

  // 好友信息弹框
  clickListItem(item) {
    this.changeTouchItem(true);
    this.getUserOrder(item);
  }

  // 取消确认
  closeConfirm = () => {
    this.setState({
      showConfirm: false,
    });
  };

  // 点击确认
  clickConfirm = () => {
    this.agreeUpgrade(this.state.upgradeUser);
  };

  onPressShare = () => {
    this.props.navigation.navigate('InvitationShare');
  };

  closeShare = () => {
    this.setState({
      showShareBox: false,
    });
  };

  // 弹框
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

  changeTouchItem = boo => {
    this.setState({
      touchItem: boo,
    });
  };

  /**
   * 接口请求
   */
  async getList(page, sortType, sortParams, vipType, roleId) {
    let loadingState = 'loading';
    this.setState({
      loadingState,
    });
    this.canLoadMore = false;
    const res = await getFriendCount(page, sortType, sortParams, vipType, roleId);
    if (res && res.length) {
      page++;

      this.setState({
        pList: [...this.state.pList, ...res],
        currentPage: page,
        loadingState: '',
        showEmpty: false,
        showHeadInvite: true,
      }, () => {
        this.canLoadMore = true;
      });
    } else {
      if (this.state.pList.length > 0) {
        loadingState = 'noMoreData';
      } else {
        this.setState({
          showEmpty: true,
        });
        loadingState = '';
      }
      this.canLoadMore = true;
    }

    this.setState({
      loadingState,
    });

  }

  async getRoles() {
    const res = await friendCountGroupRoleId();
    if (res) {
      this.setState({
        roleList: res,
      });
    }
  }

  // 好友数量
  async getFirendNum() {
    const res = await myFriendCount();
    this.setState({
      teacherInfo: res.parent,
      friendCount: res.myFriendCount,
    });
  }

  // 我直推的合伙人
  async getReferralsNum() {
    const { roleType } = this.state;
    let res = null;
    if (roleType === 1) {
      res = await getPartners();
    } else {
      res = await getStorePartners();
    }
    this.setState({
      referralsNum: res.count,
    });
  }

  // 团队订单
  async getUserOrder(item) {
    const { roleType } = this.state;
    const params = item;
    let res = null;
    if (roleType === 1) {
      res = await getTeamOrders(item.userId);
    } else {
      res = await getStoreTeamOrders(item.userId);
    }

    if (res) {
      params.orderNum = res.count;
      this.setState({
        listItem: params,
        showFriendInfo: true,
      });
    }
  }

  // 升级合伙人
  async agreeUpgrade(item) {
    const { roleType } = this.state;
    let res = null;
    if (roleType === 1) {
      res = await upPartner(item.userId);
    } else {
      res = await storeUpPartner(item.userId);
    }

    if (res) {
      this.setState({
        showConfirm: false,
      });
      this.onHeaderRefresh();
    }
  }

  jumpPage(url) {
    this.props.navigation.navigate(url);
    this.closeVip();
  }

  closeVip = () => {
    this.setState({
      showVipDialog: false,
    });
  };

  loadingText = () => {
    const { loadingState } = this.state;
    return <LoadingText loading={loadingState} />;
  };

  renderProList(info) {
    return (
      <FriendList
        item={info.item}
        clickListItem={data => this.clickListItem(data)}
        canClick={this.state.isCanUpgrade}
        noBorder={info.index === this.state.pList.length - 1}
      />
    );
  }

  // 列表头部模板
  headerorComponent() {
    const { pList } = this.state;
    if (pList.length) {
      return (
        <View style={styles.titleWrap}>
          <Image source={require('../../../assets/myInvite-title-left.png')} style={styles.vipTitleImg} />
          <Text style={styles.vipTItleText}>我的邀请好友</Text>
          <Image source={require('../../../assets/myInvite-title-right.png')} style={styles.vipTitleImg} />
        </View>
      );
    }
    return null;
  }

  // 列表为空时模板
  emptyComponent() {
    const { showEmpty } = this.state;
    if (showEmpty) {
      return (
        <View style={styles.emptyState}>
          <Image style={styles.emptyImg} resizeMode="center" source={{ uri: 'http://family-img.vxiaoke360.com/no-friend2.png' }} />
          <Text style={styles.emptyText}>暂无好友，快去邀请吧~</Text>
          <Text style={styles.inviteBtn} onPress={this.onPressShare}>
            马上去邀请
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.laodingCircle}>
        <ActivityIndicator size="small" color="#999" />
      </View>
    );
  }

  render() {
    const { teacherInfo, showVipDialog, sortType, sortTab, pList, showHeadInvite, isCanUpgrade, showFriendInfo, listItem, showConfirm, roleList, touchItem } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.headerArea}>
          <ImageBackground style={styles.headerWrap} source={{ uri: 'https://image.vxiaoke360.com/myInviter-head-bg3.png' }}>
            {!isCanUpgrade ? (
              <View>
                <Text style={styles.headerWrapText}>我的好友</Text>
                <Text style={styles.headerWrapCount}>{this.state.friendCount || 0}</Text>
              </View>
            ) : (
              <View style={styles.headerContent}>
                <View style={styles.headerContentBox}>
                  <Text style={styles.headerWrapText}>我的好友</Text>
                  <Text style={styles.headerWrapCount}>{this.state.friendCount || 0}</Text>
                </View>

                <TouchableOpacity style={styles.headerContentBox} activeOpacity={0.85} onPress={() => this.jumpPage('MyReferrals')}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.headerWrapText}>我直推的合伙人</Text>
                    <Image style={styles.inviteRightImg} source={require('../../../assets/personal-icon-right.png')} />
                  </View>
                  <Text style={styles.headerWrapCount}>{this.state.referralsNum || 0}</Text>
                </TouchableOpacity>
              </View>
            )}
            {showHeadInvite && !isCanUpgrade ? (
              <TouchableOpacity style={styles.inviteRight} onPress={() => this.onPressShare()} activeOpacity={0.85}>
                <Text style={styles.inviteRightText}>邀好友，拿奖励</Text>
                <Image source={require('../../../assets/personal-icon-right.png')} style={styles.inviteRightImg} />
              </TouchableOpacity>
            ) : null}
          </ImageBackground>
          {teacherInfo ? (
            <View style={styles.teacherArea}>
              <BoxShadow setting={shadowValue} />
              <View style={styles.teacherWrap}>
                <Image style={styles.teacherAvatar} source={{ uri: teacherInfo.headimgurl }} />
                <View style={styles.teacherRight}>
                  <View style={styles.teacherNameWrap}>
                    <Text style={styles.teacherName}>{teacherInfo.nickname}</Text>
                    <View style={styles.teacherNameLabelWrap}>
                      <Text style={styles.teacherNameLabel}>我的邀请人</Text>
                    </View>
                  </View>
                  <View style={styles.userVips}>
                    <Image style={styles.userVipsImg} source={require('../../../assets/personal-high-vip2.png')} />
                    <View style={styles.userVipsTextWrap}>
                      <Text style={styles.userVipsText}>{teacherInfo.roleName}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.teacherWrap} />
          )}
        </View>
        <FriendSort roleList={roleList} touchItem={touchItem} changeTouchItem={this.changeTouchItem} sortType={sortType} sortTab={sortTab} changeSort={this.changeSort} />
        <View style={{ borderBottomColor: '#EFEFEF', borderBottomWidth: 0.5 }} />
        <View style={styles.friendListWrap}>
          <FlatList
            style={styles.friendListBox}
            data={pList}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderProList.bind(this)}
            onEndReachedThreshold={0.1}
            onEndReached={this.onFooterLoad}
            // ListHeaderComponent={() => this.headerorComponent()}
            ListFooterComponent={() => this.loadingText()}
            ListEmptyComponent={() => this.emptyComponent()}
          />
        </View>
        {this.state.showShareBox ? (
          <ShareBox closeShare={this.closeShare} showShareBox={this.state.showShareBox} shareImageUrl={this.state.shareImageUrl} shareTitle={this.state.shareTitle} shareText={this.state.shareText} />
        ) : null}

        {showVipDialog && <BuyVip jumpVip={() => this.jumpPage('VipIndex')} closeVip={this.closeVip} />}
        {showFriendInfo && <TeamInfo clickUpgrade={this.clickUpgrade} closeUp={this.closeUp} datas={listItem} />}
        {showConfirm && <FriendConfirm item={listItem} closeConfirm={this.closeConfirm} clickConfirm={this.clickConfirm} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendListWrap: {
    position: 'relative',
    zIndex: -1,
    height: Layout.window.height - 250,
    backgroundColor: '#fff',
    flex: 1,
  },
  friendListBox: {
    flex: 1,
  },
  headerContentBox: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    position: 'relative',
  },
  laodingCircle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerArea: {
    height: 190,
  },
  headerWrap: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 24,
    height: 160,
    alignItems: 'center',
    position: 'relative',
  },
  headerWrapText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#885401',
    textAlign: 'center',
  },
  headerWrapCount: {
    fontFamily: 'DINA',
    fontSize: 30,
    color: '#885401',
    marginTop: 12,
    textAlign: 'center',
  },
  teacherArea: {
    width: '100%',
    height: 56,
    position: 'absolute',
    bottom: 16,
    left: 0,
    zIndex: 66,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  teacherWrap: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    paddingLeft: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  teacherRight: {
    marginLeft: 8,
  },
  teacherNameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherName: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },
  teacherNameLabelWrap: {
    paddingLeft: 4,
    paddingRight: 4,
    height: 16,
    backgroundColor: 'rgba(234,68,87,0.2)',
    borderRadius: 8,
  },
  teacherNameLabel: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    lineHeight: 16,
    color: '#EA4457',
  },
  userVips: {
    position: 'relative',
    marginTop: 16,
  },
  userVipsImg: {
    width: 16,
    height: 14,
    marginLeft: 2,
    marginRight: 4,
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: 10,
  },
  userVipsTextWrap: {
    height: 14,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 4,
    backgroundColor: '#FBEFDE',
    position: 'absolute',
    left: 8,
    bottom: 0,
  },
  userVipsText: {
    fontFamily: 'PingFangSC-Regular',
    height: 14,
    fontSize: 8,
    paddingLeft: 2,
    color: '#C1A16A',
    lineHeight: 14,
  },
  titleWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#efefef',
  },
  vipTitleImg: {
    width: 41,
    height: 5,
  },
  vipTItleText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    marginRight: 12,
  },
  emptyState: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
  emptyImg: {
    width: 150,
    height: 150,
  },
  emptyText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    marginTop: 8,
  },
  inviteBtn: {
    width: 200,
    height: 48,
    textAlign: 'center',
    lineHeight: 48,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#FC4277',
    marginTop: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FC4277',
  },

  inviteRight: {
    position: 'absolute',
    zIndex: 999,
    top: 20,
    right: 0,
    backgroundColor: '#EFCC94',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    height: 30,
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 11,
    flexDirection: 'row',
  },
  inviteRightText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 12,
    color: '#885401',
    lineHeight: 30,
  },
  inviteRightImg: {
    width: 6.6,
    height: 10.3,
    marginLeft: 2,
    marginTop: 2,
  },
});
