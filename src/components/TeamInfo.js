import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BoxShadow } from 'react-native-shadow';
import Layout from '../constants/Layout';
import VipIcon from './VipIcon';

const shadowOpt = {
  width: Layout.window.width - 160,
  height: 40,
  color: '#FFD493',
  border: 8,
  radius: 20,
  opacity: 0.6,
  x: 0,
  y: 8,
  style: {
    position: 'absolute',
    top: 0,
    left: 6,
    zIndex: -1,
  },
};

export default class TeamInfo extends React.Component {
  closeUp = () => {
    const { closeUp } = this.props;
    closeUp();
  };

  clickUpgrade = item => {
    const { clickUpgrade } = this.props;
    clickUpgrade(item);
  };

  render() {
    const { datas } = this.props;
    return (
      <View style={styles.toastWrap}>
        <TouchableOpacity style={styles.toastBg} onPress={this.closeUp} activeOpacity={1} />
        <View style={styles.toastContentWrap}>
          <View style={styles.toastContentBox}>
            <View style={styles.avatarWrap}>
              <Image style={styles.avatar} source={{ uri: datas.headimgurl }} />
              <VipIcon roleId={datas.roleId} levelName={datas.levelName} />
            </View>
            <Text style={styles.nickName} numberOfLines={1}>
              {datas.nickname}
            </Text>
            <View style={styles.toastConten}>
              <View style={styles.numWrap}>
                <View style={styles.numBox}>
                  <Text style={styles.num}>{datas.myFriendCount}</Text>
                  <Text style={styles.numInfo}>好友数量</Text>
                  <View style={styles.line} />
                </View>
                <View style={styles.numBox}>
                  <Text style={styles.num}>{datas.orderNum}</Text>
                  <Text style={styles.numInfo}>团队订单</Text>
                </View>
              </View>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#EDAB46', '#F1C27A']} style={[styles.btnWrap, styles.btnWrapTop]}>
                <TouchableOpacity style={styles.btnWrap} activeOpacity={0.85} onPress={() => this.clickUpgrade(datas)}>
                  <Text style={styles.btnText}>升级为合伙人</Text>
                </TouchableOpacity>
                <BoxShadow setting={shadowOpt} />
              </LinearGradient>
              <View style={styles.timeWrap}>
                <Image style={styles.timeIcon} source={require('../../assets/invite-icon-time1.png')} />
                <Text style={styles.timeText}>
                  邀请时间：
                  {datas.invitationDate}
                </Text>
                <Image style={styles.timeIcon} source={require('../../assets/invite-icon-time2.png')} />
              </View>
            </View>
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
    zIndex: 99,
    paddingTop: 145,
  },
  toastBg: {
    width: '100%',
    height: Layout.window.height,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  toastContentWrap: {
    width: '100%',
    height: 300,
    position: 'relative',
    zIndex: 999,
    paddingLeft: 53,
    paddingRight: 53,
  },
  toastContentBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    height: 300,
  },
  toastConten: {
    position: 'relative',
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
  },
  avatarWrap: {
    position: 'absolute',
    width: '100%',
    left: 0,
    right: 0,
    top: -33,
    margin: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 30,
  },
  nickName: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 15,
    color: '#333',
    marginTop: 36,
    width: '100%',
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },
  numWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 34,
  },
  numBox: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  num: {
    fontFamily: 'DINA',
    fontSize: 30,
    color: '#FC4277',
  },
  numInfo: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
  line: {
    width: 0.5,
    height: 32,
    backgroundColor: '#efefef',
    position: 'absolute',
    top: 12,
    right: 0,
  },
  btnWrap: {
    width: '100%',
    height: 48,
    alignItems: 'center',
    borderRadius: 24,
  },
  btnWrapTop: {
    marginTop: 32,
    position: 'relative',
  },
  btnText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#885401',
    lineHeight: 48,
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  timeIcon: {
    width: 14,
    height: 10,
    resizeMode: 'cover',
  },
  timeText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
  },
});
