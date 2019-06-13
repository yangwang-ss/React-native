import React from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { login } from '../services/api';

export default class LoginTip extends React.Component {
  constructor(props) {
    super(props);
    this.canClick = true;
    this.loginFlag = 0;
  }

  async sendAuthRequest() {
    if (!this.canClick) {
      return;
    }
    this.canClick = false;
    try {
      const scope = 'snsapi_userinfo';
      const state = 'wechat_sdk_demo';
      const { code } = await WeChat.sendAuthRequest(scope, state).catch((e) => {
        this.canClick = true;
      });
      if (code) {
        this.login(code);
      } else {
        this.canClick = true;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async login(code) {
    const loginInfo = await login(code);
    if (loginInfo && loginInfo instanceof Object) {
      // type 1 未绑定手机号， 2已绑定手机号
      this.canClick = true;
      if (loginInfo.type === 1) {
        this.props.navigation.navigate('Login', {
          code: loginInfo.code,
        });
      } else {
        const { modifyLogin, getInitStore } = this.props;
        modifyLogin();
        getInitStore();
        this.props.navigation.goBack();
      }
      const { token } = loginInfo;
      if (token) {
        await storage.save({
          key: 'token',
          data: { token },
        });
      }
      storage.save({
        key: 'userInfo',
        data: loginInfo,
      });
    } else {
      this.loginFlag += 1;
      if (this.loginFlag < 4) {
        this.login(code);
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.tipBg} source={require('../../assets/img-login-bg.png')} />
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>登录领取淘宝大额优惠券</Text>
          <TouchableOpacity onPress={() => this.sendAuthRequest()}>
            <LinearGradient
              style={styles.linearGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#FFE985', '#FA9864']}
            >
              <Text style={styles.btnText}>一键登录</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 99,
    width: '100%',
    height: 44,
  },
  linearGradient: {
    width: 66,
    height: 24,
    borderRadius: 4,
  },
  tipBg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: 44,
  },
  tipBox: {
    width: '100%',
    height: 44,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 11,
    paddingRight: 11,
  },
  tipText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 13,
    color: '#fff',
  },
  btnText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 12,
    color: '#B32453',
    lineHeight: 24,
    textAlign: 'center',
  },
});
