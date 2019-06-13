import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Layout from '../../../constants/Layout';
import { storeReportFromTime } from '@api';

const styles = StyleSheet.create({
  containerWrap: {
    flex: 1,
    paddingTop: 56,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'column',
    backgroundColor: '#f4f4f4',
  },
  item1: {
    position: 'absolute',
    width: Layout.window.width,
    backgroundColor: '#FFF2F5',
    height: 46,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
  },
  item1Lable: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  item1Val: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#FC4277',
  },
  headerDataWrap: {
    height: 74,
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerDataText1: {
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    marginBottom: 8,
  },
  headerDataText2: {
    color: '#fff',
    fontFamily: 'DINA',
    fontSize: 22,
  },
  headerDataItem: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  item2: {
    flexDirection: 'column',
    height: 130,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  item2Sub: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item2Sub_border: {
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderLeftColor: '#EFEFEF',
    borderRightColor: '#EFEFEF',
  },
  item2Sub_item: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  item2Sub_item_text1: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  item2Sub_item_text2: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
  },
  item1_wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default class Index extends React.Component {
  static navigationOptions = () => ({
    title: '昨天',
  });

  state = {
    result: {},
  };

  componentDidMount() {
    storeReportFromTime(2).then(res => {
      this.setState({
        result: res,
      });
    });
  }

  render() {
    const {
      result: {
        buyRatio,
        todayTbCommission,
        todayTbRewardOrderNUmber,
        todayAmount,
        payNumber,
        payOrderNumber,
        customerUnitPrice,
        visitNumber,
        newMembers,
        newMemberPayOrderNUmber,
        newMemberPayNUmber,
        newCustomerUnitPrice,
        newMemberCompleteRatio,
        newMemberBuyRatio,
      },
    } = this.state;
    const { isReview } = global;
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.containerWrap}>
          <View style={styles.item1}>
            <View style={styles.item1_wrap}>
              <Text style={{ color: '#666', fontSize: 12 }}>购买转化率：</Text>
              <Text
                style={{
                  fontFamily: 'PingFangSC-Medium',
                  color: '#FC4277',
                  fontSize: 16,
                }}
              >
                {buyRatio}
              </Text>
            </View>
            <View style={styles.item1_wrap}>
              <Text style={{ color: '#666', fontSize: 12 }}>新客户购买转化率：</Text>
              <Text
                style={{
                  fontFamily: 'PingFangSC-Medium',
                  color: '#FC4277',
                  fontSize: 16,
                }}
              >
                {newMemberBuyRatio}
              </Text>
            </View>
          </View>
          <View style={styles.headerDataWrap}>
            <View style={styles.headerDataItem}>
              <Text style={styles.headerDataText1}>昨日淘宝佣金(元)</Text>
              <Text style={[styles.headerDataText2, { color: '#FC4277' }]}>{todayTbCommission}</Text>
            </View>
            <View style={styles.headerDataItem}>
              <Text style={styles.headerDataText1}>订单数</Text>
              <Text style={[styles.headerDataText2, { color: '#333' }]}>{todayTbRewardOrderNUmber}</Text>
            </View>
          </View>
          <View style={styles.item2}>
            <View
              style={[
                styles.headerDataWrap,
                {
                  marginBottom: 0,
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#EFEFEF',
                },
              ]}
            >
              <View style={styles.headerDataItem}>
                <Text style={styles.headerDataText1}>昨日付款金额(元)</Text>
                <Text style={[styles.headerDataText2, { color: '#FC4277' }]}>{todayAmount}</Text>
              </View>
              <View style={styles.headerDataItem}>
                <Text style={styles.headerDataText1}>付款订单笔数</Text>
                <Text style={[styles.headerDataText2, { color: '#333' }]}>{payOrderNumber}</Text>
              </View>
            </View>
            <View style={styles.item2Sub}>
              <View style={styles.item2Sub_item}>
                <Text style={styles.item2Sub_item_text1}>付款人数</Text>
                <Text style={styles.item2Sub_item_text2}>{payNumber}</Text>
              </View>
              <View style={[styles.item2Sub_item, styles.item2Sub_border]}>
                <Text style={styles.item2Sub_item_text1}>客单价(元/人)</Text>
                <Text style={styles.item2Sub_item_text2}>{customerUnitPrice}</Text>
              </View>
              <View style={styles.item2Sub_item}>
                <Text style={styles.item2Sub_item_text1}>访客数</Text>
                <Text style={styles.item2Sub_item_text2}>{visitNumber}</Text>
              </View>
            </View>
          </View>
          <View />
          <View style={styles.item2}>
            <View
              style={[
                styles.headerDataWrap,
                {
                  marginBottom: 0,
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#EFEFEF',
                },
              ]}
            >
              <View style={styles.headerDataItem}>
                <Text style={styles.headerDataText1}>昨日新增客户数</Text>
                <Text style={[styles.headerDataText2, { color: '#FC4277' }]}>{newMembers}</Text>
              </View>
              <View style={styles.headerDataItem}>
                <Text style={styles.headerDataText1}>新客付款订单笔数</Text>
                <Text style={[styles.headerDataText2, { color: '#333' }]}>{newMemberPayOrderNUmber}</Text>
              </View>
            </View>
            <View style={styles.item2Sub}>
              <View style={styles.item2Sub_item}>
                <Text style={styles.item2Sub_item_text1}>付款人数</Text>
                <Text style={styles.item2Sub_item_text2}>{newMemberPayNUmber}</Text>
              </View>
              <View style={[styles.item2Sub_item, styles.item2Sub_border]}>
                <Text style={styles.item2Sub_item_text1}>客单价(元/人)</Text>
                <Text style={styles.item2Sub_item_text2}>{newCustomerUnitPrice}</Text>
              </View>
              <View style={styles.item2Sub_item}>
                <Text style={styles.item2Sub_item_text1}>成交数占比</Text>
                <Text style={styles.item2Sub_item_text2}>{newMemberCompleteRatio}</Text>
              </View>
            </View>
          </View>
          <View />
        </View>
      </ScrollView>
    );
  }
}
