import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import Layout from '@constants/Layout';
import ShopVipSort from '@components/ShopVipSort';
import ShopVipIndexList from '@components/ShopVipIndexList';
import { lineChartHeadData, shopFriendList, shopMemRoleId } from '@api';
import LineChart from '@components/Linechart';

const shadowOpt2 = {
  width: 188,
  height: 200,
  color: '#000',
  border: 6,
  radius: 4,
  opacity: 0.04,
  x: 0,
  y: 0,
  style: {
    position: 'absolute',
    top: 535,
    right: 20,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 4,
  },
};

let styles;
const activeOpacity = 0.85;
const shadowOpt = {
  width: Layout.window.width - 40,
  height: 186,
  color: '#999',
  border: 12,
  radius: 4,
  opacity: 0.1,
  x: 4,
  y: 4,
  style: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
};
export default class ShopVip extends Component {
  static navigationOptions = {
    title: '会员管理',
  };

  state = {
    navTab: 0,
    userTab: [
      {
        name: '全部用户',
        checked: true,
        type: 0,
      },
      {
        name: '复购用户',
        checked: false,
        type: 1,
      },
      {
        name: '首购用户',
        checked: false,
        type: 2,
      },
      {
        name: '未购买用户',
        checked: false,
        type: 3,
      },
    ],
    userTabType: 0,
    hederData: {},
    pList: [],
    loadMoreText: '',
    sortType: 'desc',
    sortTab: '',
    sortParams: 'invitationSort',
    touchItem: true,
    curPage: 1,
    vipType: '',
    roleId: '',
    roleList: [],
    showEmpty: false,
    refreshing: false,
  };

  componentDidMount() {
    this.getHeaderData();
    this.refs.lineChart.getData();
    this.getRoles();
    this.getList(0, 1, 'desc', 'invitationSort');
  }

  // 下拉刷新
  onHeaderRefresh = () => {
    this.setState(
      {
        refreshing: true,
        loadMoreText: '',
        sortType: 'desc',
        sortTab: '',
        sortParams: 'invitationSort',
        touchItem: true,
        curPage: 1,
        vipType: '',
        roleId: '',
        userTabType: 0,
        navTab: 0,
        userTab: [
          {
            name: '全部用户',
            checked: true,
            type: 0,
          },
          {
            name: '复购用户',
            checked: false,
            type: 1,
          },
          {
            name: '首购用户',
            checked: false,
            type: 2,
          },
          {
            name: '未购买用户',
            checked: false,
            type: 3,
          },
        ],
        showEmpty: false,
      },
      () => {
        this.getHeaderData();
        this.refs.lineChart.getData();
        this.getRoles();
        this.getList(0, 1, 'desc', 'invitationSort');
        this.refs.sorTab.clearChecked();
      }
    );
  };

  // eslint-disable-next-line react/sort-comp
  scrollHeight = 0;

  _onScroll(event) {
    if (!this.isLoaded) return;
    this.scrollHeight = event.nativeEvent.contentOffset.y;
    if (event.nativeEvent.contentOffset.y + Layout.window.height - 60 > this.contentHeight) {
      console.log('上拉加载===');
      const { userTabType, curPage, sortType, sortParams, vipType, roleId } = this.state;
      this.getList(userTabType, curPage, sortType, sortParams, vipType, roleId);
    }
  }

  _onContentSizeChange(w, h) {
    this.contentHeight = h;
  }

  // 事件绑定
  pressNav(id, type) {
    this.setState(
      {
        navTab: id,
      },
      () => {
        this.refs.lineChart.changeChartTab(type);
      }
    );
  }

  pressUserTab(item, index) {
    const arr = this.state.userTab;
    arr.map(ele => {
      ele.checked = false;
    });
    arr[index].checked = true;
    this.setState(
      {
        userTab: arr,
        curPage: 1,
        userTabType: item.type,
        sortTab: '',
        sortType: 'desc',
        sortParams: 'invitationSort',
        touchItem: true,
        vipType: '',
        roleId: '',
      },
      () => {
        this.getList(item.type, 1, 'desc', 'invitationSort');
        this.refs.sorTab.clearChecked();
      }
    );
  }

  changeTouchItem = boo => {
    this.setState({
      touchItem: boo,
    });
  };

  jumpPage(url) {
    if (url === 'userLogged') {
      const data = this.state.hederData;
      data.newLogin = false;
      this.setState({
        hederData: data,
      });
    }
    this.props.navigation.navigate(url);
  }

  clickListItem(userId) {
    const { touchItem } = this.state;
    if (!touchItem) return;
    this.props.navigation.navigate('PersonPvData', { userId });
  }

