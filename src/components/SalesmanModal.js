import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import Layout from '../constants/Layout';

const shadowOpt = {
  width: Layout.window.width - 116,
  height: 154,
  color: '#666',
  border: 14,
  radius: 6,
  opacity: 0.7,
  x: 0,
  y: 8,
  style: {
    position: 'absolute',
    top: 250,
    left: 58,
  },
};

const styles = StyleSheet.create({
  alertWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10,
    elevation: 1,
    paddingLeft: 52,
    paddingRight: 52,
    // right: 0,
    // bottom: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: 250,
    height: Layout.window.height,
    width: Layout.window.width,
  },
  alertContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 7,
    position: 'relative',
    zIndex: 99,
    elevation: 99,
  },
  alertTextWrap: {
    paddingTop: 16,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 16,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  btnWrap: {
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    flexDirection: 'row',
  },
  btnCancel: {
    width: '50%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#ddd',
  },
  btnCancelText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
  },
  btnConfirm: {
    width: '50%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnConfirmText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#FC4277',
  },
});

export default class SalesmanModal extends React.Component {
  closeModal = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  changeSalesman = () => {
    const { changeSalesman } = this.props;
    changeSalesman();
  };

  render() {
    const { userInfo, isModal, type } = this.props;
    return (
      isModal && (
        <View style={styles.alertWrap}>
          <View style={styles.alertContent}>
            <View style={styles.alertTextWrap}>
              {
                type === 1 ? (
                  <Text style={styles.alertText}>{`是否升级"${userInfo.nickname}"为业务员？`}</Text>
                ) : (
                  <Text style={styles.alertText}>{`确定取消"${userInfo.nickname}"的业务员资格?`}</Text>
                )
              }
            </View>
            <View style={styles.btnWrap}>
              <TouchableOpacity style={styles.btnCancel} onPress={this.closeModal} activeOpacity={Layout.activeOpacity}>
                <Text style={styles.btnCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirm} onPress={this.changeSalesman} activeOpacity={Layout.activeOpacity}>
                <Text style={styles.btnConfirmText}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
          <BoxShadow setting={shadowOpt} />
        </View>
      )
    );
  }
}
