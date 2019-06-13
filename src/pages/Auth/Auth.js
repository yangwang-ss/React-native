/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import { login } from '../../services/api';

type Props = {};
export default class Auth extends Component<Props> {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerStyle: {
        ...navigationOptions.headerStyle,
        borderBottomWidth: 0,
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
  }

  async componentWillMount() {
    const { isReview } = global;
    this.setState({
      isShow: isReview,
    });
  }

  toMobileLogin() {
    this.props.navigation.navigate('MobileLogin');
  }

  canClick = true;

  async sendAuthRequest() {
    if (!this.canClick) {
      return;
    }
    this.canClick = false;
    try {
      const scope = 'snsapi_userinfo';
      const state = 'wechat_sdk_demo';
      const { code } = await WeChat.sendAuthRequest(scope, state).catch(e => {
        this.canClick = true;
      });
      if (code) {
        this.login(code);
      }
    } catch (e) {
      console.log(e);
    }
  }

  loginFlag = 0;

  async login(code) {
    const loginInfo = await login(code);
    if (loginInfo && loginInfo instanceof Object && !loginInfo.msg) {
      // type 1 未绑定手机号， 2已绑定手机号
      this.canClick = true;
      if (loginInfo.type === 1) {
        this.props.navigation.replace('Login', {
          code: loginInfo.code,
        });
      } else {
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
    } else if (!loginInfo.code || loginInfo.code !== 1035) {
      this.loginFlag += 1;
      this.canClick = true;
      if (this.loginFlag < 3) {
        this.sendAuthRequest();
      }
    }
  }

  render() {
    const { isShow } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <Image style={styles.icon_login} source={require('../../../assets/app-icon.png')} />
        <Text style={styles.text}>米粒生活 美丽生活</Text>
        <View style={styles.btn_container}>
          {!isShow && (
            <TouchableOpacity onPress={() => this.sendAuthRequest()}>
              <LinearGradient style={styles.btn_wx} colors={['#FA3C8E', '#FC4176']}>
                <Icon name="wechat" size={20} color="#fff" />
                <Text style={styles.btn_text}>微信登录</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          {isShow && (
            <TouchableOpacity style={[styles.btn_wx, { marginTop: 20 }]} onPress={() => this.toMobileLogin()}>
              <LinearGradient style={styles.btn_wx} colors={['#FA3C8E', '#FC4176']}>
                <Text style={[styles.btn_text]}>手机快速登录</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 48,
  },
  icon_login: {
    width: 90,
    height: 90,
    borderRadius: 20,
    marginBottom: 32,
  },
  text: {
    fontSize: 18,
    color: '#4d1f33',
  },
  btn_container: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 150,
  },
  btn_wx: {
    width: '100%',
    height: 49,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_text: {
    color: '#fff',
    fontSize: 17,
    marginLeft: 8,
  },
  btn_mobile: {
    borderWidth: 0.5,
    marginTop: 20,
  },
  btn_text2: {
    color: '#000',
    fontSize: 17,
    marginLeft: 8,
  },
});
