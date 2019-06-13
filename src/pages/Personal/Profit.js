import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, StatusBar } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import ProfitItem from '../../components/ProfitItem';
import { getSaleProfit, getTeamProfit, getProfitAmount, getOrderProfit, getStoreProfit } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import FitRule from '../../components/FitRule';
import FitRuleBtn from '../../components/FitRuleBtn';
import LoadingText from '../../components/LoadingText';

export default class ProfitIndex extends Component {
  static navigationOptions = {
    title: '今日预计收益',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  };

  state = {
    menus: [
      {
        name: '淘宝商品奖励',
        active: true,
        type: 0,
        money: 0.0,
      },
      {
        name: '门店商品奖励',
        active: false,
        type: 2,
        money: 0.0,
      },
      {
        name: '邀请奖励',
        active: false,
        type: 1,
        money: 0.0,
      },
    ],
    tabType: 0,
    totalMoney: 0.0,
    dataSource: [],
    loadingState: '',
    currentPage: 1,
    isShowRule: false,
  };

  init() {
    const { currentPage, tabType } = this.state;
    this.checkIsStore();
    this.fetchListData(currentPage, tabType);
    this.fetchAmount();
  }

  async checkIsStore() {
    const { menus } = this.state;
    const userInfo =
      (await storage
        .load({
          key: 'userInfo',
        })
        .catch(e => e)) || {};
    if (userInfo.isStore) {
      menus.push({
        name: '门店订单收益',
        active: false,
        type: 3,
        money: 0.0,
      });
      this.setState({
        menus,
      });
    }
  }

  _keyExtractor = (item, index) => `${index}`;

  renderMenus = () => {
    const { menus } = this.state;
    const arr = [];
    menus.map((item, index) => {
      arr.push(
        <View key={index} style={styles.tabWrap}>
          <View style={styles.itemWrap}>
            <View style={styles.tabItem}>
              <Text onPress={() => this.menuChange(item, index)} style={[styles.tabMoney, item.active ? styles.tabActive : '']}>
                {item.money}
              </Text>
              <Text onPress={() => this.menuChange(item, index)} style={[styles.tabName, item.active ? styles.tabActive : '']}>
                {item.name}
              </Text>
            </View>
            <View style={styles.tabLine} />
          </View>
          <View style={[styles.tabIcon, item.active && styles.tabIconAct]} />
        </View>
      );
    });
    return arr;
  };

  menuChange = (item, index) => {
    const { menus } = this.state;
    const menusArr = menus;
    menusArr.map(item => {
      item.active = false;
    });
    menusArr[index].active = true;
    this.setState({
      menus: menusArr,
      tabType: item.type,
      dataSource: [],
    });
    this.menuData(1, item.type);
  };

  menuData = (currentPage, tabType) => {
    this.fetchListData(currentPage, tabType);
  };

  toastRule = () => {
    this.setState({
      isShowRule: true,
    });
  };

  closeRule = () => {
    this.setState({
      isShowRule: false,
    });
  };

  // 上拉加载
  onFooterLoad = () => {
    const { currentPage, tabType } = this.state;
    console.log('上拉加载===onFooterRefresh');
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.fetchListData(currentPage, tabType);
    }
  };

  // 数据处理
  dataProcessing = (res, currentPage) => {
    let loadingState = '';
    if (res) {
      if (res.list.length > 0) {
        currentPage++;
        this.setState({
          dataSource: [...this.state.dataSource, ...res.list],
          currentPage,
          loadingState: '',
        });
      } else if (this.state.dataSource.length > 0) {
        loadingState = 'noMoreData';
      } else {
        loadingState = 'empty';
      }
    }
    this.setState({
      loadingState,
    });
  };

  /**
   * 接口请求
   */
  async fetchListData(currentPage, type) {
    const loadingState = 'loading';
    this.setState({
      loadingState,
    });
    let res = '';
    switch (type) {
      case 0:
        res = await getSaleProfit(currentPage);
        break;
      case 1:
        res = await getTeamProfit(currentPage);
        break;
      case 2:
        res = await getStoreProfit(currentPage);
        break;
      default:
        res = await getOrderProfit(currentPage);
        break;
    }
    this.dataProcessing(res, currentPage);
    if (res && res.list.length > 0) {
      this.canLoadMore = true;
      return true;
    }
  }

  async fetchAmount() {
    const { menus } = this.state;
    const res = await getProfitAmount();
    if (res) {
      menus[0].money = res.todayEstimateSaleAmount;
      menus[2].money = res.todayEstimateTeamAmount;
      menus[1].money = res.todayEstimateStoreAmount;
      if (menus.length > 3) {
        menus[3].money = res.todayStoreEstimateAmount;
      }
      this.setState({
        totalMoney: res.todayEstimateAmount,
        menus,
      });
    }
  }

  /**
   * 元素渲染
   */
  loadingText = () => {
    const { loadingState, dataSource } = this.state;
    if (dataSource.length) {
      return <LoadingText loading={loadingState} />;
    }
    return null;
  };

  profitItem = info => {
    const isLine = info.index === this.state.dataSource.length - 1;
    return <ProfitItem item={info.item} isLine={isLine} type={this.state.tabType} />;
  };

  emptyState = () => {
    return (
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <EmptyState />
      </View>
    );
  };

  render() {
    const { dataSource, totalMoney, isShowRule } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.titleWrap}>
          <FitRuleBtn toastRule={this.toastRule} />
          <Text style={styles.title}>今日预计收益(元)</Text>
          <Text style={styles.totalMoney}>{totalMoney}</Text>
        </View>
        <View style={styles.tabBox}>
          <View style={styles.tabView}>{this.renderMenus()}</View>
        </View>
        <View style={styles.height8} />
        <FlatList
          contentContainerStyle={{ backgroundColor: '#fff' }}
          data={dataSource}
          keyExtractor={this._keyExtractor}
          renderItem={this.profitItem}
          onEndReachedThreshold={0.1}
          onEndReached={this.onFooterLoad}
          ListFooterComponent={() => this.loadingText()}
          ListEmptyComponent={() => this.emptyState()}
        />
        {isShowRule ? <FitRule closeRule={() => this.closeRule()} /> : null}
        <NavigationEvents onDidFocus={() => this.init()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  titleWrap: {
    paddingTop: 24,
    paddingBottom: 34,
    backgroundColor: '#fff',
    position: 'relative',
  },
  title: {
    color: '#666',
    marginBottom: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  totalMoney: {
    color: '#FC4277',
    fontSize: 30,
    fontFamily: 'DINA',
    textAlign: 'center',
  },
  tabBox: {
    paddingBottom: 0,
  },
  height8: {
    width: '100%',
    height: 8,
    backgroundColor: '#f4f4f4',
  },
  tabView: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  tabWrap: {
    flex: 1,
    marginBottom: -2,
  },
  itemWrap: {
    flexDirection: 'row',
  },
  tabLine: {
    width: 1,
    height: 24,
    backgroundColor: '#ddd',
    marginTop: 10,
  },
  tabIcon: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0)',
    width: '100%',
  },
  tabIconAct: {
    borderColor: '#FC4277',
  },
  tabItem: {
    marginBottom: 12,
    flex: 1,
  },
  tabMoney: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'DINA',
  },
  tabName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
  },
  tabActive: {
    color: '#FC4277',
  },
  refreshWrap: {
    backgroundColor: '#fff',
  },
});
