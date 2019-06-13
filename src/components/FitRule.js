import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class FitRule extends React.Component {
  state = {
    isStore: false,
  };

  async componentDidMount() {
    const { isStore } = await storage
      .load({
        key: 'userInfo',
      })
      .catch(e => {});
    this.setState({
      isStore,
    });
  }

  closeRule = () => {
    const { closeRule } = this.props;
    closeRule();
  };

  render() {
    return (
      <View style={styles.toastWrap}>
        <View style={styles.toastContentWrap}>
          <View style={styles.toastContent}>
            <Text style={styles.toastTitle}>具体规则</Text>
            <View style={styles.toastWordsWrap}>
              <Text style={styles.toastWords1}>一、返现规则：</Text>
              <Text style={styles.toastWords2}>
                {this.state.isStore ? '1.商品奖励：' : '商品奖励：'}
                <Text style={styles.toastWordsRed}>每月25日结算</Text>
                上月【确认收货】的订单，已结算的金额可以提现到微信。
              </Text>
              <Text style={styles.toastWords2}>举例：您1月在米粒下单，并在1月内确认收货，2月25日这笔订单的返现到账，可以提现。如果1月订单在2月确认收货，则在3月25日到账。</Text>
              {this.state.isStore ? <Text style={styles.toastWords2}>2.门店订单收益：门店发货，用户确认收货后，立即结算到账，已结算金额可直接提现到微信。</Text> : null}
              <Text style={[styles.toastWords1, styles.top22]}>二、失效订单：</Text>
              <Text style={styles.toastWords2}>
                产生退货退款等售后维权就会出现失效订单，
                <Text style={styles.toastWordsRed}>失效订单无返现。</Text>
              </Text>
            </View>
          </View>
          <View style={styles.toastConfirmWrap}>
            <Text style={styles.toastConfirm} onPress={() => this.closeRule()}>
              知道了
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    width: 290,
    minHeight: 350,
    position: 'relative',
    paddingTop: 20,
    paddingBottom: 58,
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
    marginTop: 15,
  },
  toastWords1: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  toastWords2: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#999',
    lineHeight: 20,
  },
  top22: {
    marginTop: 16,
  },
  toastConfirmWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 48,
    borderTopWidth: 0.5,
    borderTopColor: '#DDD',
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
  toastWordsRed: {
    color: '#FC4277',
  },
});
