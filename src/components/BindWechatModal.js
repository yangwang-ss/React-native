import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Layout from '../constants/Layout';

export default class BindWechatModal extends React.Component {
  handleModal = () => {
    const { handleBindModal } = this.props;
    handleBindModal(false);
  };

  bindWechat = () => {
    const { bindWechat } = this.props;
    bindWechat();
  };

  render() {
    const { bindModal } = this.props;
    return (
      bindModal && (
        <View style={styles.modalWrap}>
          <View style={styles.modalContent}>
            <Image style={styles.modalImg} source={require('../../assets/icon-weChat.png')} />
            <View style={styles.modalBox}>
              <TouchableOpacity style={styles.closeBtnWrap} onPress={this.handleModal}>
                <Text onPress={this.handleModal} style={styles.closeBtn}>×</Text>
              </TouchableOpacity>

              <Text style={styles.text1}>登陆微信</Text>
              <Text style={styles.text2}>登录微信方可提现</Text>
              <TouchableOpacity onPress={this.bindWechat} style={styles.btnWrap} activeOpacity={Layout.activeOpacity}>
                <LinearGradient
                  style={styles.btnBox}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={['#F8CA7D', '#BB9655']}
                >
                  <Text style={styles.btnText}>立即登录</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  modalWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 999,
    elevation: 999,
    height: Layout.window.height,
    paddingTop: 160,
  },
  modalContent: {
    width: 240,
  },
  modalBox: {
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  modalImg: {
    position: 'absolute',
    top: -30,
    left: 86,
    width: 60,
    height: 60,
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 30,
    backgroundColor: '#fff',
    zIndex: 9,
  },
  closeBtnWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingRight: 9,
    paddingBottom: 5,
    paddingLeft: 10,
    zIndex: 999,
  },
  closeBtn: {
    fontSize: 24,
    color: '#999',
  },
  text1: {
    textAlign: 'center',
    marginTop: 54,
    marginBottom: 12,
    fontSize: 16,
    fontFamily: 'PingFangSC-Medium',
    color: '#4D1F33',
  },
  text2: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#999',
  },
  btnWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnBox: {
    width: 160,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
  },
});
