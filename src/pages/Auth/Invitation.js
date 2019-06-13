/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet, Text, Image, View, TouchableOpacity, TextInput, StatusBar, ScrollView, Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import { establishParent, refreshUserInfo, getUserData } from '../../services/api';

type Props = {};
export default class Invitation extends Component<Props> {
  static navigationOptions = {
    title: '邀请码',
  }

  constructor(props) {
    super(props);
    this.state = {
      code: '',
      userData: {},
    };
  }

  async onSubmit() {
    if (!this.checked) {
      this.checked = true;
      Keyboard.dismiss();
      const { code } = this.state;
      const result = await establishParent(code);
      if (result) {
        this.showToast('填写成功');
      }
      const userInfo = await refreshUserInfo();
      if (userInfo) {
        storage.save({
          key: 'userInfo',
          data: userInfo,
        });
        this.props.navigation.replace('SexChoose');
      } else {
        this.props.navigation.navigate('Home');
      }
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

  goBack() {
    this.props.navigation.goBack('Auth');
  }

  getCode(code) {
    if (code && code.length == 6) {
      console.log('code===', code);
      this.getUserData(code);
    }
    if (!code) {
      this.setState({ userData: { check: false } });
    }
    this.setState({ code: code.trim() });
  }

  async getUserData(code) {
    const res = await getUserData(code);
    console.log('getUserData===', res);
    if (res) {
      this.setState({ userData: res });
    }
  }

  render() {
    const { code, userData } = this.state;
    return (
      <ScrollView contentContainerStyle={[styles.container]} keyboardShouldPersistTaps="always">
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <TextInput
          style={styles.code_style}
          keyboardType="phone-pad"
          maxLength={6}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          onChangeText={(code) => { this.getCode(code); }}
          value={code}
        />
        {
          userData && userData.check
          && (
          <View style={styles.userDataWrap}>
            <Text>邀请人：</Text>
            <Image
              source={{ uri: userData.headimgurl || '' }}
              style={{
                width: 26, height: 26, marginLeft: 2, marginRight: 6, borderRadius: 13,
              }}
            />
            <Text>{userData.nickname || ''}</Text>
          </View>
          )
        }
        <TouchableOpacity style={{ width: '100%' }} disabled={!code} onPress={() => this.onSubmit()}>
          <LinearGradient colors={code ? ['#FA3C8E', '#FC4176'] : ['#FD9EC7', '#FE9EBA']} style={styles.btn_con}>
            <Text style={styles.btn_text}>{(code && code.length == 6) ? '进入米粒生活' : '请输入正确的邀请码'}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.protocol}>还没有邀请码？快找你的邀请人领取</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
  },
  userDataWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
    fontSize: 12,
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
    marginTop: 20,
  },
  code_style: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    paddingBottom: 8,
    marginTop: 54,
    fontSize: 24,
    color: '#333',
    fontFamily: 'DIN-Regular',
  },
  btn_con: {
    marginTop: 31,
    height: 49,
    width: '100%',
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
    color: '#ff4c9d',
    fontFamily: 'PingFangSC-Regular',
    marginTop: 22,
  },
});
