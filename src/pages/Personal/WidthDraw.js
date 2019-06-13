/**
 * 提现页面
 *
 */

import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ImageBackground, ScrollView, StatusBar, Keyboard, AppState,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { NavigationEvents } from 'react-navigation';
import BindWechatModal from '@components/BindWechatModal';
import { getMoneyCount, widthDraw, isBindWechat, bindWechat } from '../../services/api';

export default class WidthDraw extends Component {
  static navigationOptions = {
    title: '余额',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  };

  state = {
    inputValue: '',
    inputFoucs: false,
    moneyInfo: {},
    hasWechat: true,
    isBind: true,
    bindModal: false,
  };

  init() {
    this.canDo = true;
    this.getMoneyCount();
    this.hasWechat();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      this.hasWechat();
    }
  };

  getInputVal(e) {
    if (!e.length) {
      this.setState({
        inputValue: '',
        inputFoucs: false,
      });
    } else {
      this.setState({
        inputValue: e,
        inputFoucs: true,
      });
    }
  }

  drawAllMoney = () => {
    this.setState({
      inputValue: this.state.moneyInfo.balance,
      inputFoucs: true,
    });
  };

  handleBindModal = (boo) => {
    this.setState({
      bindModal: boo,
    })
  };

  hasWechat = () => {
    const { WeChat } = global;
    WeChat.isWXAppInstalled()
          .then(async isInstalled => {
            if (isInstalled) {
              this.setState({
                hasWechat: true,
              });
              this.isBindWechat();
            } else {
              this.showToast('你还没有安装微信，请安装微信之后再提现！');
              setTimeout(() => {
                this.setState({
                  hasWechat: false,
                });
              }, 2000);
            }
          })
          .catch(() => {
            setTimeout(() => {
              this.setState({
                hasWechat: true,
              });
            }, 2000);
          });
  };

  async widthDraMoney() {
    const { inputValue, hasWechat, isBind } = this.state;
    // 提现逻辑
    if (!hasWechat) {
      this.showToast('你还没有安装微信，请安装微信之后再提现！');
      return;
    }

    if (!isBind) {
      this.showToast('你还没有绑定微信，请绑定微信之后再提现！');
      return;
    }

    if (!inputValue) {
      this.showToast('请输入提现的额度');
      return;
    }
    if (inputValue > 5000) {
      this.showToast('提现金额最大不超过5000');
      return;
    }

    if (this.canDo) {
      this.canDo = false;
      setTimeout(() => {
        this.canDo = true;
      }, 2000);
      const loading = Toast.show('提现中...', {
        duration: 0,
        position: 0,
      });
      const value = this.mul(this.state.inputValue, 100);
      const res = await widthDraw(value);
      console.log('提现结果', value, res);
      if (res && res.code) {
        this.handleBindModal(true);
      } else if (res === 'success') {
        this.showToast('提现成功');
        this.setState({
          inputValue: '',
          inputFoucs: false,
        });
        this.getMoneyCount();
      }
      Toast.hide(loading);
    }
  }

  // 是否绑定微信
  async isBindWechat() {
    const res = await isBindWechat();
    if (res && !res.isBindWx) {
      this.handleBindModal(true);
    }
  };

  // 获取微信code
  getWechatCode = async () => {
    try {
      const scope = 'snsapi_userinfo';
      const state = 'wechat_sdk_demo';
      const { code } = await WeChat.sendAuthRequest(scope, state);
      if (code) {
        this.bindWechat(code);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 绑定微信
  bindWechat = async (code) => {
    const res = await bindWechat(code);
    let boo = false;
    if (res) {
      boo = true;
    } else {
      boo = false;
    }
    this.setState({
      isBind: boo,
    });
    this.handleBindModal(false);
  };

  mul(a, b) {
    let c = 0;
    const d = a.toString();
    const e = b.toString();
    try {
      c += d.split('.')[1].length;
    } catch (e) {}
    try {
      c += e.split('.')[1].length;
    } catch (e) {}
    return (Number(d.replace('.', '')) * Number(e.replace('.', ''))) / Math.pow(10, c);
  }

  jumpPage() {
    this.props.navigation.navigate('DrawDetail');
  }

  showToast(str) {
    Toast.show(str, {
      duration: 2000,
      position: 0,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onHidden: () => {
        this.setState({});
      },
    });
  }

  // 获取钱信息汇总
  async getMoneyCount() {
    const res = await getMoneyCount();
    if (res) {
      this.setState({
        moneyInfo: res,
      });
    }
  }

  render() {
    const { bindModal } = this.state;
    return (
      <ScrollView keyboardShouldPersistTaps="never" contentContainerStyle={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.cardInfoWrap}>
          <ImageBackground source={require('../../../assets/wallet-bg2.png')} style={{ borderRadius: 4, width: '100%', height: 144 }}>
            <View style={styles.cardInfo}>
              <View style={styles.cardText}>
                <Text style={styles.colorWhite}>当前余额(元)</Text>
                <Text style={styles.moneyCount}>¥{this.state.moneyInfo.balance || '0.00'}</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.detailInfo} onPress={() => this.jumpPage()}>
                  余额明细
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.cashMethod}>
          <Text style={styles.cashMethodText}>提现方式</Text>
          <View style={styles.wxIconWrap}>
            <Image source={require('../../../assets/icon-weChat.png')} style={styles.wxIcon} />
            <Text style={styles.wxIconText}>微信零钱</Text>
          </View>
        </View>
        <View style={styles.inputWrap}>
          <Text style={styles.inputWrapInfo}>提现金额</Text>
          <View style={styles.inputContent}>
            <View style={styles.inputContentBox}>
              <Text style={styles.moneyCode}>¥</Text>
              <TextInput
                style={this.state.inputFoucs ? [styles.textInput, styles.textInput2] : styles.textInput}
                placeholder="0.00"
                onChangeText={text => this.getInputVal(text)}
                value={this.state.inputValue}
                underlineColorAndroid="transparent"
                maxLength={8}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity onPress={() => this.drawAllMoney()} activeOpacity={0.85} style={styles.button}>
              <View style={styles.buttonTextWrap}>
                <Text style={styles.buttonText}>全部提现</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => this.widthDraMoney()} style={styles.bigBtn} activeOpacity={0.85}>
          <View style={styles.bigBtnTextWrap}>
            <Text style={styles.bigBtnText}>立即提现</Text>
          </View>
        </TouchableOpacity>
        <BindWechatModal
          bindModal={bindModal}
          handleBindModal={this.handleBindModal}
          bindWechat={this.getWechatCode}
        />
        <NavigationEvents onDidFocus={() => this.init()} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  cardInfoWrap: {
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 12,
  },
  cardInfo: {
    width: '100%',
    paddingLeft: 28,
    paddingRight: 28,
    paddingTop: 24,
    height: 144,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardText: {
    color: 'white',
  },
  colorWhite: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#fff',
  },
  moneyCount: {
    fontFamily: 'DINA',
    fontSize: 30,
    color: '#fff',
    marginTop: 12,
  },
  detailInfo: {
    width: 80,
    height: 32,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 16,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    lineHeight: 32,
    color: '#fff',
    textAlign: 'center',
  },
  cashMethod: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDD',
    marginTop: 10,
  },
  cashMethodText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
  },
  wxIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wxIcon: {
    width: 24,
    height: 24,
    marginRight: 4,
    borderRadius: 12,
  },
  wxIconText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    lineHeight: 22,
    color: '#666',
    textAlign: 'center',
  },
  inputWrap: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDD',
  },
  inputWrapInfo: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    flex: 1,
  },
  inputContentBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moneyCode: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 26,
    color: '#333',
    padding: 0,
    marginRight: 4,
  },
  textInput: {
    width: 200,
    padding: 0,
    fontFamily: 'PingFangSC-Medium',
    fontSize: 26,
    color: '#666',
  },
  textInput2: {
    color: '#333',
  },
  button: {
    width: 80,
    height: 32,
    borderRadius: 4,
  },
  buttonTextWrap: {
    width: '100%',
    height: 32,
    borderRadius: 4,
    backgroundColor: '#FC4277',
  },
  buttonText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    lineHeight: 32,
    color: '#fff',
    textAlign: 'center',
  },
  bigBtn: {
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 32,
  },
  bigBtnTextWrap: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FC4277',
  },
  bigBtnText: {
    width: '100%',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    lineHeight: 48,
    color: '#fff',
    textAlign: 'center',
  },
});
