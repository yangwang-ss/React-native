import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Layout from '../constants/Layout';

export default class OrderItem extends React.Component {
  jumpDetail = (id) => {
    const { jumpDetail } = this.props;
    jumpDetail(id);
  };

  handleGoods = (status, id) => {
    if (status === 1) {
      this.deliverGoods(id);
    } else {
      this.isReceiving(id)
    }
  };

  deliverGoods = (id) => {
    const { deliverGoods } = this.props;
    deliverGoods(id);
  };

  isReceiving = (id) => {
    const { isReceiving } = this.props;
    isReceiving(id);
  };

  render() {
    const { info, isStore } = this.props;
    const { isReview } = global;
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.snNum}>订单：{info.sn}</Text>
          <Text
            style={[styles.statusText, info.status === 3 && styles.statusTextNormal]}
          >
            {info.statusStr}
          </Text>
        </View>
        <TouchableOpacity style={styles.itemInfoWrap} activeOpacity={Layout.activeOpacity} onPress={() => this.jumpDetail(info.id)}>
          <Image style={styles.productImg} source={{uri: info.thumbnail}} />
          <View style={styles.itemInfo}>
            <View style={styles.titleWrap}>
              <View style={styles.titleBox}>
                <Text style={styles.itemTitle}>{info.productName}</Text>
                {
                  !isReview && isStore && info.userIncome && (
                    <View style={styles.rewardWrap}>
                      <Text style={styles.rewardPrice}>{info.userIncome}</Text>
                    </View>
                  )
                }
              </View>
              <Text style={styles.proPrice}>￥{info.salePrice || '0.00'}</Text>
            </View>
            <Text style={styles.totalPrice}>共1件商品 合计：￥{info.amountPaid || '0.00'}</Text>
          </View>
        </TouchableOpacity>
        {
          ((info.status === 1 && !isStore) || (info.status === 2 && isStore)) && (
            <View style={styles.itemBtnWrap}>
              <TouchableOpacity
                style={[styles.btnWrap, info.status === 1 && styles.btnPadding]}
                onPress={() => this.handleGoods(info.status, info.id)}
              >
                <Text style={styles.btnText}>{info.status === 1 ? '发货' : '确认收货'}</Text>
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 14,
    marginBottom: 12,
  },
  snNum: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
  },
  statusText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#FC4277',
  },
  statusTextNormal: {
    color: '#333',
  },
  itemInfoWrap: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 0,
  },
  productImg: {
    borderRadius: 4,
    width: 90,
    height: 90,
    marginRight: 8,
  },
  itemInfo: {
    flex: 1,
  },
  titleWrap: {
    flexDirection: 'row',
    alignContent: 'space-between',
    flexWrap: 'wrap',
    height: 90,
    marginBottom: 12,
  },
  titleBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  proPrice: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    width: '100%',
  },
  itemTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333',
    width: '100%',
  },
  rewardWrap: {
    marginTop: 4,
    backgroundColor: 'rgba(252, 66, 119, 0.10)',
    borderRadius: 4,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 2,
  },
  rewardPrice: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FC4277',
  },
  totalPrice: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333',
    width: '100%',
    textAlign: 'right',
  },
  itemBtnWrap: {
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopColor: '#EFEFEF',
    borderTopWidth: 0.5,
  },
  btnWrap: {
    borderWidth: 1,
    borderColor: '#FC4277',
    borderRadius: 24,
    height: 30,
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  btnPadding: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  btnText: {
    color: '#FC4277',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
  },
});
