import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView } from 'react-native';
import Alipay from '@0x5e/react-native-alipay';
import { NavigationEvents } from 'react-navigation';
import Toast from 'react-native-root-toast';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { confirmOrder, createOrder } from '../../services/api';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#efefef',
    flex: 1,
  },
  borderBottom: {
    borderBottomColor: '#efefef',
    borderBottomWidth: 0.5,
  },
  scrollView: {
    marginBottom: 48,
  },
  addAddress: {
    width: '100%',
    height: 66,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  addAddressIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  addAddressText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#FC4277',
  },
  defaultAddress: {
    flex: 1,
    height: 66,
    backgroundColor: '#fff',
    marginBottom: 8,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
  },
  addressInfo: {
    flex: 1,
    marginLeft: 14,
  },
  addressItem: {
    flexDirection: 'row',
  },
  addressItemText1: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 15,
    color: '#333',
  },
  addressItemText2: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
  },
  orderInfo: {
    width: '100%',
    height: 157,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  orderDetail: {
    width: '100%',
    height: 114,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: '#efefef',
    borderBottomWidth: 0.5,
  },
  orderDetailImage: {
    width: 90,
    height: 90,
    marginRight: 8,
  },
  orderDetailInfo: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  orderDetailTitle: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  orderDetailPrice: {
    fontSize: 12,
    color: '#999',
  },
  iconArrow: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  orderPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 42.5,
    paddingLeft: 12,
    paddingRight: 12,
  },
  orderPriceTitle: {
    fontSize: 12,
    color: '#666',
  },
  orderPriceText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  priceIcon: {
    fontSize: 12,
    color: '#fc4277',
    paddingBottom: 3,
  },
  priceText: {
    fontFamily: 'DINAlternate-Bold',
    fontSize: 22,
    color: '#fc4277',
  },
  orderAddress: {
    width: '100%',
    height: 66,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  orderAddressIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  orderAddressText: {
    justifyContent: 'space-between',
  },
  phone: {
    fontSize: 15,
    color: '#333',
  },
  selfTakePlace: {
    height: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 6,
  },
  selfTake: {
    width: 54,
    height: 18,
    backgroundColor: '#fc4277',
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    borderRadius: 3,
    marginRight: 4,
    lineHeight: 18,
    alignItems: 'center',
  },
  place: {
    fontSize: 12,
    color: '#666',
  },
  orderCoupon: {
    width: '100%',
    height: 48,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  orderCouponTitle: {
    fontSize: 16,
    color: '#333',
  },
  orderCouponText: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  couponPrice: {
    fontSize: 12,
    color: '#999',
    marginRight: 4,
  },
  arrow: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  orderTip: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  orderTipTitle: {
    fontSize: 16,
    color: '#333',
    lineHeight: 48,
  },
  orderTipInput: {
    padding: 0,
    fontSize: 14,
    flex: 1,
  },
  orderPayText: {
    fontSize: 14,
    marginLeft: 12,
    marginBottom: 8,
    color: '#666',
  },
  payType: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 25,
  },
  payTypeTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payTypeText: {
    fontSize: 14,
    color: '#333',
  },
  payTypeIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  selectIcon: {},
  notSelect: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderColor: '#999',
    borderWidth: 1,
  },
  selected: {
    width: 24,
    height: 24,
  },
  submitOrder: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  submitOrderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 30,
  },
  submitOrderText: {
    fontSize: 12,
    color: '#333',
  },
  submitOrderButton: {
    width: 150,
    height: 48,
    lineHeight: 48,
    textAlign: 'center',
    backgroundColor: '#fc4277',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  color: {
    color: '#fc4277',
    fontSize: 12,
  },
  bigFont: {
    fontFamily: 'DINAlternate-Bold',
    fontSize: 22,
    marginBottom: 5,
  },
});
type Props = {
  navigation: Object,
};
export default class ConfirmOrder extends React.Component<Props> {
  static navigationOptions = {
    title: '确认订单',
  };

  state = {
    order: {},
    //   创建订单的对象
    params: {
      payType: 1,
    },
    addressInfo: {},
  };

