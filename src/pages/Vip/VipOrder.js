import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, FlatList, RefreshControl, TouchableOpacity, StatusBar,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { RawButton } from 'react-native-gesture-handler';
import Layout from '../../constants/Layout';
import {
  vipOrderList,
  vipOrderReceive,
} from '../../services/api';

export default class OrderConfirm extends Component {
  static navigationOptions = {
    title: '高佣订单',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  }

  state = {
    refreshing: false,
    curPage: 1,
    orderId: '',
    orderList: [],
    showToast: false,
    pid: '',
  }

  /**
   * 列表渲染
   */
  orderItem = (info) => {
    console.log('orderItem===', info.item);
    const { item } = info;
    // 0:待支付 1:已支付,待发货 2.已发货 3.已收货
    return (
      <View style={styles.vipOrderWrap}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.vipOrderContent}>
          <View style={styles.vipOrderTop}>
            <Text style={styles.vipOrderNum}>
订单：
              {item.sn}
            </Text>
            <Text style={[styles.vipOrderStatusText, item.status != 3 ? '' : styles.orderStatusTextDown]}>{item.statusStr}</Text>
          </View>
          <TouchableOpacity style={styles.prdContent} activeOpacity={Layout.activeOpacity} onPress={() => { this.onPressLogistics(item.id); }}>
            <Image style={styles.prdImg} source={{ uri: item.imageUrl }} />
            <View style={styles.prdInfo}>
              <Text style={styles.prdTitle} numberOfLines={2}>{item.productName}</Text>
              <Text style={styles.prdDefaultPrice}>
￥
                {item.amountPaid}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.totalPriceWrap}>
          <Text style={styles.totalPriceText}>
共1件商品 合计：￥
            {item.amountPaid}
          </Text>
        </View>
        <View style={styles.btnOrderWrap}>
          {
            (item.status == 0 || item.status == 1)
            && (
            <TouchableOpacity style={styles.btnLogistics} activeOpacity={Layout.activeOpacity} onPress={() => { this.onPressLogistics(item.id); }}>
              <Text style={styles.btnLogisticsText}>查看详情</Text>
            </TouchableOpacity>
            )
          }
          {
            (item.status == 2 || item.status == 3)
            && (
            <TouchableOpacity style={styles.btnLogistics} activeOpacity={Layout.activeOpacity} onPress={() => { this.onPressLogistics(item.id); }}>
              <Text style={styles.btnLogisticsText}>查看物流</Text>
            </TouchableOpacity>
            )
          }
          {
            item.status == 2
            && (
            <TouchableOpacity style={styles.btnReceive} activeOpacity={Layout.activeOpacity} onPress={() => this.openToast(item.id)}>
              <Text style={styles.btnReceiveText}>确认收货</Text>
            </TouchableOpacity>
            )
          }
        </View>
      </View>
    );
  }

  /**
   * 事件绑定
   */
  onPressLogistics = (orderId) => {
    console.log('onPressLogistics===');
    this.props.navigation.navigate('VipOrderDetail', { orderId });
  }

  onPressReceive = (orderId) => {
    console.log('onPressReceive===', orderId);
    this.vipOrderReceive(orderId);
  }

  openToast(id) {
    this.setState({
      showToast: true,
      pid: id,
    });
  }

  // //下拉刷新
  // onHeaderRefresh = () => {
  //   console.log('onHeaderRefresh===');
  //   this.getOrderList();
  // };

  // //上拉加载
  // onFooterLoad = () => {
  //   console.log('onFooterLoad===');
  //   this.getOrderList();
  // };


  /**
   * 接口请求
   */
  async getOrderList() {
    const res = await vipOrderList();
    if (res && res.length) {
      this.setState({
        orderList: res,
      });
    }
  }

  async vipOrderReceive(orderId) {
    const toast = Toast.show('确认收货中...', {
      duration: 0,
      position: 0,
    });
    const res = await vipOrderReceive(orderId);
    setTimeout(() => {
      Toast.hide(toast);
    }, 1200);
    if (res) {
      Toast.show('确认收货成功！', { position: 0 });
      this.setState({
        showToast: false,
      });
      this.getOrderList();
    }
  }


  /**
   * 初始化
   */
  init = () => {
    this.getOrderList();
  }


  componentDidMount() {
    this.init();
  }

  render() {
    const { orderList, refreshing, showToast } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={orderList}
          style={styles.container}
          contentContainerStyle={{ alignItems: 'center' }}
          keyExtractor={(item, index) => (item + index).toString()}
          renderItem={this.orderItem}
          ListEmptyComponent={() => <Text style={styles.loadingText}>暂无数据</Text>}
        />
        {showToast
          ? (
            <View style={styles.toastWrap}>
              <View style={styles.toastContent}>
                <View style={styles.toastHead}>
                  <Text style={styles.toastHeadText}>确认收货后，商品将不可再发起退货！</Text>
                </View>
                <View style={styles.clickWrap}>
                  <Text style={styles.clickCancel} onPress={() => this.setState({ showToast: false })}>取消</Text>
                  <Text style={styles.clickConcirm} onPress={() => this.onPressReceive(this.state.pid)}>确认收货</Text>
                </View>
              </View>
            </View>
          ) : null
         }
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    width: Layout.window.width,
    height: Layout.window.height,
  },

  loadingText: {
    width: '100%',
    lineHeight: 350,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
  },
  vipOrderWrap: {
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
    marginTop: 12,
    borderRadius: 4,
  },
  vipOrderContent: {
    paddingTop: 14,
    paddingLeft: 16,
    paddingRight: 16,
  },
  vipOrderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vipOrderNum: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
  },
  vipOrderStatusText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#EA4457',
  },
  orderStatusTextDown: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
  },
  prdContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
  },
  prdImg: {
    width: 90,
    height: 90,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  prdInfo: {
    width: 213,
    height: 80,
    marginLeft: 8,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  prdTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333',
  },
  prdDefaultPrice: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  totalPriceWrap: {
    justifyContent: 'flex-end',
    paddingRight: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  totalPriceText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333',
    alignSelf: 'flex-end',
  },
  btnOrderWrap: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnLogistics: {
    width: 72,
    height: 30,
    borderRadius: 24.5,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  btnLogisticsText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
    lineHeight: 30,
    textAlign: 'center',
  },
  btnReceive: {
    width: 72,
    height: 30,
    borderRadius: 24.5,
    borderWidth: 0.5,
    marginLeft: 12,
    borderColor: '#ea4457',
  },
  btnReceiveText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#ea4457',
    lineHeight: 30,
    textAlign: 'center',
  },

  toastWrap: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastContent: {
    width: '70%',
    backgroundColor: '#fff',
    height: 168,
    borderRadius: 6,
  },
  toastHead: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  toastHeadText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  clickWrap: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#DDD',
    borderTopWidth: 0.5,
    backgroundColor: '#fff',
  },
  clickCancel: {
    flex: 1,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    lineHeight: 48,
    textAlign: 'center',
  },
  clickConcirm: {
    flex: 1,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#EA4457',
    borderLeftColor: '#DDD',
    borderLeftWidth: 0.5,
    lineHeight: 48,
    textAlign: 'center',
  },
});
