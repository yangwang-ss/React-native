import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import VipIcon from './VipIcon';

export default class ShopVipIndexList extends React.Component {
  clickList(item) {
    const { clickListItem } = this.props;
    clickListItem(item);
  }

  render() {
    const item = this.props.listItem;
    const { hasLine } = this.props;
    return (
      <TouchableOpacity style={styles.listWrap} activeOpacity={0.85} onPress={() => this.clickList(item.userId)}>
        <Image style={styles.friendAvatar} source={{ uri: item.headImg || '' }} />
        <View style={[styles.listTopRight, !hasLine && styles.noBorder]}>
          <View style={styles.friendInfo}>
            <Text style={styles.friendNick} numberOfLines={1}>
              {item.nickname}
            </Text>
            <VipIcon roleId={item.level} levelName={item.levelName} />
            {item.buyType == 1 ? (
              <View style={styles.userLabel}>
                <Text style={styles.userLabelText}>复购用户</Text>
              </View>
            ) : null}
            {item.buyType == 2 ? (
              <View style={[styles.userLabel, styles.userLable2]}>
                <Text style={[styles.userLabelText, styles.userLabelText2]}>首购用户</Text>
              </View>
            ) : null}
            {item.buyType == 3 ? (
              <View style={[styles.userLabel, styles.userLable3]}>
                <Text style={[styles.userLabelText, styles.userLabelText3]}>未购用户</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.friendInTime}>
            邀请时间：
            {item.invitationDate}
          </Text>
          <Text style={styles.friendNum}>
            好友数量:
            <Text style={styles.friendRed}>{item.friends}</Text>
          </Text>
          {/* <Text style={styles.friendNum}>
            带来曝光:
            {item.lastLoginDate}
          </Text> */}
          <Text style={styles.friendNum}>
            最近登录时间:
            {item.latelyTime}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  listWrap: {
    width: '100%',
    height: 111,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderWidth: 0,
    flexDirection: 'row',
    position: 'relative',
    zIndex: -1,
  },
  friendAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#000',
  },
  listTopRight: {
    paddingLeft: 12,
    flex: 1,
    borderBottomColor: '#C4C4C4',
    borderBottomWidth: 0.5,
  },
  noBorder: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  friendNick: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333',
    marginRight: 4,
    maxWidth: '45%',
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
    lineHeight: 24,
  },
  friendRed: {
    color: '#EA4457',
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
  userLable2: {
    backgroundColor: 'rgba(251, 239, 222, 0.1)',
  },
  userLabelText2: {
    color: '#C1A16A',
  },
  userLable3: {
    backgroundColor: 'rgba(180,180,180, 0.1)',
  },
  userLabelText3: {
    color: '#999',
  },
});
