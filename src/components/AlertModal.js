import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Layout from '../constants/Layout';

class AlertModal extends React.Component {
  render() {
    const { isShow, text, confirmAlert, cancelAlert } = this.props;
    return (
      isShow && (
        <View style={styles.alertWrap}>
          <View style={styles.alertContent}>
            <Image style={styles.alertImg} source={require('../../assets/img-alert-top.png')} />
            <View style={styles.alertTextWrap}>
              <Text numberOfLines={2} style={styles.alertText}>
                {text}
              </Text>
            </View>
            <View style={styles.btnWrap}>
              <TouchableOpacity style={styles.btnCancel} onPress={cancelAlert} activeOpacity={Layout.activeOpacity}>
                <Text style={styles.btnCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirm} onPress={confirmAlert} activeOpacity={Layout.activeOpacity}>
                <Text style={styles.btnConfirmText}>搜索</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    );
  }
}

const mapStateToProps = state => ({
  isShow: state.searchModel.isShow,
  text: state.searchModel.searchText,
});
export default connect(mapStateToProps)(AlertModal);

const styles = StyleSheet.create({
  alertWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 999,
    elevation: 999,
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