  componentDidMount() {
    const { navigation } = this.props;
    const id = navigation.getParam('id');
    this.getOrderInfo(id);
  }

  // 获取订单信息
  async getOrderInfo(id) {
    const res = await confirmOrder(id);
    const { params } = this.state;
    console.log(res);
    if (res) {
      //   distribution取货方式，0到店自提，1送货上门
      this.setState(
        {
          order: { ...res },
          params: {
            ...params,
            goodsId: res.id,
          },
        },
        () => {
          this.init();
        }
      );
    }
  }

  init = async () => {
    const { order } = this.state;
    if (order && typeof order.distribution === 'number') {
      const addressInfo =
        (await storage
          .load({
            id: order.distribution,
            key: 'addressInfo',
          })
          .catch(e => e)) || {};
      if (!addressInfo.message) {
        this.setState({
          addressInfo,
        });
      }
    }
  };

  // 提交订单
  async submit() {
    let { params } = this.state;
    const { order, addressInfo } = this.state;
    if (!(addressInfo instanceof Object) || !addressInfo.userName) {
      Toast.show('请填写联系人信息！');
      return;
    }
    if (order.distribution === 1) {
      const {
        userName: consignee,
        phoneNum: mobile,
        regionText: areaName,
        addressDetaill: address,
        addressId: { provinceId: areaId, cityId: areaId2, areaId: areaId3 },
      } = addressInfo;
      params = {
        ...params,
        consignee,
        mobile,
        areaName,
        address,
        areaId,
        areaId2,
        areaId3,
      };
    } else if (order.distribution === 0) {
      const { userName: consignee, phoneNum: mobile } = addressInfo;
      params = {
        ...params,
        consignee,
        mobile,
      };
    }

    const res = await createOrder(params);
    if (res) {
      const infoStr = res.info;
      console.log(params);
      if (params.payType === 0) {
        // 微信
        infoStr.package = res.info.packageValue;
        WeChat.pay(infoStr)
          .then(result => {
            console.log(result);
            const { navigation } = this.props;
            navigation.replace('PayResult', {
              id: params.goodsId,
              distribution: order.distribution,
              orderId: res.orderId,
            });
          })
          .catch(err => {
            console.log('WeChat pay===err', err);
          });
      } else {
        //   支付宝
        const response = await Alipay.authWithInfo(infoStr);
        const payResult = JSON.parse(response.result);
        if (payResult.alipay_trade_app_pay_response.code === '10000') {
          const { navigation } = this.props;
          navigation.replace('PayResult', {
            id: params.goodsId,
            distribution: order.distribution,
            orderId: res.orderId,
          });
        }
        console.log('alipay', payResult);
      }
    }
  }

  // 切换付款方式
  togglePayType(type) {
    const { params } = this.state;
    this.setState({
      params: { ...params, payType: type },
    });
  }

  // 编辑地址
  editAddress() {
    const {
      order: { distribution },
    } = this.state;
    const { navigation } = this.props;
    navigation.push('AddAddress', {
      distribution,
    });
  }

