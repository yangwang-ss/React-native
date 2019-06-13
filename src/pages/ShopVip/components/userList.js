import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import VipIcon from '@components/VipIcon';

export default class UserLogged extends Component {
  render() {
    const { listItem } = this.props;
    return (
      <View style={[styles.rowWap, styles.rowPd]}>
        <View>
          <Image style={styles.leftImg} source={{ uri: listItem.headImg }} />
        </View>
        <View style={styles.bottomBorder}>
          <View style={[styles.rowWap, styles.rowWap2]}>
            <Text style={styles.nameText}>{listItem.nickname}</Text>
            <VipIcon roleId={listItem.roleId} levelName={listItem.levelName} />
            {/* <View style={styles.userLabel}>
                <Text style={styles.userLabelText}>复购用户</Text>
              </View> */}
          </View>
          <View style={styles.rowWap}>
            <Text style={styles.rowText}>最近来访时间：{listItem.latelyTime}</Text>
          </View>
          <View style={styles.rowWap}>
            <Text style={[styles.rowText, styles.colorS]}>访问商品：{listItem.todayGoodsBrowseNum}</Text>
          </View>
          <View style={styles.rowWap}>
            <Text style={[styles.rowText, styles.colorS]}>分享次数：{listItem.todayGoodsShareNum}</Text>
          </View>
          <View style={styles.rowWap}>
            <Text style={[styles.rowText, styles.colorS]}>订单笔数：{listItem.todayOrderNum}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowPd: {
    paddingTop: 12.5,
    paddingRight: 15,
  },
  rowWap: {
    flexDirection: 'row',
  },
  rowWap2: {
    alignItems: 'center',
  },
  leftImg: {
    width: 44,
    height: 44,
    marginRight: 12,
    borderRadius: 22,
  },
  rowText: {
    color: '#999',
    lineHeight: 24,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
  },
  bottomBorder: {
    width: 288,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#C4C4C4',
  },
  userLabel: {
    height: 20,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: 'rgba(250,75,145, 0.1)',
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  userLabelText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#EB468E',
    lineHeight: 20,
  },
  nameText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'PingFangSC-Medium',
    marginRight: 12.7,
  },
  colorS: {
    color: '#151515',
  },
});
