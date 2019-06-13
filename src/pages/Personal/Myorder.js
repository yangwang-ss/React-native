import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MyOrderList from '../../components/MyOrderList';
import LoadingText from '../../components/LoadingText';
import { backMoney, myWaitOrder, myAllOrder, myAwardOrder, myInvalidOrder } from '../../services/api';

export default class Myorder extends Component {
  static navigationOptions = {
    title: '我的订单',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  };

  state = {
    showToast: false,
    moneyInfo: {},
    tabList: [
      {
        name: '全部',
        type: 1,
        checked: true,
      },
      {
        name: '待奖励',
        type: 2,
        checked: false,
      },
      {
        name: '已奖励',
        type: 3,
        checked: false,
      },
      {
        name: '无效订单',
        type: 4,
        checked: false,
      },
    ],
    pList: [],
    loadingState: '',
    params: {
      type: 1,
      currentPage: 1,
    },
    isEmpty: false,
  };

  componentDidMount() {
    this.getMoney();
    const { params } = this.state;
    this.onHeaderRefresh(params);
  }

  _keyExtractor = (item, index) => `${index}`;

  tabClick(item, index) {
    const { tabList } = this.state;
    const tabListArr = tabList;
    tabListArr.map(item => {
      item.checked = false;
    });
    tabListArr[index].checked = true;
    const datas = {
      currentPage: 1,
      type: item.type,
    };
    this.setState({
      tabList: tabListArr,
      params: datas,
    });
    console.log('点击====', this.state.params);
    this.onHeaderRefresh(datas);
  }

  // 下拉刷新
  onHeaderRefresh = params => {
    const datas = {
      currentPage: 1,
      type: this.state.params.type,
    };
    console.log('下拉刷新===onHeaderRefresh', datas);
    this.setState({
      params: params || datas,
      pList: [],
    });
    this.getOrderList(params || datas);
  };

