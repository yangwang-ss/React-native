import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class ReferralsTip extends React.Component {
  closeTipModal = () => {
    const { closeTipModal } = this.props;
    closeTipModal();
  };

  render() {
    const { tipContent } = this.props;
    return (
      <View style={styles.toastWrap}>
        <View style={styles.toastContentWrap}>
          <View style={styles.toastContent}>
            <Text style={styles.toastTitle}>直推有效期</Text>
            <View style={styles.toastWordsWrap}>
              <Text style={styles.toastWords}>
                {tipContent.tips1}
                <Text style={styles.toastWordsColor}>{tipContent.tips2}</Text>
                {' '}
                {tipContent.tips3}
              </Text>
            </View>
          </View>
          <View style={styles.toastConfirmWrap}>
            <Text style={styles.toastConfirm} onPress={() => this.closeTipModal()}>知道了</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toastWrap: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastContentWrap: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 290,
    height: 174,
    position: 'relative',
    paddingTop: 20,
  },
  toastContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  toastTitle: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333333',
    width: '100%',
    textAlign: 'center',
  },
  toastWordsWrap: {
    width: '100%',
    marginTop: 15,
  },
  toastWords: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  toastConfirmWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 48,
    borderTopWidth: 0.5,
    borderTopColor: '#DDD',
  },
  toastConfirm: {
    width: '100%',
    height: 48,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#FC4277',
    lineHeight: 48,
    textAlign: 'center',
  },
  toastWordsRed: {
    color: '#FC4277',
  },
  toastWordsColor: {
    color: '#FC4277',
  },
});
