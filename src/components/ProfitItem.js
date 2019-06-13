import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class ProfitItem extends Component {
  renderIcon = type => {
    switch (type) {
      case '天猫':
        return require('../../assets/icon-tm.png');
        break;
      case '淘宝':
        return require('../../assets/icon-tb2.png');
        break;
      case '支付宝':
        return require('@assets/ConfirmOrder/alipay.png');
        break;
      default:
        return require('../../assets/order/icon-order-shop.png');
        break;
    }
  };

  render() {
    const { item, type, isLine } = this.props;
    return (
      <View style={styles.itemContainer}>
        <View style={[styles.itemList, !isLine && styles.itemLine]}>
          {type !== 1 && (
            <View style={styles.itemOrder}>
              <Image style={[styles.orderIcon, item.orderType === '天猫' ? styles.orderIconTm : styles.orderIconTb]} source={item.orderType && this.renderIcon(item.orderType)} />
              <Text style={styles.orderNo}>
                订单：
                {item.orderId}
              </Text>
            </View>
          )}
          {item.type === 1 ? (
            <View style={styles.itemOrder}>
              <Image style={styles.orderIcon} source={require('@assets/icon-tb2.png')} />
              <Text style={styles.orderNo}>淘宝拉新奖励</Text>
            </View>
          ) : null}
          {item.type === 2 ? (
            <View style={styles.itemOrder}>
              <Image style={styles.orderIcon} source={require('@assets/icon-tb2.png')} />
              <Text style={styles.orderNo}>淘宝绑卡奖励</Text>
            </View>
          ) : null}
          {type === 1 && item.type === 100 ? (
            <View style={styles.itemOrder}>
              <Image style={styles.orderIcon} source={require('@assets/icon-first-buy.png')} />
              <Text style={styles.orderNo}>好友首购奖励</Text>
            </View>
          ) : null}
          <View style={styles.itemInfo}>
            <View style={styles.avatarBox}>
              <Image style={styles.avatarImg} source={{ uri: item.headImg }} />
              <View style={styles.nameBox}>
                <Text style={styles.manageName} numberOfLines={1}>
                  {item.nickName}
                </Text>
                <Text style={styles.manageTip}>{type === 1 ? item.today : item.createTime}</Text>
              </View>
            </View>
            <View style={styles.moneyBox}>
              <Text style={styles.moneyType}>预计收益</Text>
              <Text style={styles.money}>{item.income}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    backgroundColor: '#fff',
  },
  itemLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemList: {
    padding: 12,
    paddingLeft: 16,
    paddingRight: 16,
  },
  itemOrder: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
    alignItems: 'center',
  },
  orderIconTb: {
    height: 14,
  },
  orderIconTm: {
    height: 11,
  },
  orderIconZfb: {
    width: 12,
    height: 12,
  },
  orderNo: {
    color: '#333',
    fontSize: 12,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatarBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  nameBox: {
    width: '70%',
  },
  manageName: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'PingFangSC-Medium',
  },
  manageTip: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'PingFangSC-Regular',
  },
  moneyType: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'PingFangSC-Regular',
    marginBottom: 4,
  },
  money: {
    fontSize: 18,
    color: '#FC4277',
    fontFamily: 'DINA',
    textAlign: 'right',
  },
});
