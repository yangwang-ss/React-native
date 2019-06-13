import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, Clipboard, TouchableOpacity, StatusBar, TextInput, Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import { NavigationEvents } from 'react-navigation';
import Layout from '../../constants/Layout';
import { orderConfirmData, vipOrderConfirm, getWechatCode } from '../../services/api';

export default class OrderConfirm extends Component {
  static navigationOptions = {
    title: '确认订单',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  };

  state = {
    isIphoneX: false,
    paySuccess: false,
    isSelected: true,
    canDo: true,
    pid: '',
    orderId: '',
    copyText: '',
    orderPrdInfo: {},
    addressInfo: {
      addressId: '',
      userName: '',
      phoneNum: '',
      province: { name: '' },
      city: { name: '' },
      area: { name: '' },
      addressDetaill: '',
    },
    inputValue: '',
    textWrap: false,
  };

  /**
   * 列表渲染
   */

  /**
   * 事件绑定
   */
  onPressAddress = () => {
    const { addressInfo } = this.state;
    const { navigation } = this.props;
    console.log('onPressAddress===', addressInfo);
    navigation.navigate('AddAddress', {
      addressInfo,
      callback: (addressInfo) => {
        console.log('callback', addressInfo);
        this.setState({ addressInfo });
      },
    });
  };

  onPressPayMethod = () => {
    console.log('onPressPayMethod===');
    // this.setState({
    //   isSelected: !this.state.isSelected
    // })
  };

  onPressCopyText = async () => {
    Clipboard.setString(this.state.copyText);
    const str = await Clipboard.getString();
    if (str) {
      storage.save({
        key: 'searchText',
        data: { searchText: str },
      });
      Toast.show('复制成功');
    }
    console.log('onPressCopyText===', str);
  };

  onPressBuy = async () => {
    const { addressInfo } = this.state;
    console.log('onPressBuy===', addressInfo);
    if (!addressInfo.userName) {
      Toast.show('请填写收货人！');
      return false;
    }
    if (!addressInfo.phoneNum) {
      Toast.show('请填写手机号码！');
      return false;
    }
    if (!addressInfo.province.name || !addressInfo.city.name) {
      Toast.show('请选择收货地区！');
      return false;
    }
    if (!addressInfo.addressDetaill) {
      Toast.show('请填写详细地址！');
      return false;
    }
    const { isInstalled } = (await storage
      .load({
        key: 'WXStatus',
      })
      .catch(e => e)) || {};
    if (!isInstalled) {
      Toast.show('安装微信后，再发起支付！');
      return;
    }
    this.vipOrderConfirm();
  };

  onPressBackHome = () => {
    this.props.navigation.navigate('Home');
  };

  onPressCheckOrder = () => {
    const { orderId } = this.state;
    this.props.navigation.navigate('VipOrderDetail', { orderId });
  };

  getInputVal = (text) => {
    this.setState({
      inputValue: text,
      textWrap: text.length > 20,
    });
  };

  /**
   * 接口请求
   */
  async orderConfirmData() {
    const { pid } = this.state;
    const res = await orderConfirmData(pid);
    console.log('orderConfirmData===', res);
    if (res) {
      this.setState({
        orderPrdInfo: res,
      });
    }
  }

  async getWechatCode() {
    const { pid } = this.state;
    const res = await getWechatCode(pid);
    console.log('getWechatCode===', res);
    if (res) {
      this.setState({
        copyText: res,
      });
    }
  }

  async vipOrderConfirm() {
    const {
      addressInfo, orderPrdInfo, canDo, inputValue,
    } = this.state;
    if (!canDo) return;
    this.setState({ canDo: false });
    const {
      addressId, userName, phoneNum, province, city, area, addressDetaill,
    } = addressInfo;
    const { provinceId, cityId, areaId } = addressId;
    const params = {
      consignee: userName || '',
      areaId: provinceId || '',
      areaId2: cityId || '',
      areaId3: areaId || '',
      mobile: phoneNum || '',
      id: orderPrdInfo.id,
      areaName: `${province.name}${city.name}${area.name}`,
      address: addressDetaill || '',
      note: inputValue || '',
    };
    console.log('vipOrderConfirm===params', params);
    const res = await vipOrderConfirm(params);
    console.log('vipOrderConfirm===', res);
    if (res) {
      const {
        sign, prepayId, partnerId, packageValue, nonceStr, timeStamp, orderId,
      } = res;
      const payParams = {
        partnerId,
        prepayId,
        nonceStr,
        timeStamp,
        package: packageValue,
        sign,
      };
      console.log('payParams====', payParams);
      WeChat.pay(payParams)
        .then((res) => {
          console.log('WeChat pay===', res);
          this.setState({ paySuccess: true, orderId, inputValue: '' });
        })
        .catch((err) => {
          console.log('WeChat pay===err', err);
        });
    }
    setTimeout(() => {
      this.setState({ canDo: true });
    }, 3000);
  }