  // 业务处理

  // 类目切换
  changeSort = (item, sortType, sortParams, vipType, roleId) => {
    const { userTabType } = this.state;
    if (sortParams) {
      this.setState(
        {
          curPage: 1,
          sortType,
          sortTab: item.sortIndex,
          sortParams: sortParams || '',
          vipType,
          roleId,
        },
        () => {
          if (vipType) {
            this.getList(userTabType, 1, sortType, sortParams, vipType, roleId);
          } else {
            this.getList(userTabType, 1, sortType, sortParams);
          }
        }
      );
    } else {
      this.setState({
        sortTab: item.sortIndex,
      });
    }
  };

  renderTotalNum() {
    const arr = [];
    const str = this.state.hederData.totalMembers || '0';
    const strs = str.split('');
    strs.map((item, index) => {
      arr.push(
        <View style={styles.totalVipNum} key={index}>
          <Text style={styles.totalVipNumT} key={index}>
            {item}
          </Text>
        </View>
      );
    });
    return arr;
  }

  renderUserTab() {
    const { userTab } = this.state;
    const arr = [];
    userTab.map((item, index) => {
      arr.push(
        <TouchableOpacity style={[styles.userTab, item.checked ? styles.userTabText2 : '']} key={index} activeOpacity={activeOpacity} onPress={() => this.pressUserTab(item, index)}>
          <Text style={styles.userTabText}>{item.name}</Text>
          <View style={[styles.userTabLine, item.checked ? styles.userTabLine2 : '']} />
        </TouchableOpacity>
      );
    });
    return arr;
  }

  renderProList(item) {
    const { pList } = this.state;
    const arr = [];
    pList.map((item, index) => {
      arr.push(<ShopVipIndexList listItem={item} hasLine={index == pList.length} clickListItem={data => this.clickListItem(data)} key={index} />);
    });
    return arr;
  }

