import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar } from 'react-native';
import { paySuccess } from '../../services/api';
import Layout from '../../constants/Layout';

export default class PayResult extends Component {
  static navigationOptions = {
    title: '确认订单',
  };

  state = {
    datas: {},
  };

  componentDidMount() {
    this.getResult();
  }

  async getResult() {
    const params = this.props.navigation.state.params.orderId;
    const res = await paySuccess(params);
    this.setState({ datas: res });
  }

  jumpAbout = async () => {
    const res = await storage.load({
      key: 'shopId',
    });
    console.log('店铺id', res);
    if (res) {
      this.props.navigation.navigate('Shop', { shopId: res });
    }
  };

  // 跳转到门店订单
  checkGoods = () => {
    const { id } = this.props.navigation.state.params;
    this.props.navigation.navigate('StoreOrder', { id });
  };

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const { datas } = this.state;
    const { distribution } = this.props.navigation.state.params;
    console.log('distribution', this.props.navigation);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.topWap}>
          <View style={styles.payWap}>
            <Image style={styles.payImg} source={require('../../../assets/detail/pay.png')} />
            <Text style={styles.fontSize}>支付成功</Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnWap} activeOpacity={0.2} focusedOpacity={0.5} onPress={() => this.jumpAbout()}>
              <Text style={styles.button1}>返回门店</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnWap, styles.btnwap1]} activeOpacity={0.2} focusedOpacity={0.5} onPress={() => this.checkGoods()}>
              <Text style={styles.button2}>查看订单</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomWap}>
          <View style={styles.tipWap}>
            <Image style={styles.leftImg} source={require('../../../assets/detail/payLeft.png')} />
            <Text style={styles.fontText}>{datas.copywriting}</Text>
            <Image style={styles.leftImg} source={require('../../../assets/detail/payRight.png')} />
          </View>
          <View style={styles.rowWap}>
            <Text style={styles.rowText}>店长：</Text>
            <Text style={[styles.rowText, styles.rowText2]}>{datas.idName}</Text>
          </View>
          <View style={styles.rowWap}>
            <Text style={styles.rowText}>电话：</Text>
            <Text style={[styles.rowText, styles.rowText2]}>{datas.mobile}</Text>
          </View>
          <View style={styles.rowWap}>
            <Text style={styles.rowText}>{distribution === 0 ? '自提地址：' : '配送地址：'}</Text>
            <Text style={[styles.rowText, styles.rowText2]}>{datas.address}</Text>
          </View>
          <View style={styles.rowWap}>
            <Text style={styles.rowText}>营业时间：</Text>
            <Text style={[styles.rowText, styles.rowText2]}>{datas.businessHours}</Text>
          </View>
        </View>
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
  topWap: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  payWap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  fontSize: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Medium',
    color: '#333',
  },
  payImg: {
    width: 60,
    height: 60,
    marginTop: 49,
    marginBottom: 14,
  },
  buttons: {
    width: '100%',
    paddingLeft: 96,
    paddingRight: 96,
    marginRight: 96,
    marginTop: 32,
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipWap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    marginBottom: 23,
  },
  leftImg: {
    width: 10,
    height: 10,
    marginTop: 3,
  },
  btnWap: {
    width: 80,
    height: 30,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnwap1: {
    borderColor: '#FC4277',
  },
  btnwap2: {
    borderColor: '#FC4277',
  },

  button1: {
    color: '#666',
    textAlign: 'center',
  },
  button2: {
    textAlign: 'center',
    color: '#FC4277',
  },
  bottomWap: {
    backgroundColor: '#fff',
    flex: 1,
  },
  fontText: {
    fontSize: 16,
    color: '#333',
    height: 56,
    lineHeight: 56,
    marginLeft: 12,
    marginRight: 12,
    fontFamily: 'PingFangSC-Medium',
    textAlign: 'center',
  },
  rowWap: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
  },
  rowText: {
    width: Layout.scaleSize(90),
    textAlign: 'right',
    fontSize: 14,
    color: '#666',
    fontFamily: 'PingFangSC-Regular',
    marginBottom: 20,
  },
  rowText2: {
    color: '#333',
    textAlign: 'left',
    width: 264,
  },
  rowH: {
    marginTop: -4,
  },
});