  render() {
    const { order, params, addressInfo } = this.state;
    const hasAddress = Object.keys(addressInfo).length > 0;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.scrollView}>
          {!hasAddress ? (
            <TouchableOpacity onPress={() => this.editAddress()} style={styles.addAddress}>
              <Image style={styles.addAddressIcon} source={require('../../../assets/vip/icon-add.png')} />
              <Text style={styles.addAddressText}>{order.distribution === 0 ? '添加取货人' : '添加地址'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.defaultAddress} onPress={() => this.editAddress()}>
              <Image source={require('@assets/icon-location.png')} style={{ width: 26, height: 26 }} />
              <View style={styles.addressInfo}>
                <View style={styles.addressItem}>
                  <Text style={[styles.addressItemText1, { marginRight: 10 }]}>{addressInfo.userName}</Text>
                  <Text style={styles.addressItemText1}>{addressInfo.phoneNum}</Text>
                </View>
                {order.distribution === 1 && (
                  <View style={[styles.addressItem, { overflow: 'hidden' }]}>
                    <Text style={styles.addressItemText2}>收货地址：</Text>
                    <Text style={styles.addressItemText2} numberOfLines={2}>{`${addressInfo.regionText} ${addressInfo.addressDetaill}`}</Text>
                  </View>
                )}
              </View>
              <Image style={styles.iconArrow} source={require('@assets/vip/icon-arrow.png')} />
            </TouchableOpacity>
          )}
          <View style={styles.orderInfo}>
            <View style={styles.orderDetail}>
              <Image style={styles.orderDetailImage} source={{ uri: order.thumbnail }} />
              <View style={styles.orderDetailInfo}>
                <Text style={styles.orderDetailTitle} numberOfLines={4}>
                  {order.title}
                </Text>
                <Text style={styles.orderDetailPrice}>￥{order.salePrice}</Text>
              </View>
            </View>
            <View style={styles.orderPrice}>
              <Text style={styles.orderPriceTitle}>商品总价</Text>
              <View style={styles.orderPriceText}>
                <Text style={styles.priceIcon}>￥</Text>
                <Text style={styles.priceText}>{order.salePrice}</Text>
              </View>
            </View>
          </View>
          {order.distribution === 0 && (
            <View style={styles.orderAddress}>
              <Image style={styles.orderAddressIcon} source={{ uri: order.storeIcon }} />
              <View style={styles.orderAddressText}>
                <Text style={styles.phone}>
                  {order.storeName} {order.storeMobile}
                </Text>
                <View style={styles.selfTakePlace}>
                  <Text style={styles.selfTake}>到店自提</Text>
                  <Text style={styles.place}>{order.storeAddress}</Text>
                </View>
              </View>
            </View>
          )}
          <View style={styles.orderCoupon}>
            <Text style={styles.orderCouponTitle}>优惠券</Text>
            <View style={styles.orderCouponText}>
              <Text style={styles.couponPrice}>{Number(order.couponPrice) > 0 ? order.couponPrice : '无可用'}</Text>
              <Image style={styles.arrow} source={require('../../../assets/icon-gray-more.png')} />
            </View>
          </View>
          <View style={styles.orderTip}>
            <Text style={styles.orderTipTitle}>备注：</Text>
            <TextInput style={styles.orderTipInput} placeholder="买家留言(选填)" placeholderTextColor="#999" onChangeText={text => this.setState({ params: { ...params, note: text } })} />
          </View>
          <Text style={styles.orderPayText}>支付方式</Text>
          <View style={styles.orderPay}>
            <TouchableOpacity onPress={() => this.togglePayType(1)} style={[styles.payType, styles.borderBottom]}>
              <View style={styles.payTypeTitle}>
                <Image style={styles.payTypeIcon} source={require('../../../assets/ConfirmOrder/alipay.png')} />
                <Text style={styles.payTypeText}>支付宝</Text>
              </View>
              <View style={styles.selectIcon}>
                {params.payType === 1 ? <Image style={styles.selected} source={require('../../../assets/ConfirmOrder/selected.png')} /> : <View style={styles.notSelect} />}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.togglePayType(0)} style={styles.payType}>
              <View style={styles.payTypeTitle}>
                <Image style={styles.payTypeIcon} source={require('../../../assets/ConfirmOrder/weixin.png')} />
                <Text style={styles.payTypeText}>微信</Text>
              </View>
              <View style={styles.selectIcon}>
                {params.payType === 0 ? <Image style={styles.selected} source={require('../../../assets/ConfirmOrder/selected.png')} /> : <View style={styles.notSelect} />}
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={[styles.submitOrder, isIphoneX() ? { marginBottom: 30 } : '']}>
          <View style={styles.submitOrderTitle}>
            <Text style={styles.submitOrderText}>需付款：</Text>
            <Text style={styles.color}>￥</Text>
            <Text style={[styles.color, styles.bigFont]}>{order.discountPrice}</Text>
          </View>
          <TouchableOpacity onPress={() => this.submit()} style={styles.submitOrderButton}>
            <Text style={styles.buttonText}>提交订单</Text>
          </TouchableOpacity>
        </View>
        <NavigationEvents onDidFocus={this.init} />
      </KeyboardAvoidingView>
    );
  }
}
