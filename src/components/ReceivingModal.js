import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Layout from '../constants/Layout';

export default class ReceivingModal extends React.Component {
  receiving = () => {
    const { receiving } = this.props;
    receiving();
  };

  cancelAlert = () => {
    const { cancelAlert } = this.props;
    cancelAlert();
  };

  render() {
    const { isReceivingModal } = this.props;
    return (
      isReceivingModal && (
        <View style={styles.alertWrap}>
          <View style={styles.alertContent}>
            <View style={styles.alertTextWrap}>
              <Text style={styles.alertText}>是否确认收货？</Text>
              <Text style={styles.alertText}>确认收货后无法撤回，请谨慎操作</Text>
            </View>
            <View style={styles.btnWrap}>
              <TouchableOpacity style={styles.btnCancel} onPress={this.cancelAlert} activeOpacity={Layout.activeOpacity}>
                <Text style={styles.btnCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirm} onPress={this.receiving} activeOpacity={Layout.activeOpacity}>
                <Text style={styles.btnConfirmText}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  alertWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10,
    elevation: 1,
    paddingTop: '48%',
  },
  alertContent: {
    width: 270,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  alertImg: {
    width: 270,
    height: 125,
  },
  alertTextWrap: {
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 16,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  btnWrap: {
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    flexDirection: 'row',
  },
  btnCancel: {
    width: 134.5,
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
    width: 135,
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
