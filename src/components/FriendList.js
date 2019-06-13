import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import VipIcon from './VipIcon';

export default class FriendList extends React.Component {
  clickList(item) {
    const { clickListItem, canClick } = this.props;
    if (canClick) {
      clickListItem(item);
    }
  }

  render() {
    const { item, noBorder } = this.props;
    return (
      <TouchableOpacity style={[styles.listWrap, noBorder && styles.noBorder]} activeOpacity={0.85} onPress={() => this.clickList(item)}>
        <View style={styles.listTop}>
          <Image style={styles.friendAvatar} source={{ uri: item.headimgurl ? item.headimgurl : '' }} />
          <View style={styles.listTopRight}>
            <View style={styles.friendInfo}>
              <Text style={styles.friendNick}>{item.nickname}</Text>
              <VipIcon roleId={item.roleId} levelName={item.levelName} />
              {/*
              <View style={[styles.vipWrap, styles.vipWrap1, item.roleId == 0 ? styles.vipWrap2 : '']}>
              <Image source={item.roleId == 0 ? require('../../assets/personal-normal-vip.png') : require('../../assets/personal-high-vip.png')} style={styles.vipWrapImg}/>
              <Text style={[styles.vipWrapText, item.roleId == 0 ? styles.vipWrapText2 : '']} numberOfLines={1}>{item.roleName}</Text>
              </View>
              */}
            </View>
            <Text style={styles.friendInTime}>
              邀请时间：
              {item.invitationDate}
            </Text>
          </View>
        </View>
        <Text style={styles.friendNum}>
          好友数量:
          <Text style={styles.friendRed}>{item.myFriendCount}</Text>
        </Text>
        <Text style={[styles.friendNum, styles.margin8]}>
          最近登录时间:
          {item.lastLoginDate}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  listWrap: {
    height: 116,
    paddingLeft: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#efefef',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  listTop: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  listTopRight: {
    marginLeft: 12,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendNick: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 15,
    color: '#333',
    marginRight: 4,
  },
  friendLabl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendLabelImg: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  friendInTime: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    marginTop: 7,
  },
  friendNum: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 12,
  },
  friendRed: {
    color: '#EA4457',
  },
  margin8: {
    marginTop: 8,
  },
  vipWrapImg: {
    width: 54,
    height: 17,
    backgroundColor: '#fff',
  },
  vipWrapImgSize1: {
    width: 63,
    height: 19,
  },
  vipWrapImgSize2: {
    width: 67,
    height: 16,
  },
});