  // 上拉加载
  onFooterLoad = () => {
    const { params } = this.state;
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getOrderList(params);
    }
  };

  /**
   * 接口请求
   */
  async getOrderList(params) {
    let { currentPage } = params;
    let loadingState = 'loading';
    this.setState({ loadingState, isEmpty: false });

    let res = null;
    if (params.type == 1) {
      res = await myAllOrder(currentPage);
    } else if (params.type == 2) {
      res = await myWaitOrder(currentPage);
    } else if (params.type == 3) {
      res = await myAwardOrder(currentPage);
    } else if (params.type == 4) {
      res = await myInvalidOrder(currentPage);
    }
    console.log('订单类型====', params.type, res);
    if (res && res.list.length > 0) {
      currentPage++;
      this.canLoadMore = true;
      this.setState({
        pList: [...this.state.pList, ...res.list],
        params: {
          type: params.type,
          currentPage,
        },
        loadingState: '',
      });
    } else {
      if (this.state.pList.length) {
        loadingState = 'noMoreData';
      } else {
        this.setState({
          isEmpty: true,
        });
        loadingState = '';
      }
      this.setState({
        loadingState,
      });
    }
  }

  async getMoney() {
    const res = await backMoney();
    console.log('money======', res);
    if (res) {
      this.setState({
        moneyInfo: res,
      });
    }
  }

  loadingText = () => {
    const { loadingState } = this.state;
    if (loadingState) {
      return <LoadingText loading={loadingState} />;
    }
    return null;
  };

  renderTab() {
    const arr = [];
    const { tabList } = this.state;
    tabList.map((item, index) => {
      arr.push(
        <TouchableOpacity activeOpacity={0.85} style={styles.tabItemWrap} key={index} onPress={() => this.tabClick(item, index)}>
          <Text style={[styles.tabItemWrapText, item.checked ? '' : styles.tabItemWrapText2]}>{item.name}</Text>
          <Text style={item.checked ? styles.tabItemCheck : [styles.tabItemCheck, styles.tabItemNoCheck]} />
        </TouchableOpacity>
      );
    });
    return arr;
  }

  renderProList(item) {
    return <MyOrderList orderItem={item} />;
  }

  // 列表为空时模板
  emptyComponent() {
    return (
      <View style={styles.noOrder}>
        <Image style={styles.noOrderImg} resizeMode="center" source={{ uri: 'http://family-img.vxiaoke360.com/no-order2.png' }} />
        <Text style={styles.noOrderText}>暂无订单喔，快去下单吧~</Text>
      </View>
    );
  }

  render() {
    const { moneyInfo, isEmpty } = this.state;
    const { isReview } = global;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#F937A5', '#FC4277']} style={styles.moneyWrap}>
          <Text style={styles.moneyWrapText}>
            累计已奖励
            {moneyInfo.settled || '0.00'}元
          </Text>
          <Text style={styles.moneyWrapText}>
            累计待奖励
            {moneyInfo.waitSettle || '0.00'}元
          </Text>
          <Text style={styles.moneyWrapBorder} />
        </LinearGradient>
        <View style={styles.ruleWrap}>
          <Image style={styles.ruleWrapIcon1} source={require('../../../assets/myOrder-rule-icon1.png')} />
          <Text style={styles.ruleWrapText1} onPress={() => this.setState({ showToast: true })}>
            订单确认收货后次月结算，
          </Text>
          <Text style={[styles.ruleWrapText1, styles.ruleWrapText2]} onPress={() => this.setState({ showToast: true })}>
            具体规则
          </Text>
          <Image style={styles.ruleWrapIcon2} source={require('../../../assets/myOrder-icon-more.png')} />
        </View>
        <View style={styles.tabWrap}>{this.renderTab()}</View>
        {this.state.pList.length > 0 && (
          <FlatList
            data={this.state.pList}
            keyExtractor={this._keyExtractor}
            renderItem={item => this.renderProList(item)}
            onEndReachedThreshold={0.1}
            onEndReached={this.onFooterLoad}
            ListFooterComponent={() => this.loadingText()}
          />
        )}
        {isEmpty && this.emptyComponent()}

        {this.state.showToast ? (
          <View style={styles.toastWrap}>
            <View style={styles.toastContentWrap}>
              <View style={styles.toastContent}>
                <Text style={styles.toastTitle}>具体规则</Text>
                <View style={styles.toastWordsWrap}>
                  <Text style={styles.toastWords1}>一、返现规则：</Text>
                  <Text style={styles.toastWords2}>
                    每月25日结算上月【确认收货】的订单，已结算的金额可以提现到微信。
                    举例：您1月在淘宝下单，并在1月内确认收货，2月25日这笔订单的返现到账，可以提现。如果1月订单在2月确认收货，则在3月25日到账。
                  </Text>
                  <Text style={[styles.toastWords1, styles.top22]}>二、失效订单：</Text>
                  <Text style={styles.toastWords2}>产生退货退款等售后维权就会出现，失效订单，失效订单无返现。</Text>
                </View>
              </View>
              <View style={styles.toastConfirmWrap}>
                <Text style={styles.toastConfirm} onPress={() => this.setState({ showToast: false })}>
                  知道了
                </Text>
              </View>
            </View>
          </View>
        ) : null}
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
  moneyWrap: {
    width: '100%',
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  moneyWrapText: {
    width: '50%',
    paddingLeft: 16,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#FFF',
  },
  moneyWrapBorder: {
    width: 0.5,
    backgroundColor: '#fff',
    height: 16,
    position: 'absolute',
    left: '50%',
    top: 10,
  },
  ruleWrap: {
    paddingLeft: 16,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  ruleWrapIcon1: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 4,
  },
  ruleWrapText1: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#999',
  },
  ruleWrapText2: {
    color: '#FC4277',
  },
  ruleWrapIcon2: {
    width: 6.5,
    height: 10,
    marginLeft: 3,
  },
  tabWrap: {
    paddingLeft: 24,
    paddingRight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabItemWrap: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemWrapText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333333',
  },
  tabItemWrapText2: {
    fontSize: 14,
    color: '#666',
  },
  tabItemCheck: {
    width: 16,
    height: 2,
    backgroundColor: '#FC4277',
    marginTop: 11,
  },
  tabItemNoCheck: {
    backgroundColor: 'transparent',
  },
  pWrap: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  toastWrap: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastContentWrap: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 270,
    height: 363,
    position: 'relative',
    paddingTop: 24,
  },
  toastContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  toastTitle: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333333',
    width: '100%',
    textAlign: 'center',
  },
  toastWordsWrap: {
    width: '100%',
    height: 242,
    marginTop: 16,
  },
  toastWords1: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
  },
  toastWords2: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#2A2A2A',
    lineHeight: 22,
  },
  top22: {
    marginTop: 22,
  },
  toastConfirmWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 48,
    borderTopWidth: 0.5,
    borderTopColor: '#efefef',
  },
  toastConfirm: {
    width: '100%',
    height: 48,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#FC4277',
    lineHeight: 48,
    textAlign: 'center',
  },
  noOrder: {
    width: '100%',
    alignItems: 'center',
    marginTop: 52,
  },
  noOrderImg: {
    width: 150,
    height: 150,
  },
  noOrderText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
  },
});
