import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default class SexChoose extends Component {
  static navigationOptions = ({ navigationOptions }) => {
    return {
      headerStyle: {
        ...navigationOptions.headerStyle,
        borderBottomWidth: 0,
        elevation: 0,
      },
    };
  };

  jumpPage = () => {
    this.props.navigation.navigate('MainPage');
  };

  handleChoose = value => {
    this.props.navigation.navigate('AgeChoose', { sex: value });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.describeBox}>
          <Text style={styles.describeInfo}>
            只需
            <Text style={styles.textColor}>2步</Text>
            ，发现更适合自己的好货
          </Text>
          <Text style={styles.describeText}>
            选择
            <Text style={styles.textColor}>性别</Text>
          </Text>
        </View>
        <View style={styles.personWrap}>
          <TouchableOpacity onPress={() => this.handleChoose('1')} style={[styles.imgBox, styles.imgBoxMargin]}>
            <Image style={[styles.personImg, styles.personImgAct]} source={{ uri: 'https://image.vxiaoke360.com/Fp6zXos5csQDjKfohFuQ8XgeXfDh' }} />
            <View style={[styles.personDes, styles.personMenPos]}>
              <View style={styles.sexNameBox}>
                <Text style={styles.sexName}>男</Text>
              </View>
              <Text style={styles.sexEg}>MEN</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.handleChoose('2')} style={styles.imgBox}>
            <Image style={styles.personImg} source={{ uri: 'https://image.vxiaoke360.com/FrEgkircFLo9npcgXqHSxkMTwMt3' }} />
            <View style={[styles.personDes, styles.personWomenPos]}>
              <View style={styles.sexNameBox}>
                <Text style={styles.sexName}>女</Text>
              </View>
              <Text style={styles.sexEg}>WOMEN</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.jumpBtnWrap}>
          <TouchableOpacity onPress={this.jumpPage} style={styles.jumpBtn}>
            <Text style={styles.jumpBtnText}>跳过</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  personWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imgBox: {
    position: 'relative',
  },
  imgBoxMargin: {
    marginRight: 6,
  },
  personImg: {
    width: 174,
    height: 320,
    marginTop: 6,
  },
  personImgAct: {
    width: 192,
    height: 338,
    marginTop: 0,
  },
  personDes: {
    alignItems: 'flex-end',
    position: 'absolute',
  },
  personMenPos: {
    top: 104,
    right: 64,
  },
  personWomenPos: {
    top: 104,
    left: 50,
    alignItems: 'flex-start',
  },
  sexNameBox: {
    borderBottomColor: '#fff',
    borderBottomWidth: 0.5,
    paddingBottom: 2,
    marginBottom: 2,
  },
  sexName: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'DINA',
  },
  sexEg: {
    fontSize: 13,
    color: '#fff',
    fontFamily: 'DINA',
  },
  describeBox: {
    marginTop: 28,
    marginBottom: 32,
  },
  describeInfo: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 15,
    textAlign: 'center',
    color: '#333',
    lineHeight: 22,
  },
  describeText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 22,
    textAlign: 'center',
    color: '#333',
    lineHeight: 44,
  },
  textColor: {
    color: '#FC3F7F',
  },
  jumpBtnWrap: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    bottom: 40,
  },
  jumpBtn: {
    width: 70,
    height: 30,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#999',
    marginRight: 15,
  },
  jumpBtnText: {
    fontFamily: 'PingFangSC-Regular',
    color: '#999',
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 12,
  },
});
