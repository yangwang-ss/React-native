/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Keyboard, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import { NavigationEvents } from 'react-navigation';
import { sendSVC, register } from '../../services/api';

type Props = {};
export default class Login extends Component<Props> {
  static navigationOptions = {
    title: '注册',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      verificationCode: '',
      verBtnText: '获取验证码',
      verBtnDisabled: false,
      inputFocus: false,
      tipText: '',
    };
    this.keyboardDidHideListener = null;
  }

  async componentDidMount() {
    // 监听键盘隐藏事件
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHideHandler.bind(this));
  }

  didInit = () => {
    global.isShowSearchModal = false;
  };

  blur = () => {
    global.isShowSearchModal = true;
  };

  // 键盘隐藏事件响应
  keyboardDidHideHandler() {
    this.setState({ inputFocus: false });
  }

  canclick = true;

  async register() {
    Keyboard.dismiss();
    if (!this.canclick) {
      return;
    }
    this.canclick = false;
    const { mobile, verificationCode } = this.state;
    const { code } = this.props.navigation.state.params;
    const result = await register({
      mobile,
      verificationCode,
      code,
    });
    if (result && result instanceof Object) {
      await storage.save({
        key: 'token',
        data: { token: result.token },
      });
      await storage.save({
        key: 'userInfo',
        data: result,
      });
      if (!result.isParent) {
        this.props.navigation.replace('Invitation');
      } else {
        this.props.navigation.navigate('MainPage');
      }
    }
    this.canclick = true;
  }

  async getVerificationCode() {
    Keyboard.dismiss();
    const { mobile } = this.state;
    if (!mobile || !/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(mobile)) {
      Toast.show('手机号格式不正确！');
      return;
    }
    this.setState({
      verBtnDisabled: true,
    });
    let time = 60;
    this.timer = setInterval(() => {
      this.setState({
        verBtnText: `倒计时${time}s`,
      });
      if (time < 1) {
        this.setState({
          verBtnText: '重新获取',
          verBtnDisabled: false,
        });
        clearInterval(this.timer);
        return;
      }
      time -= 1;
    }, 1000);
    AnalyticsUtil.event('login_click_get_code');
    const res = await sendSVC(mobile);
    if (!res) {
      clearInterval(this.timer);
      this.setState({
        verBtnDisabled: false,
      });
    } else {
      this.setState({
        tipText: res.msg,
      });
    }
  }

  inputFocus() {
    this.setState({
      inputFocus: true,
    });
  }

  inputBlur() {
    this.setState({
      inputFocus: false,
    });
  }

  jumppage() {
    this.props.navigation.navigate('WebView', { title: '用户协议', src: 'https://www.vxiaoke360.com/H5/mlsh-protocol/index.html' });
  }

  render() {
    const { mobile, verBtnText, verBtnDisabled, verificationCode, inputFocus, tipText } = this.state;
    const btnStatus = verBtnText && verificationCode;
    return (
      <ScrollView contentContainerStyle={[styles.container, inputFocus ? styles.padding0 : '']} keyboardShouldPersistTaps="always">
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <Image style={styles.icon_login} source={require('../../../assets/app-icon.png')} />
        <View style={[styles.item]}>
          <Image style={{ width: 14, height: 18, resizeMode: 'contain' }} source={require('../../../assets/icon-mobile.png')} />
          <Text style={styles.line} />
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="请输入手机号码"
            placeholderTextColor="#c2c2c2"
            style={[styles.input, mobile ? '' : styles.input_null]}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
            maxLength={11}
            multiline
            onFocus={() => this.inputFocus()}
            onChangeText={mobile => this.setState({ mobile })}
            value={mobile}
          />
        </View>
        <View style={[styles.item, styles.code_wrap]}>
          <Image style={{ width: 16, height: 18, resizeMode: 'contain' }} source={require('../../../assets/icon-code.png')} />
          <Text style={styles.line} />
          <TextInput
            maxLength={4}
            keyboardType="numeric"
            placeholder="请输入验证码"
            placeholderTextColor="#c2c2c2"
            returnKeyType="done"
            clearButtonMode="while-editing"
            value={verificationCode}
            textContentType="oneTimeCode"
            onSubmitEditing={() => Keyboard.dismiss()}
            style={[styles.input, styles.code, verificationCode ? '' : styles.input_null]}
            onFocus={() => this.inputFocus()}
            onBlur={() => this.inputBlur()}
            onEndEditing={() => this.inputBlur()}
            onChangeText={verificationCode => this.setState({ verificationCode })}
          />
          <TouchableOpacity style={styles.code_btn} disabled={verBtnDisabled} onPress={() => this.getVerificationCode()}>
            <Text style={styles.code_btn_text}>{verBtnText}</Text>
          </TouchableOpacity>
        </View>
        {Boolean(tipText) && <Text style={styles.tipText}>{tipText}</Text>}
        <View style={styles.btn_container}>
          <TouchableOpacity disabled={!btnStatus} onPress={() => this.register()}>
            <LinearGradient colors={btnStatus ? ['#FA3C8E', '#FC4176'] : ['#FD9EC7', '#FE9EBA']} style={styles.btn_con}>
              <Text style={styles.btn_text}>注册</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={styles.protocol}>
          注册即表示同意米粒生活
          <Text onPress={() => this.props.navigation.navigate('WebView', { src: 'https://www.vxiaoke360.com/H5/mlsh-protocol/index.html' })} style={{ textDecorationLine: 'underline' }}>
            《用户服务协议》
          </Text>
        </Text>
        <NavigationEvents onDidFocus={() => this.didInit()} onWillBlur={() => this.blur()} />
      </ScrollView>
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
  padding0: {
    paddingTop: 0,
  },
  icon_login: {
    width: 90,
    height: 90,
    borderRadius: 20,
    marginBottom: 48,
  },
  item: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 26,
    paddingRight: 22,
    alignItems: 'center',
  },
  line: {
    width: 1,
    backgroundColor: '#e93794',
    height: 22,
    marginLeft: 7,
  },
  input: {
    paddingVertical: 0,
    borderWidth: 0,
    padding: 0,
    fontSize: 22,
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 8,
    fontFamily: 'DIN-Regular',
  },
  input_null: {
    fontSize: 16,
  },
  code_wrap: {
    marginTop: 36,
  },
  code: {
    flex: 1,
  },
  code_btn: {
    borderWidth: 0.5,
    borderColor: '#FB4699',
    paddingLeft: 5,
    paddingRight: 5,
    height: 30,
    justifyContent: 'center',
    borderRadius: 2,
  },
  code_btn_text: {
    fontSize: 14,
    color: '#FB4699',
    fontFamily: 'PingFangSC-Regular',
  },
  btn_container: {
    width: '100%',
    height: 49,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 28,
  },
  btn_con: {
    width: '100%',
    height: '100%',
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
  protocol: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
    marginTop: 22,
  },
  tipText: {
    fontSize: 12,
    color: '#FB4699',
    fontFamily: 'PingFangSC-Regular',
    marginTop: 36,
    textAlign: 'center',
  },
});
