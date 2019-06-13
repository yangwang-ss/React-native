import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ImageBackground, ScrollView, StatusBar, Keyboard,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { getHpMoneyCount, hpWidthDraw } from '../../services/api';

export default class WidthDraw extends Component {
  state = {
    inputValue: '',
    inputFoucs: false,
    canDo: true,
    moneyInfo: {
      money: '0.00',
    },
  };

  static navigationOptions = {
    title: '惠拼钱包余额',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  };

  componentDidMount() {
    this.getHpMoneyCount();
  }

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

  drawAllMoney() {
    this.setState({
      inputValue: `${this.state.moneyInfo.money}`,
      inputFoucs: true,
    });
  }

  async widthDraMoney() {
    // 提现逻辑
    const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
    if (!this.state.inputValue) {
      this.showToast('请输入提现的额度');
      return;
    }
    if (Number(this.state.inputValue) < 1) {
      this.showToast('提现金额不能少于1元');
      return;
    }
    if (!reg.test(this.state.inputValue)) {
      this.showToast('提现金额格式不正确');
      return;
    }
    if (Number(this.state.inputValue) > this.state.moneyInfo.money) {
      this.showToast('超出可提现金额');
      return;
    }

    if (this.state.canDo) {
      const loading = Toast.show('提现中...', {
        duration: 0,
        position: 0,
      });
      this.setState({
        canDo: false,
      }, async () => {
        const params = {
          money: this.state.inputValue,
          hpyxUserId: this.state.moneyInfo.hpyxUserId,
        };
        const res = await hpWidthDraw(params);
        if (res) {
          this.showToast('提现成功');
          this.setState({
            inputValue: '',
            inputFoucs: false,
          });
          this.getHpMoneyCount();
        }
        this.setState({
          canDo: true,
        });
        Toast.hide(loading);
      });
    }
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
  async getHpMoneyCount() {
    const res = await getHpMoneyCount();
    if (res) {
      this.setState({
        moneyInfo: res,
      });
    }
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="never" contentContainerStyle={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.cardInfoWrap}>
          <ImageBackground source={require('../../../assets/wallet-bg2.png')} style={{ borderRadius: 4, width: '100%', height: 144 }}>
            <View style={styles.cardInfo}>
              <View style={styles.cardText}>
                <Text style={styles.colorWhite}>当前余额(元)</Text>
                <Text style={styles.moneyCount}>
¥
                  {this.state.moneyInfo.money || '0.00'}
                </Text>
              </View>
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