  headerComponent() {
    const { roleList, touchItem, sortType, sortTab, navTab, hederData } = this.state;
    return (
      <View>
        <View style={styles.chartWrap}>
          <View style={styles.tabWrap}>
            <TouchableOpacity style={[styles.tabBtn, styles.tabBtnChecked]} activeOpacity={activeOpacity} onPress={() => this.jumpPage('RealTime')}>
              <Text style={[styles.tabText, styles.tabTextChecked]}>实时互动系统</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabBtn} activeOpacity={activeOpacity} onPress={() => this.jumpPage('userLogged')}>
              <Text style={styles.tabText}>今日登录用户</Text>
              {hederData.newLogin && <View style={styles.tabTextCircle} />}
            </TouchableOpacity>
          </View>
          <View style={styles.navWrap}>
            <TouchableOpacity style={styles.navBtn} activeOpacity={activeOpacity} onPress={() => this.pressNav(0, 'login')}>
              <Text style={[styles.navNum, navTab === 0 && styles.checkedColor]}>{hederData.todayNew || '0'}</Text>
              <Text style={[styles.navText, navTab === 0 && styles.checkedColor]}>今日新增</Text>
              <View style={styles.navLine} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.navBtn} activeOpacity={activeOpacity} onPress={() => this.pressNav(1, 'active')}>
              <Text style={[styles.navNum, navTab === 1 && styles.checkedColor]}>{hederData.todayActive || '0'}</Text>
              <Text style={[styles.navText, navTab === 1 && styles.checkedColor]}>今日活跃</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartContent}>
            <BoxShadow setting={shadowOpt} />
            <View style={styles.chartBox}>
              <LineChart ref="lineChart" />
            </View>
          </View>
          <View style={styles.bottomWrap}>
            <View style={styles.bottomCon}>
              <Text style={styles.bottomText1}>昨日同期</Text>
              {navTab === 0 ? <Text style={[styles.bottomText2, hederData.yesterdayLoginSyncFloat === 'down' && styles.bottomText1S]}>{hederData.yesterdayLoginSync}</Text> : null}
              {navTab === 0 && hederData.yesterdayLoginSyncFloat !== '-' ? <View style={[styles.arrowUp, hederData.yesterdayLoginSyncFloat === 'down' && styles.arrowDown]} /> : null}
              {navTab === 1 ? <Text style={[styles.bottomText2, hederData.yesterdayActiveSyncFloat === 'down' && styles.bottomText1S]}>{hederData.yesterdayActiveSync}</Text> : null}
              {navTab === 1 && hederData.yesterdayActiveSyncFloat !== '-' ? <View style={[styles.arrowUp, hederData.yesterdayActiveSyncFloat === 'down' && styles.arrowDown]} /> : null}
            </View>
            <View style={styles.bottomCon}>
              <Text style={styles.bottomText1}>上周同期</Text>
              {navTab === 0 ? <Text style={[styles.bottomText2, hederData.yesterdayLoginSyncFloat === 'down' && styles.bottomText1S]}>{hederData.lastweekdayLoginSync}</Text> : null}
              {navTab === 1 ? <Text style={[styles.bottomText2, hederData.yesterdayActiveSyncFloat === 'down' && styles.bottomText1S]}>{hederData.lastweekdayActiveSync}</Text> : null}
              {navTab === 0 && hederData.lastweekdayLoginSyncFloat !== '-' ? <View style={[styles.arrowUp, hederData.lastweekdayLoginSyncFloat === 'down' && styles.arrowDown]} /> : null}

              {navTab === 1 && hederData.lastweekdayActiveSyncFloat !== '-' ? <View style={[styles.arrowUp, hederData.lastweekdayActiveSyncFloat === 'down' && styles.arrowDown]} /> : null}
            </View>
          </View>
        </View>
        <View style={styles.totalVip}>
          <Image style={styles.totalVipBg} source={require('@assets/Shop/totalvip-bg.png')} />
          <Text style={styles.totalVipText}>累计会员</Text>
          <View style={styles.totalVipNumWrap}>{hederData.totalMembers && this.renderTotalNum()}</View>
          <Text style={styles.totalVipText}>人</Text>
        </View>
        <View style={styles.userTabWrap}>{this.renderUserTab()}</View>
        <View style={styles.sortWrap}>
          <ShopVipSort roleList={roleList} touchItem={touchItem} changeTouchItem={this.changeTouchItem} sortType={sortType} sortTab={sortTab} changeSort={this.changeSort} ref="sorTab" />
          <View style={styles.bottomLine} />
        </View>
      </View>
    );
  }

  // 列表为空时模板
  emptyComponent() {
    const { showEmpty } = this.state;
    if (showEmpty) {
      return (
        <View style={styles.emptyState}>
          <Image style={styles.emptyImg} resizeMode="center" source={{ uri: 'http://family-img.vxiaoke360.com/no-friend2.png' }} />
          <Text style={styles.emptyText}>暂无用户</Text>
        </View>
      );
    }
    return (
      <View style={styles.laodingCircle}>
        <ActivityIndicator size="small" color="#999" />
      </View>
    );
  }

  loadingText = () => {
    const { loadMoreText } = this.state;
    if (loadMoreText) {
      return <Text style={styles.loadingText}>{loadMoreText}</Text>;
    }
    return null;
  };

  checkItem(params) {
    this.refs.sorTab.checkItem(params);
  }

  renderFlatlist(item) {
    const params = item.item;
    return (
      <TouchableOpacity style={[styles.listItem, styles.checked]} onPress={() => this.checkItem(params)}>
        <Text style={styles.listItemText}>{params.name}</Text>
        <Text style={styles.listItemText}>{params.num}人</Text>
      </TouchableOpacity>
    );
  }

  // 接口请求

  // eslint-disable-next-line react/sort-comp
  async getList(userTabType, page, sortType, sortParams, vipType, roleId) {
    this.isLoaded = false;
    const res = await shopFriendList(userTabType, page, sortType, sortParams, vipType, roleId);
    const { pList } = this.state;
    let newPList = [];
    if (page !== 1) {
      newPList = [...pList];
    }
    if (res && res.list.length > 0) {
      page++;
      this.setState(
        {
          pList: [...newPList, ...res.list],
          refreshing: false,
          curPage: page,
          loadMoreText: res.list.length > 9 ? '加载中...' : '-我是有底线的-',
          showEmpty: false,
        },
        () => {
          this.isLoaded = true;
        }
      );
    } else {
      let loadMoreText;
      if (newPList.length) {
        loadMoreText = '-我是有底线的-';
      } else {
        loadMoreText = '';
      }
      this.setState({
        loadMoreText,
        showEmpty: !newPList.length,
        refreshing: false,
        pList: [...newPList],
      });
    }
  }

  async getHeaderData() {
    const res = await lineChartHeadData();
    if (res) {
      this.setState({
        hederData: res,
      });
    }
  }

  async getRoles() {
    const res = await shopMemRoleId();
    if (res) {
      this.setState({
        roleList: res,
      });
    }
  }

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const { pList, showEmpty, touchItem, roleList, refreshing } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
        <View style={[styles.headerWrap, { height: global.headerHeight, paddingTop: global.statusBarHeight }]}>
          <Text style={styles.headerText}>会员管理</Text>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={(w, h) => this._onContentSizeChange(w, h)}
          onScroll={e => this._onScroll(e)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onHeaderRefresh} />}
          scrollEnabled={touchItem}
        >
          {this.headerComponent()}
          {pList.length ? this.renderProList() : null}
          {this.loadingText()}
          {!touchItem ? (
            <BoxShadow setting={shadowOpt2}>
              <View style={styles.listWrap}>
                <View style={styles.angle} />
                <FlatList key="own" data={roleList} keyExtractor={this._keyExtractor} renderItem={item => this.renderFlatlist(item)} />
              </View>
            </BoxShadow>
          ) : null}
          {showEmpty ? this.emptyComponent() : null}
        </ScrollView>
      </View>
    );
  }
}

styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  headerWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  headerText: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 18,
    color: '#000',
  },
  chartWrap: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 19,
    backgroundColor: '#fff',
  },
  tabWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 24,
  },
  tabBtn: {
    width: 120,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    position: 'relative',
  },
  tabBtnChecked: {
    backgroundColor: '#FA4B91',
  },
  tabText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
  },
  tabTextChecked: {
    color: '#fff',
  },
  tabTextCircle: {
    width: 12,
    height: 12,
    backgroundColor: '#FF0C0C',
    borderRadius: 6,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  navWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 27,
  },
  navBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navNum: {
    fontFamily: 'DINA',
    fontSize: 30,
    color: '#333',
  },
  navText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
  },
  navLine: {
    position: 'absolute',
    top: 18,
    right: 0,
    backgroundColor: '#F4F4F4',
    height: 20,
    width: 1,
  },
  checkedColor: {
    color: '#FA4B91',
  },
  chartContent: {
    backgroundColor: '#fff',
    height: 194,
    position: 'relative',
    marginTop: 20,
  },
  chartBox: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 10,
    left: 0,
    top: 0,
    backgroundColor: '#fff',
    paddingLeft: 23,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 12,
  },
  bottomWrap: {
    paddingLeft: 29,
    paddingRight: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  bottomCon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText1: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333',
  },
  bottomText2: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FA348A',
    marginLeft: 11,
  },
  bottomText1S: {
    color: '#7BA4FF',
  },
  arrowUp: {
    marginBottom: 2.8,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 5,
    borderTopColor: '#fff',
    borderBottomColor: '#FA348A',
    borderLeftColor: '#fff',
    borderRightColor: '#fff',
    marginLeft: 2,
  },
  arrowDown: {
    borderTopColor: '#7BA4FF',
    borderBottomColor: '#fff',
    marginBottom: 0,
    marginTop: 6,
  },
  userTabWrap: {
    paddingTop: 8,
    paddingLeft: 28,
    paddingRight: 28,
    borderBottomColor: '#F4F4F4',
    borderBottomWidth: 0.5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userTabText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  userTabText2: {
    color: '#FA4B91',
  },
  userTabLine: {
    height: 2,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  userTabLine2: {
    backgroundColor: '#FA4B91',
  },
  sortWrap: {
    backgroundColor: '#fff',
    paddingLeft: 25,
    paddingRight: 25,
  },
  bottomLine: {
    backgroundColor: '#F4F4F4',
    height: 0.5,
  },
  loadingText: {
    width: '100%',
    lineHeight: 40,
    paddingBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
  },
  emptyState: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    position: 'relative',
    zIndex: -1,
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
  totalVip: {
    width: '100%',
    backgroundColor: '#fff',
    height: 69,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  totalVipBg: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  totalVipText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666666',
  },
  totalVipNumWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 8,
  },
  totalVipNum: {
    width: 15,
    height: 24,
    borderRadius: 4,
    borderColor: '#c2c2c2',
    borderWidth: 0.5,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalVipNumT: {
    fontFamily: 'DINA',
    fontSize: 20,
    color: '#FA4B91',
  },

  listWrap: {
    width: 188,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 4,
    position: 'relative',
  },
  listItem: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 24,
    borderBottomColor: '#EFEFEF',
    borderBottomWidth: 0.5,
  },
  listItemText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
    lineHeight: 40,
  },
  angle: {
    width: 0,
    height: 0,
    borderWidth: 8,
    borderColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: '#fff',
    position: 'absolute',
    top: -16,
    right: 44,
  },
  checkedItem: {
    backgroundColor: '#F6F6F6',
  },
  modla: {
    position: 'absolute',
    top: 44,
    right: 8,
    zIndex: 500,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 4,
  },
});
