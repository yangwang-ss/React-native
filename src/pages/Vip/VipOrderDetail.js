import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, Clipboard, ScrollView, ImageBackground, TouchableOpacity, StatusBar,
} from 'react-native';
import Toast from 'react-native-root-toast';
import Layout from '../../constants/Layout';
import {
  vipOrderDetail,
  logistics,
} from '../../services/api';

export default class OrderConfirm extends Component {
  static navigationOptions = {
    title: '订单详情',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  }

  state = {
    isSelected: true,
    orderId: '',
    orderInfo: {},
    logisticsList: [],
    corpName: '',
  }

  /**
   * 列表渲染
   */

  logisticsInfo = () => {
    const { logisticsList } = this.state;
    if (logisticsList && logisticsList.length) {
      return logisticsList.map((item, i) => (
        <View key={i} style={styles.logisticsItemWrap}>
          <View style={[styles.iconDotBg, i == 0 ? styles.activeDotBg : '']}>
            <View style={[styles.iconDot, i == 0 ? styles.activeDot : '']} />
          </View>
          <Text style={[styles.logisticsText, i == 0 ? styles.activeText : '', { marginBottom: 10 }]}>{item.context}</Text>
          <Text style={[styles.logisticsText, i == 0 ? styles.activeText : '']}>{item.time}</Text>
        </View>
      ));
    }
  }

  /**
   * 事件绑定
   */
  onPressCopyText = (copyText) => {
    console.log('copyText', copyText);
    Clipboard.setString(copyText);
    storage.save({
      key: 'searchText',
      data: { searchText: copyText },
    });
    Toast.show('内容已复制！');
  }

  /**
   * 接口请求
   */
  async getOrderDetail() {
    const { orderId } = this.state;
    const res = await vipOrderDetail(orderId);
    console.log('vipOrderDetail===', res);
    if (res) {
      this.setState({
        orderInfo: res,
      });
    }
  }

  async getLogistics() {
    const { orderId } = this.state;
    const res = await logistics(orderId);
    if (res) {
      this.setState({
        logisticsList: res && res.logistics || [],
        corpName: res.corpName,
      });
    }
  }

  /**
   * 初始化
   */
  init = () => {
    const orderId = this.props.navigation.getParam('orderId', '');
    console.log('orderId===', orderId);
    this.setState({ orderId }, () => {
      this.getOrderDetail();
      this.getLogistics();
    });
  }


  componentDidMount() {
    this.init();
  }

