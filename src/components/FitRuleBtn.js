import React from 'react';
import {
  Text, StyleSheet, TouchableOpacity, Image,
} from 'react-native';

export default class FitRuleBtn extends React.Component {
  toastRule = () => {
    const { toastRule } = this.props;
    toastRule();
  };

  render() {
    return (
      <TouchableOpacity style={styles.ruleWrap11} activeOpacity={0.9} onPress={this.toastRule}>
        <Text style={styles.ruleWrapText}>返现规则</Text>
        <Image style={styles.ruleWrapImg} source={require('../../assets/myOrder-icon-more.png')} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  ruleWrap11: {
    height: 30,
    paddingLeft: 12,
    paddingRight: 10,
    position: 'absolute',
    top: 14,
    right: 0,
    borderWidth: 0.7,
    borderColor: '#FC4277',
    borderRadius: 16,
    borderRightWidth: 0,
    borderRightColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 999,
  },
  ruleWrapText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#FC4277',
  },
  ruleWrapImg: {
    width: 6.6,
    height: 10.3,
    marginLeft: 2,
  },
});