  /**
   * 初始化
   */
  init = () => {
    const isIphoneX = Layout.device.deviceModel.indexOf('iPhone X') > -1;
    const pid = this.props.navigation.getParam('pid', '');
    console.log('pid===', pid, isIphoneX);
    this.setState({ pid, isIphoneX }, () => {
      this.orderConfirmData();
      this.getWechatCode();
    });
  };

  componentDidMount() {
    // this.init()
  }

  render() {
    const {
      paySuccess, addressInfo, orderPrdInfo, isSelected, isIphoneX, copyText,
    } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        {paySuccess ? (
          <View style={styles.paySuccessWrap}>
            <View style={styles.paySuccessTop}>
              <Image style={styles.paySuccessIcon} source={require('../../../assets/vip/icon-success.png')} />
              <Text style={styles.paySuccessTitle}>支付成功</Text>
              <View style={styles.btnJumpWrap}>
                <TouchableOpacity style={styles.btnBackHome} activeOpacity={Layout.activeOpacity} onPress={this.onPressBackHome}>
                  <Text style={styles.btnBackHomeText}>返回首页</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnCheckOrder} activeOpacity={Layout.activeOpacity} onPress={this.onPressCheckOrder}>
                  <Text style={styles.btnCheckOrderText}>查看订单</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.addWechat}>
              <View style={styles.addWechatTitleWrap}>
                <Image style={styles.titleIconLeft} source={require('../../../assets/vip/line-left.png')} />
                <Text style={styles.addWechatTitle}>添加我的专属客服</Text>
                <Image style={styles.titleIconRight} source={require('../../../assets/vip/line-right.png')} />
              </View>
              <Text style={styles.addWechatText1}>免费获得更多专享活动</Text>
              <Image style={styles.iconWechat} source={require('../../../assets/icon-weChat.png')} />
              <Text style={styles.addWechatText2}>微信号</Text>
              <Text style={styles.addWechatText3}>{copyText}</Text>
              <TouchableOpacity style={styles.btnCopyWechat} activeOpacity={Layout.activeOpacity} onPress={this.onPressCopyText}>
                <Text style={styles.btnCopyWechatText}>复制微信号</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.addWechatText4}>打开微信-粘贴微信号-添加好友</Text>
          </View>
        ) : (
          <View style={styles.orderInfo}>
            <TouchableOpacity style={styles.addressWrap} activeOpacity={Layout.activeOpacity} onPress={this.onPressAddress}>
              {addressInfo.userName ? (
                <View style={styles.hasAddressWrap}>
                  <Image style={styles.hasAddressIcon} source={require('../../../assets/vip/icon-address.png')} />
                  <View style={styles.hasAddressContent}>
                    <Text style={styles.hasAddressTitle}>
                      {addressInfo.userName}
                      {' '}
                      {addressInfo.phoneNum}
                    </Text>
                    <Text style={styles.hasAddressText}>
                      收货地址：
                      {addressInfo.province.name}
                      {addressInfo.city.name}
                      {this.state.addressInfo.area.name}
                      {this.state.addressInfo.addressDetaill}
                    </Text>
                  </View>
                  <Image style={styles.iconArrow} source={require('../../../assets/vip/icon-arrow.png')} />
                </View>
              ) : (
                <View style={styles.addAddress}>
                  <Image style={styles.addAddressIcon} source={require('../../../assets/vip/icon-add.png')} />
                  <Text style={styles.addAddressText}>添加地址</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.orderPrdWrap}>
              <View style={styles.prdContent}>
                <Image style={styles.prdImg} source={{ uri: orderPrdInfo.productImg }} />
                <View style={styles.prdInfo}>
                  <Text style={styles.prdTitle} numberOfLines={2}>
                    {orderPrdInfo.productName}
                  </Text>
                  <Text style={styles.prdDefaultPrice}>
￥
                    {orderPrdInfo.salePrice}
                  </Text>
                </View>
              </View>
              <View style={styles.prdPriceWrap}>
                <Text style={styles.prdPriceTitle}>商品总价</Text>
                <Text style={styles.prdPrice}>
                  ￥
                  <Text style={{ fontSize: 18 }}>{orderPrdInfo.salePrice}</Text>
                </Text>
              </View>
            </View>

            <View style={styles.remark}>
              <Text style={styles.remarkLabel}>备注：</Text>
              <TextInput
                style={styles.markInput}
                placeholder="买家留言"
                onChangeText={text => this.getInputVal(text)}
                value={this.state.inputValue}
                underlineColorAndroid="transparent"
                // multiline={this.state.textWrap}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                maxLength={100}
              />
            </View>
            <Text style={styles.payTitle}>支付方式</Text>
            <View style={styles.payWrap}>
              <View style={styles.payIconWrap}>
                <Image style={styles.payIcon} source={require('../../../assets/icon-weChat.png')} />
                <Text style={styles.payIconTitle}>微信支付</Text>
              </View>
              <TouchableOpacity style={styles.payRadioWrap} activeOpacity={Layout.activeOpacity} onPress={this.onPressPayMethod}>
                {isSelected && <Image style={styles.payRadioIcon} source={require('../../../assets/vip/choose-selected.png')} />}
              </TouchableOpacity>
            </View>
            <View style={[styles.fixBtnWrap, isIphoneX ? { paddingBottom: 30 } : '']}>
              <View style={styles.fixPriceWrap}>
                <View style={styles.fixTextWrap}>
                  <Text style={styles.fixText}>需付款：</Text>
                  <Text style={styles.fixTextSymbol}>￥</Text>
                  <Text style={styles.fixPrice}>{orderPrdInfo.salePrice}</Text>
                </View>
                <Text style={styles.fixTextHint}>(赠送一年期会员)</Text>
              </View>
              <TouchableOpacity style={styles.fixBtnBuy} activeOpacity={Layout.activeOpacity} onPress={this.onPressBuy}>
                <LinearGradient style={styles.fixBtnBuy} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} colors={['#D29F51', '#E2BE84']}>
                  <Text style={styles.fixBuyText}>提交订单</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <NavigationEvents onDidFocus={() => this.init()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
    overflow: 'hidden',
  },
  orderInfo: {
    flex: 1,
  },
  addressWrap: {
    width: Layout.window.width,
    height: 66,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  addAddress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAddressIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  addAddressText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#EA4457',
  },
  hasAddressWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  hasAddressIcon: {
    width: 26,
    height: 26,
  },
  hasAddressContent: {
    marginLeft: 14,
    marginRight: 18,
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
  iconArrow: {
    width: 6.6,
    height: 10.3,
  },
  orderPrdWrap: {
    width: Layout.window.width,
    height: 157,
    backgroundColor: '#fff',
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
    marginLeft: 16,
    marginRight: 16,
    height: 43,
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
    fontFamily: 'DINA',
    fontSize: 12,
    color: '#EA4457',
  },
  payTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 16,
  },
  payWrap: {
    height: 60,
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payIconWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  payIconTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
  },
  payRadioWrap: {
    position: 'relative',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  payRadioIcon: {
    position: 'absolute',
    top: -1,
    left: -1,
    width: 24,
    height: 24,
  },
  fixBtnWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 10,
    width: Layout.window.width,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fixPriceWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 24,
  },
  fixTextWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  fixText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333',
  },
  fixTextSymbol: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#EA4457',
  },
  fixPrice: {
    fontFamily: 'DINA',
    fontSize: 18,
    color: '#EA4457',
  },
  fixTextHint: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#999',
  },
  fixBtnBuy: {
    width: 150,
    height: 48,
    textAlign: 'center',
  },
  fixBuyText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 18,
    lineHeight: 48,
    color: '#885401',
    textAlign: 'center',
  },
  paySuccessWrap: {
    flex: 1,
    backgroundColor: '#fff',
  },
  paySuccessTop: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 8,
    borderBottomColor: '#f4f4f4',
  },
  paySuccessIcon: {
    width: 60,
    height: 60,
    marginTop: 50,
    marginBottom: 14,
  },
  paySuccessTitle: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 18,
    color: '#EA4457',
  },
  addWechat: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addWechatTitleWrap: {
    marginTop: 24,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIconLeft: {
    width: 60,
    height: 15,
    resizeMode: 'contain',
  },
  titleIconRight: {
    width: 60,
    height: 15,
    resizeMode: 'contain',
  },
  addWechatTitle: {
    marginLeft: 12,
    marginRight: 12,
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333',
  },
  addWechatText1: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
  },
  addWechatText2: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addWechatText3: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#151515',
  },
  addWechatText4: {
    marginTop: 40,
    width: Layout.window.width,
    textAlign: 'center',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  iconWechat: {
    marginTop: 24,
    marginBottom: 8,
    width: 48,
    height: 48,
  },
  btnCopyWechat: {
    marginTop: 20,
    width: 200,
    height: 48,
    backgroundColor: '#EA4457',
    borderRadius: 24,
  },
  btnCopyWechatText: {
    textAlign: 'center',
    lineHeight: 48,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#fff',
  },
  btnJumpWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  btnBackHome: {
    width: 80,
    height: 30,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
  },
  btnBackHomeText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
  },
  btnCheckOrder: {
    width: 80,
    height: 30,
    borderWidth: 0.5,
    borderColor: '#EA4457',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCheckOrderText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#EA4457',
  },
  remark: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingRight: 16,
    // paddingTop: 6,
    // paddingBottom: 6
  },
  remarkLabel: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  markInput: {
    width: '86%',
    height: 22,
    padding: 0,
    color: '#999',
    fontSize: 14,
    lineHeight: 22,
  },
});
