import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Clipboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';

export default class VipCard extends React.Component {
  copy(str) {
    Clipboard.setString(str);
    storage.save({
      key: 'searchText',
      data: {
        searchText: str,
      },
    });
    this.showToast('复制成功');
    AnalyticsUtil.event('vipIndex_copy_inviteCode');
  }

  // 弹框
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

  jumpMyInvite = () => {
    this.props.jumpPage();
  };

  render() {
    const { userInfo } = this.props;
    const { parent } = userInfo;

    let inviterName = (parent && parent.nickname) || '';
    inviterName = inviterName.substring(0, 7);

    return (
      <View style={styles.cardWrap}>
        <Image style={styles.cardBackground} resizeMode="stretch" source={{ uri: 'http://family-img.vxiaoke360.com/vipIndex-head-bg.png' }} />
        <View style={styles.cardDes}>
          <View style={styles.cardBox}>
            <Image style={styles.cardBg} resizeMode="stretch" source={userInfo.roleId == 30 ? require('../../assets/vip-card-bg.png') : require('../../assets/vip/vip-card-bg1.png')} />
            <View style={styles.vipPersonBox}>
              <View style={styles.vipPersonWrap}>
                <Image style={styles.personAvatar} source={{ uri: userInfo.avatar }} />
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{(userInfo.nickname && userInfo.nickname.length > 8 ? `${userInfo.nickname.substr(0, 8)}...` : userInfo.nickname) || '米粒生活'}</Text>
                  <View style={styles.vipTagWrap}>
                    <Image style={styles.vipTagIcon} source={require('../../assets/vip/icon-vip.png')} />
                    <View style={styles.vipTagTextWrap}>
                      <Text style={styles.vipTagText}>{userInfo.role || '普通会员'}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.inviteCodeWrap}>
                <Text style={[styles.inviteCode, userInfo.roleId > 30 && { color: '#CDBDB8' }]}>
                  专属邀请码：
                  {userInfo.invitationCode}
                </Text>
                <TouchableOpacity style={styles.btnCopy} activeOpacity={0.85} onPress={() => this.copy(userInfo.invitationCode)}>
                  {userInfo.roleId == 30 ? (
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#E1CDA1', '#BE9D65']} style={styles.btnCopy}>
                      <Text style={styles.btnCopyTxt}>复制</Text>
                    </LinearGradient>
                  ) : (
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#CCABA7', '#B08A86']} style={styles.btnCopy}>
                      <Text style={styles.btnCopyTxt}>复制</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.wechatWrap}>
            <Text style={styles.wechatNum}>
              专属客服微信号：
              {userInfo.wxNO}
            </Text>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#e1cda1', '#be9d65']} style={styles.wechatCopyBtn}>
              <TouchableOpacity onPress={() => this.copy(userInfo.wxNO)}>
                <Text style={styles.copyText}>复制</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <TouchableOpacity style={styles.inviteWrap} activeOpacity={0.85} onPress={() => this.jumpMyInvite()}>
            <LinearGradient start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FAF0D9', '#DBCBAF']} style={styles.inviteContainer}>
              <View style={styles.inviteLeftWrap}>
                <Image style={styles.inviteLeftAvatar} source={{ uri: parent && parent.avatar }} />
                <View>
                  <View style={styles.leftInfoWrap}>
                    <Text numberOfLines={1} style={styles.leftInfoName}>
                      {inviterName}
                    </Text>
                    <View style={styles.inviteTextWrap}>
                      <Text style={styles.inviteText}>我的邀请人</Text>
                    </View>
                  </View>
                  <View style={styles.leftVipTagWrap}>
                    <Image style={styles.leftVipTagIcon} source={require('../../assets/vip/icon-vip.png')} />
                    <View style={styles.leftVipTagTextWrap}>
                      <Text style={styles.leftVipTagText}>{(parent && parent.role) || '普通会员'}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <Text style={styles.rigthText}>
                我的好友:
                <Text style={styles.rigthTextNum}>{userInfo.friendCount}</Text>
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inviteWrap: {
    width: '100%',
    height: 84,
    paddingVertical: 12,
  },
  inviteContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 30,
  },
  inviteLeftWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteLeftAvatar: {
    width: 36,
    height: 36,
    backgroundColor: '#FAF0D9',
    borderRadius: 18,
    marginRight: 8,
  },
  leftInfoWrap: {
    flexDirection: 'row',
  },
  leftInfoName: {
    fontSize: 12,
    fontFamily: 'PingFangSC-Medium',
    color: '#333',
  },
  inviteTextWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#444343',
    paddingHorizontal: 4,
    marginLeft: 4,
  },
  inviteText: {
    fontSize: 10,
    fontFamily: 'PingFangSC-Semibold',
    color: '#FFE4B1',
  },
  leftVipTagWrap: {
    flexDirection: 'row',
  },
  leftVipTagTextWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 16,
    backgroundColor: '#fbefde',
    marginLeft: 6,
    marginTop: 5,
    borderRadius: 4,
  },
  leftVipTagText: {
    fontFamily: 'PingFangSC-Semibold',
    color: '#c1a16a',
    fontSize: 12,
    marginLeft: 16,
    paddingRight: 6,
  },
  leftVipTagIcon: {
    position: 'absolute',
    top: 6,
    left: 0,
    width: 16,
    height: 14,
    zIndex: 99,
  },
  rigthText: {
    fontFamily: 'PingFangSC-Semibold',
    color: '#333',
    fontSize: 16,
  },
  rigthTextNum: {
    fontFamily: 'DINA',
    color: '#EA4457',
    fontSize: 18,
  },
  cardWrap: {
    backgroundColor: '#fff',
    position: 'relative',
    height: 424,
  },
  cardBackground: {
    height: 225,
    width: '100%',
  },
  cardDes: {
    width: '100%',
    position: 'absolute',
    top: 78,
    paddingLeft: 12,
    paddingRight: 12,
  },
  cardBox: {
    flex: 1,
    height: 216,
    position: 'relative',
  },
  cardBg: {
    width: '100%',
    height: 216,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  vipPersonBox: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 24,
  },
  vipPersonWrap: {
    flexDirection: 'row',
    marginBottom: 80,
    alignItems: 'center',
  },
  personAvatar: {
    width: 46,
    height: 46,
    borderWidth: 2,
    borderColor: '#f8ebd2',
    marginRight: 7,
    borderRadius: 22,
  },
  personInfo: {
    flexDirection: 'row',
  },
  inviteCodeWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteCode: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#7C5819',
    marginRight: 12,
  },
  btnCopy: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  btnCopyTxt: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  personName: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'PingFangSC-Semibold',
    marginRight: 7,
  },
  vipTime: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
  },
  vipTagWrap: {
    position: 'relative',
  },
  vipTagTextWrap: {
    flexDirection: 'row',
    height: 16,
    backgroundColor: '#fbefde',
    marginLeft: 12,
    marginTop: 5,
    borderRadius: 4,
  },
  vipTagText: {
    fontFamily: 'PingFangSC-Semibold',
    color: '#c1a16a',
    fontSize: 12,
    marginLeft: 16,
    lineHeight: 16,
    paddingRight: 4,
  },
  vipTagIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 24,
    height: 21,
    zIndex: 99,
  },
  wechatWrap: {
    marginTop: 14,
    backgroundColor: 'rgba(203, 175, 124, 0.1)',
    borderRadius: 6,
    width: '100%',
    height: 30,
    paddingTop: 5,
    paddingRight: 12,
    paddingBottom: 5,
    paddingLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wechatNum: {
    color: '#7c5819',
    fontSize: 13,
    fontFamily: 'PingFangSC-Regular',
  },
  wechatCopyBtn: {
    borderRadius: 10,
    height: 20,
    width: 46,
  },
  copyText: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 11,
  },
});
