import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, StatusBar } from 'react-native';
import { monthFitList } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import FitRule from '../../components/FitRule';
import FitRuleBtn from '../../components/FitRuleBtn';

export default class Monthfit extends Component {
  static navigationOptions = {
    title: `${new Date().getMonth() + 1}月预计收益`,
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  };

  state = {
    moneyInfo: {
      amount: '0.00',
      saleAmount: '0.00',
      teamAmount: '0.00',
    },
    monthList: [],
    isShowRule: false,
    isStore: false,
  };

  async componentDidMount() {
    const userInfo =
      (await storage
        .load({
          key: 'userInfo',
        })
        .catch(e => e)) || {};
    this.setState(
      {
        isStore: userInfo.isStore,
      },
      () => {
        this.getList();
      }
    );
  }

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

  async getList() {
    const res = await monthFitList();
    if (res) {
      this.setState({
        moneyInfo: {
          amount: res.amount,
          saleAmount: res.saleAmount,
          teamAmount: res.teamAmount,
          storeAmount: res.storeAmount,
          storeIncomeAmount: res.storeIncomeAmount,
        },
        monthList: res.list,
      });
    }
  }

  _keyExtractor = (item, index) => `${index}`;

  profitItem = item => {
    const { isStore } = this.state;
    const data = item.item;
    return (
      <View style={[styles.itemBox, styles.flexRow]}>
        <Text style={styles.item1}>{data.today}</Text>
        <Text style={styles.item2}>{data.saleReward}</Text>
        <Text style={styles.item2}>{data.storeReward}</Text>
        <Text style={styles.item2}>{data.teamReward}</Text>
        {isStore && <Text style={styles.item2}>{data.storeIncome}</Text>}
      </View>
    );
  };

  emptyState = () => {
    return (
      <View style={{ backgroundColor: '#fff', marginTop: 25, paddingBottom: 50 }}>
        <EmptyState />
      </View>
    );
  };

  render() {
    const { moneyInfo, isShowRule, isStore } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.headerWrap}>
          <FitRuleBtn toastRule={this.toastRule} />
          <Text style={styles.headerText}>本月预计收益(元)</Text>
          <Text style={styles.headerMoney}>{moneyInfo.amount || '0.00'}</Text>
        </View>

        <View style={styles.itemWrap}>
          <View style={[styles.itemHeader, styles.flexRow]}>
            <Text style={styles.itemMonth}>本月 </Text>
            <View style={styles.itemAward}>
              <Text style={styles.itemAwardInfo}>淘宝商品奖励</Text>
              <Text style={styles.itemAwardNum}>{moneyInfo.saleAmount || '0.00'}</Text>
            </View>
            <View style={styles.itemAward}>
              <Text style={styles.itemAwardInfo}>门店商品奖励</Text>
              <Text style={styles.itemAwardNum}>{moneyInfo.storeAmount || '0.00'}</Text>
            </View>
            <View style={styles.itemAward}>
              <Text style={styles.itemAwardInfo}>邀请奖励</Text>
              <Text style={styles.itemAwardNum}>{moneyInfo.teamAmount || '0.00'}</Text>
            </View>
            {isStore && (
              <View style={styles.itemAward}>
                <Text style={styles.itemAwardInfo}>门店订单收益</Text>
                <Text style={styles.itemAwardNum}>{moneyInfo.storeIncomeAmount || '0.00'}</Text>
              </View>
            )}
          </View>
          <FlatList
            data={this.state.monthList}
            keyExtractor={this._keyExtractor}
            renderItem={this.profitItem}
            onEndReachedThreshold={0.1}
            onEndReached={this.onFooterLoad}
            ListEmptyComponent={() => this.emptyState()}
          />
        </View>
        {isShowRule ? <FitRule closeRule={() => this.closeRule()} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f4f4',
  },
  headerWrap: {
    width: '100%',
    height: 112,
    backgroundColor: '#fff',
    alignItems: 'center',
    position: 'relative',
  },
  headerText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 24,
  },
  headerMoney: {
    fontFamily: 'DINA',
    fontSize: 30,
    color: '#FC4277',
    marginTop: 12,
  },
  itemWrap: {
    flex: 1,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemHeader: {
    height: 64,
    borderBottomWidth: 0.5,
    borderBottomColor: '#efefef',
    paddingLeft: 16,
    paddingRight: 16,
  },
  itemMonth: {
    width: 35,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666666',
    lineHeight: 64,
    textAlign: 'center',
    marginRight: 5,
  },
  itemAward: {
    flex: 1,
    alignItems: 'flex-end',
  },
  itemAwardInfo: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666666',
  },
  itemAwardNum: {
    fontFamily: 'DINA',
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },
  itemBox: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  item1: {
    width: 40,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333',
  },
  item2: {
    flex: 1,
    alignItems: 'flex-end',
    fontFamily: 'DINA',
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
  },
});