  render() {
    const {
      corpName, orderInfo, logisticsList, orderInfo: {
        nickName, consignee, mobile, areaName, address, imageUrl, productName,
        amountPaid, sn, paidTimeStr, shippedTimeStr, confirmTimeStr, status, trackNo, note,
      },
    } = this.state;
    const statusText = {
      0: '待支付', 1: '待发货', 2: '已发货', 3: '已收货',
    };
    if (!orderInfo) {
      return false;
    }
    let statusImg = null;
    if (status === 3) {
      statusImg = <Image style={styles.orderDetailTopIcon} source={require('../../../assets/order/icon-trade-success.png')} />;
    }
    return (
      <ScrollView style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <ImageBackground source={require('../../../assets/order/bg-top.png')} style={{ width: '100%' }}>
          <View style={styles.orderDetailTop}>
            <Text style={styles.orderDetailTopTitle}>{statusText[status]}</Text>
            {statusImg}
          </View>
        </ImageBackground>
        <View style={styles.hasAddressWrap}>
          <Image style={styles.hasAddressIcon} source={require('../../../assets/vip/icon-address.png')} />
          <View style={styles.hasAddressContent}>
            <Text style={styles.hasAddressTitle}>
              {' '}
              {consignee}
              {' '}
              {mobile}
            </Text>
            <Text style={styles.hasAddressText}>
收货地址：
              {(areaName + address) || ''}
            </Text>
          </View>
        </View>
        <View style={styles.orderPrdWrap}>
          <View style={styles.prdContent}>
            <Image style={styles.prdImg} source={{ uri: imageUrl }} />
            <View style={styles.prdInfo}>
              <Text style={styles.prdTitle} numberOfLines={2}>{productName}</Text>
              <Text style={styles.prdDefaultPrice}>
￥
                {amountPaid}
              </Text>
            </View>
          </View>
          <View style={[styles.prdPriceWrap, { paddingTop: 12, paddingBottom: 10 }]}>
            <Text style={styles.prdPriceTitle}>商品总价</Text>
            <Text style={styles.prdPrice}>
￥
              {amountPaid}
            </Text>
          </View>
          <View style={[styles.prdPriceWrap, { paddingBottom: 12 }]}>
            <Text style={styles.prdPriceTitle}>微信支付</Text>
            <Text style={styles.prdPrice}>
￥
              {amountPaid}
            </Text>
          </View>
        </View>
        <View style={styles.orderSnWrap}>
          <View style={[styles.orderSn, { marginTop: 16 }]}>
            <Text style={[styles.orderSnTitle, { marginRight: 36 }]}>订单号</Text>
            <Text style={styles.orderSnText}>{sn}</Text>
          </View>
          <View style={styles.orderSn}>
            <Text style={styles.orderSnTitle}>下单时间</Text>
            <Text style={styles.orderSnText}>{paidTimeStr}</Text>
          </View>
          <View style={styles.orderSn}>
            <Text style={styles.orderSnTitle}>发货时间</Text>
            <Text style={styles.orderSnText}>{shippedTimeStr}</Text>
          </View>
          <View style={styles.orderSn}>
            <Text style={styles.orderSnTitle}>收货时间</Text>
            <Text style={styles.orderSnText}>{confirmTimeStr}</Text>
          </View>
          <View style={[styles.orderSn, { marginBottom: 16 }]}>
            <Text style={styles.orderSnTitle}>买家备注</Text>
            <Text style={styles.orderSnText}>{note}</Text>
          </View>
        </View>
        {
          trackNo
          && (
          <View style={styles.logisticsWrap}>
            <View style={{ padding: 16 }}>
              <View style={styles.compony}>
                <Text style={styles.logisticsTitle}>物流公司</Text>
                <Text style={styles.logisticsTitle}>
                  {' '}
                  {corpName}
                </Text>
              </View>
              <View style={styles.logisticsTopWrap}>
                <Text style={styles.logisticsTitle}>
快递单号
                  {trackNo}
                </Text>
                <TouchableOpacity style={styles.btnCopyOrderSn} activeOpacity={Layout.activeOpacity} onPress={() => { this.onPressCopyText(trackNo); }}>
                  <Text style={styles.btnCopyOrderSnText}>复制</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.logisticsInfoWrap}>
              {this.logisticsInfo()}
            </View>
          </View>
          )
      }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
  },
  orderDetailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 64,
    paddingLeft: 32,
    paddingRight: 32,
  },
  orderDetailTopTitle: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#fff',
  },
  orderDetailTopIcon: {
    width: 24,
    height: 24,
  },
  hasAddressWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
  },
  hasAddressIcon: {
    width: 26,
    height: 26,
  },
  hasAddressContent: {
    paddingLeft: 14,
    paddingRight: 18,
  },
  hasAddressTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 15,
    color: '#333',
    marginBottom: 7,
  },
  hasAddressText: {
    width: 275,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  orderPrdWrap: {
    backgroundColor: '#fff',
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  prdContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  prdImg: {
    width: 90,
    height: 90,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  prdInfo: {
    width: 245,
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
  prdPriceWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prdPriceTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
  },
  prdPrice: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
  },
  orderSnWrap: {
    backgroundColor: '#fff',
    marginBottom: 8,
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
  },
  orderSn: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  orderSnTitle: {
    marginRight: 24,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  orderSnText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  logisticsWrap: {
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 40,
  },
  logisticsTopWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  logisticsTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
  },
  btnCopyOrderSn: {
    width: 48,
    height: 22,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 24.5,
  },
  btnCopyOrderSnText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  logisticsInfoWrap: {
    width: Layout.window.width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logisticsItemWrap: {
    position: 'relative',
    width: 315,
    height: 95,
    borderLeftWidth: 0.5,
    borderLeftColor: '#ddd',
    paddingLeft: 14,
  },
  logisticsText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  activeText: {
    color: '#333',
  },
  iconDotBg: {
    position: 'absolute',
    top: 2,
    left: -6,
    width: 12,
    height: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  activeDotBg: {
    top: 0,
    backgroundColor: '#FFE9EB',
  },
  iconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#bbb',
  },
  activeDot: {
    backgroundColor: '#EA4457',
  },
  compony: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
