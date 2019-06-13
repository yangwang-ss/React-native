import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import Layout from '../constants/Layout';
const shadowOpt = {
  width: Layout.window.width - 118,
  height: 240,
  color: '#666',
  border: 14,
  radius: 6,
  opacity: 0.7,
  x: 0,
  y: 8,
  style: {
    position: 'absolute',
    top: 168,
    left: 59,
  },
};

export default class ShopOnwerModal extends Component {
  linkingPhone = (tel) => {
    const { linkingPhone } = this.props;
    linkingPhone(tel);
  };

  closeModal = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  render() {
    const { userInfo, isModal } = this.props;
    return (
      isModal && (
        <View style={styles.modalWrap}>
          <View style={styles.modalBox}>
            <TouchableOpacity style={styles.modalBg} onPress={this.closeModal} activeOpacity={Layout.activeOpacity} />
            <View style={styles.modalContent}>
              <View style={styles.avatarWrap}>
                <Image style={styles.avatar} source={{ uri: userInfo.headimgurl }} />
                <Image source={require('@assets/icon-shopOwner.png')} style={styles.vipWrapImg} />
              </View>
              <Text style={styles.modalNickname}>{userInfo.nickname}</Text>
              <View style={styles.modalInfoWrap}>
                <Text style={styles.infoTitle}>电话：</Text>
                <TouchableOpacity style={styles.telWrap} activeOpacity={Layout.activeOpacity} onPress={() => this.linkingPhone(`tel:${userInfo.mobile}`)}>
                  <Text style={styles.infoTelText}>{userInfo.mobile}</Text>
                  <Image style={styles.infoTel} source={require('@assets/order/icon-tel.png')} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalInfoWrap}>
                <Text style={styles.infoTitle}>门店名称：</Text>
                <Text style={styles.infoText}>{userInfo.storeName}</Text>
              </View>
              <View style={styles.modalInfoWrap}>
                <Text style={styles.infoTitle}>门店地址：</Text>
                <Text style={styles.infoText}>{userInfo.storeAddress}</Text>
              </View>
            </View>
            <BoxShadow setting={shadowOpt} />
          </View>
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  modalWrap: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99,
  },
  modalBg: {
    width: Layout.window.width,
    height: Layout.window.height,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalBox: {
    width: '100%',
    height: '100%',
    position: 'relative',
    zIndex: 999,
    paddingLeft: 53,
    paddingRight: 53,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    height: 260,
    position: 'relative',
    zIndex: 99,
    elevation: 9,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 160,
  },
  avatarWrap: {
    position: 'absolute',
    width: '100%',
    left: 16,
    top: -33,
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
  vipWrapImg: {
    width: 49,
    height: 16,
    position: 'absolute',
    bottom: -2,
  },
  modalNickname: {
    textAlign: 'center',
    color: '#333',
    fontFamily: 'PingFangSC-Medium',
    marginTop: 36,
    marginBottom: 30,
    fontSize: 15,
  },
  modalInfoWrap: {
    marginBottom: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoTitle: {
    color: '#666',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    width: 74,
    textAlign: 'right',
  },
  infoText: {
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    flex: 1,
  },
  telWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTel: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  infoTelText: {
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
  },
});
