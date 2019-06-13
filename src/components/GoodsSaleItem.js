import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import VipIcon from './VipIcon';

export default class GoodsSaleItem extends React.Component {
  clickList(item) {
    const { clickListItem, canClick } = this.props;
    if (canClick) {
      clickListItem(item);
    }
  }

  render() {
    const { item } = this.props;
    return (
      <TouchableOpacity style={styles.listWrap} activeOpacity={0.85} onPress={() => this.clickList(item)}>
        <Image style={styles.friendAvatar} source={{ uri: item.headimgurl }} />
        <View style={styles.saleList}>
          <View style={styles.friendInfo}>
            <Text style={styles.nickname} numberOfLines={1}>
              {item.nickName}
            </Text>
            <VipIcon roleId={item.roleId} levelName={item.levelName} />
            {item.tag && (
              <View style={[styles.labelWrap1, item.type === 2 && styles.labelWrap2]}>
                <Text style={[styles.typeLabel1, item.type === 2 && styles.typeLabel2]}>{item.tag}</Text>
              </View>
            )}
          </View>
          <Text style={styles.loginTime}>
            最近登录时间：
            {item.lastLoginDate}
          </Text>
          <View style={styles.dataWrap}>
            <Text style={styles.dataNum}>浏览：</Text>
            <Text style={styles.dataNumText}>{item.browserNum}</Text>
          </View>
          <View style={styles.dataWrap}>
            <Text style={styles.dataNum}>成交：</Text>
            <Text style={styles.dataNumText}>{item.buyNum}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  listWrap: {
    paddingLeft: 12,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#EFEFEF',
    flexDirection: 'row',
  },
  saleList: {
    flex: 1,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    maxWidth: '50%',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 15,
    color: '#333',
    marginRight: 4,
  },
  loginTime: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginBottom: 4,
  },
  dataWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dataNum: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
  },
  dataNumText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 12,
    color: '#333',
  },
  labelWrap1: {
    height: 16,
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: 'rgba(252, 66, 119, 0.1)',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  labelWrap2: {
    backgroundColor: 'rgba(247, 49, 188, 0.1)',
  },
  typeLabel1: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 11,
    color: '#FC4277',
  },
  typeLabel2: {
    color: '#F731BC',
  },
});
