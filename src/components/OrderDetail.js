import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Layout from '../constants/Layout';

const shadowValue = {
  width: Layout.window.width,
  height: 40,
  color: '#999',
  border: 16,
  opacity: 0.4,
  radius: 14,
  x: 0,
  y: 0,
  style: { position: 'absolute', left: 0, bottom: 0 },
};

export default class OrderDetail extends React.Component {
  isReceiving = () => {
    const { isReceiving } = this.props;
    isReceiving();
  };

  deliverGoods = () => {
    const { deliverGoods } = this.props;
    deliverGoods();
  };

  linkingPhone = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log('不支持拨打电话功能');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  handleGoods = (status) => {
    if (status === 1) {
      this.deliverGoods();
    } else {
      this.isReceiving()
    }
  };

  render() {
    const { data, isStore } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.orderHeader}>
            <Image style={styles.headerBg} source={require('../../assets/order/bg-top.png')} />
            <View style={styles.headerWrap}>
              <Text style={styles.headerText}>{data.statusStr}</Text>
              <Image style={styles.headerIcon} source={require('../../assets/order/icon-trade-success.png')} />
            </View>
          </View>
          <View style={[styles.infoWrap, styles.personInfo]}>
            <Image style={styles.addressIcon} source={require('../../assets/vip/icon-address.png')} />
            <View style={{ flex: 1 }}>
              <Text style={styles.personName}>
                {data.consignee} {data.mobile}
              </Text>
              {data.distribution === 1 ? (
                <View style={styles.addressWrap}>
                  <Text style={styles.personAddress}>
                    收货地址：
                    {data.address && `${data.address}`}
                  </Text>
                </View>
              ) : (
                <View style={styles.addressWrap}>
                  <View style={styles.addressLabel}>
                    <Text style={styles.personAddress2}>到店自提</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={styles.productInfoWrap}>
            <View style={[styles.infoWrap, styles.productInfoBox]}>
              <Image style={styles.productImg} source={{ uri: data.thumbnail }} />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{data.productName}</Text>
                <Text style={styles.productPrice}>￥{data.salePrice}</Text>
              </View>
            </View>
            <View style={[styles.infoWrap, styles.priceWrap]}>
              <View style={styles.priceBox}>
                <Text style={styles.priceTitle}>商品总价</Text>
                <Text style={styles.priceText}>￥{data.salePrice}</Text>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.priceTitle}>优惠券</Text>
                <Text style={styles.priceText}>-￥{data.couponPrice}</Text>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.priceTitle}>实付金额</Text>
                <Text style={styles.priceText}>￥{data.amount}</Text>
              </View>
            </View>
          </View>
          <View style={styles.infoWrap}>
            <View style={styles.textWrap}>
              <View style={styles.dataTextWrap}>
                <Text style={styles.dataText}>订单号</Text>
              </View>
              <Text style={styles.dataText}>{data.sn}</Text>
            </View>
            <View style={styles.textWrap}>
              <View style={styles.dataTextWrap}>
                <Text style={styles.dataText}>下单时间</Text>
              </View>
              <Text style={styles.dataText}>{data.paidTime}</Text>
            </View>
            <View style={styles.textWrap}>
              <View style={styles.dataTextWrap}>
                <Text style={styles.dataText}>发货时间</Text>
              </View>
              <Text style={styles.dataText}>{data.deliveryTime}</Text>
            </View>
            <View style={styles.textWrap}>
              <View style={styles.dataTextWrap}>
                <Text style={styles.dataText}>收货时间</Text>
              </View>
              <Text style={styles.dataText}>{data.completionTime}</Text>
            </View>
            <View style={styles.textWrap}>
              <View style={styles.dataTextWrap}>
                <Text style={styles.dataText}>买家备注</Text>
              </View>
              <Text style={styles.dataText}>{data.remark || data.note}</Text>
            </View>
          </View>
          {isStore && data.paySuccessVO && (
            <View style={[styles.orderWrap, isIphoneX() && styles.bottomMargin]}>
              <View style={styles.orderTitle}>
                <Image style={styles.titleIcon} source={require('../../assets/order/icon-shop.png')} />
                <Text style={styles.titleText}>{data.storeName}</Text>
              </View>
              <View style={styles.orderInfoWrap}>
                <View style={styles.orderTip}>
                  <View style={styles.orderTipIcon} />
                  <Text style={styles.orderTipText}>{data.paySuccessVO.copywriting}</Text>
                </View>
                <View style={styles.textWrap}>
                  <View style={styles.dataTextWrap}>
                    <Text style={styles.dataText}>店长</Text>
                  </View>
                  <Text style={styles.dataText}>{data.paySuccessVO.idName}</Text>
                </View>
                <View style={styles.textWrap}>
                  <View style={styles.dataTextWrap}>
                    <Text style={styles.dataText}>电话</Text>
                  </View>
                  {
                    data.paySuccessVO.mobile && (
                      <TouchableOpacity style={styles.orderTelWrap} activeOpacity={Layout.activeOpacity} onPress={() => this.linkingPhone(`tel:${data.paySuccessVO.mobile}`)}>
                        <Text style={styles.orderTelText}>
                          {data.paySuccessVO.mobile}
                        </Text>
                        <Image style={styles.orderTel} source={require('../../assets/order/icon-tel.png')} />
                      </TouchableOpacity>
                    )
                  }
                </View>
                <View style={styles.textWrap}>
                  <View style={styles.dataTextWrap}>
                    <Text style={styles.dataText}>门店地址</Text>
                  </View>
                  <Text style={styles.dataText}>{data.paySuccessVO.address}</Text>
                </View>
                <View style={styles.textWrap}>
                  <View style={styles.dataTextWrap}>
                    <Text style={styles.dataText}>营业时间</Text>
                  </View>
                  <Text style={styles.dataText}>{data.paySuccessVO.businessHours}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
        {((data.status === 1 && !isStore) || (data.status === 2 && isStore)) && (
          <TouchableOpacity
            style={styles.btnArea}
            // onPress={this.isReceiving}
            onPress={() => this.handleGoods(data.status)}
            activeOpacity={Layout.activeOpacity}
          >
            <BoxShadow setting={shadowValue} />
            <View style={[styles.btnWrap, isIphoneX() && styles.paddingValue]}>
              <View style={styles.btnBox}>
                <Text style={styles.btnText}>{data.status === 1 ? '发货' : '确认收货'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  orderTelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderTel: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  orderTelText: {
    fontFamily: 'PingFangSC-Regular',
    color: '#999',
    fontSize: 12,
  },
  orderTip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTipText: {
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
  },
  orderTipIcon: {
    marginRight: 6,
    width: 4,
    height: 4,
    backgroundColor: '#D8D8D8',
    borderRadius: 8,
  },
  addressWrap: {
    flexDirection: 'row',
    flex: 1,
  },
  addressLabel: {
    height: 18,
    backgroundColor: '#FC4277',
    borderRadius: 2,
    paddingLeft: 4,
    paddingRight: 4,
  },
  personAddress2: {
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  orderHeader: {
    width: '100%',
    height: 64,
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  headerWrap: {
    width: '100%',
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
  },
  headerText: {
    fontFamily: 'PingFangSC-Medium',
    color: '#fff',
    fontSize: 16,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  infoWrap: {
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 8,
  },
  personInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIcon: {
    width: 24,
    height: 24,
    marginRight: 14,
  },
  personName: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  personAddress: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  productInfoWrap: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  productInfoBox: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    marginBottom: 0,
    flexDirection: 'row',
  },
  productImg: {
    width: 90,
    height: 90,
    borderRadius: 4,
    marginRight: 8,
  },
  productInfo: {
    alignContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  productTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333',
    width: '100%',
  },
  productPrice: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    width: '100%',
  },
  priceWrap: {
    paddingBottom: 0,
  },
  priceBox: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
  },
  priceTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
  },
  priceText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  textWrap: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 8,
  },
  dataTextWrap: {
    width: 68,
    marginRight: 4,
  },
  dataText: {
    fontFamily: 'PingFangSC-Regular',
    color: '#999',
    fontSize: 12,
    flex: 1,
  },
  btnWrap: {
    width: '100%',
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: '#fff',
  },
  paddingValue: {
    paddingBottom: 50,
  },
  btnBox: {
    borderWidth: 1,
    borderColor: '#FC4277',
    borderRadius: 4,
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#FC4277',
  },
  btnArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
  },
  orderWrap: {
    backgroundColor: '#fff',
    marginBottom: 60,
  },
  bottomMargin: {
    marginBottom: 110,
  },
  orderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EFEFEF',
  },
  titleIcon: {
    width: 15,
    height: 15,
  },
  titleText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333',
    marginLeft: 6,
  },
  orderInfoWrap: {
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
  },
});
