import React from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class BuyVip extends React.Component {
  onPressBuyVip = () => {
    const { jumpVip } = this.props;
    jumpVip();
  };

  onPressCloseBuyVip = () => {
    const { closeVip } = this.props;
    closeVip();
  };

  render() {
    return (
      <View style={styles.vipDialogWrap}>
        <View style={styles.vipDialogContent}>
          {/*
          <TouchableOpacity style={styles.btnCloseDialogWrap} activeOpacity={0.85} onPress={this.onPressCloseBuyVip}>
            <Image style={styles.closeDialogImg} source={require('../../assets/detail/icon-dialog-close.png')} />
            <View style={styles.dialogLine}></View>
          </TouchableOpacity>
          */}
          <Image style={styles.dialogTopImg} source={require('../../assets/detail/icon-dialog.png')} />
          <Text style={styles.dialogText}>立即升级VIP</Text>
          <Text style={styles.dialogText}>即可享更高权益</Text>
          <TouchableOpacity activeOpacity={0.85} onPress={this.onPressBuyVip}>
            <LinearGradient
              style={styles.btnBuyVip}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={['#E2BE84', '#D29F51']}
            >
              <Text style={styles.btnBuyVipText}>立即升级</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={this.onPressCloseBuyVip}>
            <Text style={styles.dialogText2}>以后再说</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  vipDialogWrap: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  vipDialogContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -162,
    marginLeft: -135,
    width: 270,
    height: 324,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCloseDialogWrap: {
    position: 'absolute',
    top: -50,
    right: 0,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogLine: {
    width: 1,
    height: 30,
    backgroundColor: '#000',
  },
  closeDialogImg: {
    width: 24,
    height: 24,
  },
  dialogTopImg: {
    width: 270,
    height: 150,
    marginBottom: 16,
  },
  dialogText: {
    color: '#885401',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
  },
  btnBuyVip: {
    width: 222,
    height: 44,
    borderRadius: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  btnBuyVipText: {
    textAlign: 'center',
    lineHeight: 44,
    color: '#885401',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
  },
  dialogText2: {
    color: '#885401',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
  },
});
