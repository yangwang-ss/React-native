import React from 'react';
import {
  View, Text, Image, StyleSheet, Clipboard,
} from 'react-native';
import Toast from 'react-native-root-toast';
import Layout from '../constants/Layout';

export default class MyOrderList extends React.Component {
  getCopy(e) {
    Clipboard.setString(e);
    storage.save({
      key: 'searchText',
      data: { searchText: e },
    });
    this.showToast('复制成功');
  }

  showToast(str) {
    Toast.show(str, {
      duration: 2000,
      position: 0,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  }

  render() {
    const { orderItem } = this.props;
    const { item } = orderItem;
    const { isReview } = global;
    return (
      <View style={styles.pWrap}>
        <View style={styles.productBox}>
          <View style={styles.productTop}>
            <View style={styles.productTopLeft}>
              <Text style={styles.productTopText1}>订单: </Text>
              <Text style={styles.productTopText1}>{item.tradeId}</Text>
            </View>
            <Text style={styles.productTopRight} onPress={() => this.getCopy(item.tradeId)}>复制</Text>
          </View>

          <View style={styles.productBottom}>
            <Image style={styles.productBottomLeft} source={{ uri: item.itemPicture }} />
            <View style={styles.productBottomRight}>
              <View style={{ overflow: 'hidden', height: Layout.scaleSize(34) }}>
                <Text style={styles.pName} numberOfLines={3} ellipsizeMode="clip">{item.itemTitle}</Text>
              </View>
              <Text style={styles.orderCreteTime}>
下单时间：
                {item.createTimeStr}
              </Text>
            </View>
          </View>

          <View style={styles.pMoneyWrap}>
            <View style={[styles.pMoneyWrapTextWrap, item.isSettle != 0 && item.isSettle != 2 ? styles.marginRight0 : '']}>
              <Text style={styles.pMoneyWrapText}>
订单金额￥
                {item.alipayTotalPrice}
              </Text>
            </View>
            {
              !isReview && item.isSettle == 0 || item.isSettle == 2 ? (
                <View style={[styles.pMoneyWrapTextWrap, styles.pMoneyWrapTextWrap1]}>
                  <Text style={[styles.pMoneyWrapText, styles.pMoneyWrapText1]}>
                    {item.incomeStatus}
￥
                    {item.userIncome}
                  </Text>
                </View>
              ) : null
            }
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pWrap: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  productBox: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    width: '100%',
    height: 167,
    backgroundColor: '#FFF',
    borderRadius: 4,
    marginBottom: 12,
  },
  productTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 37,
  },
  productTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productTopText1: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
    lineHeight: 37,
  },
  productTopRight: {
    width: 48,
    height: 22,
    borderRadius: 11,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
    borderWidth: 0.5,
    borderColor: '#DDD',
  },
  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productBottomLeft: {
    width: 90,
    height: 90,
    backgroundColor: '#999',
    borderRadius: 4,
    marginRight: 8,
  },
  productBottomRight: {
    flex: 1,
  },
  pName: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: Layout.scaleSize(12),
    color: '#333333',
    lineHeight: Layout.scaleSize(18),
    height: 50,
  },
  orderCreteTime: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333333',
    marginTop: 25,
  },
  pMoneyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  pMoneyWrapTextWrap: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(227,53,171,0.10)',
    marginRight: 8,
  },
  pMoneyWrapTextWrap1: {
    backgroundColor: 'rgba(234,68,87,0.10)',
  },
  pMoneyWrapText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#E335AB',
  },
  marginRight0: {
    marginRight: 0,
  },
  pMoneyWrapText1: {
    color: '#EA4457',
  },
});
