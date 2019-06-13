import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Layout from '../constants/Layout';

export default class ToastConfirm extends React.Component {
  cancelClik = () => {
    const { cancel } = this.props;
    cancel();
  };

  confirmClik = () => {
    const { confirm, hideCancel } = this.props;
    if (hideCancel) {
      confirm(1); // 商品编辑、增加
    } else {
      confirm(); // 隐藏弹框
    }
  };

  render() {
    const { words, hideCancel } = this.props;
    return (
      <View style={styles.alertWrap}>
        <View style={[styles.alertContent]}>
          <View style={styles.alertTextWrap}>
            <Text style={styles.alertText}>{words}</Text>
          </View>
          <View style={styles.btnWrap}>
            {!hideCancel ? (
              <TouchableOpacity style={styles.btnCancel} onPress={() => this.cancelClik()} activeOpacity={0.85}>
                <Text style={styles.btnCancelText}>取消</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.btnConfirm} activeOpacity={0.85} onPress={() => this.confirmClik()}>
              <Text style={styles.btnConfirmText}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  alertWrap: {
    width: '100%',
    height: Layout.window.height,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    elevation: 999,
  },
  alertContent: {
    width: 270,
    backgroundColor: '#fff',
    borderRadius: 8,
    // position: 'absolute',
    // left: '14%',
    // margin: 'auto',
  },
  alertTextWrap: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
  },
  btnWrap: {
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    flexDirection: 'row',
  },
  btnCancel: {
    flex: 1,
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
    flex: 1,
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
