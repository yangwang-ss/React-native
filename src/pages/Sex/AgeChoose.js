import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { getPersonLike } from '../../services/api';

export default class AgeChoose extends Component {
  static navigationOptions = ({ navigationOptions }) => {
    return {
      headerStyle: {
        ...navigationOptions.headerStyle,
        borderBottomWidth: 0,
        elevation: 0,
      },
    };
  };

  state = {
    personImg: {
      men: 'https://image.vxiaoke360.com/FmLvA9AVv9H52MJ1QJKbu3zUR8CR',
      women: 'https://image.vxiaoke360.com/FqkJ6CaLDsIf_7u3_ZJBF1gxMoLC',
    },
    sex: '1',
    info: {
      menName: '男',
      menEg: 'MAN',
      womenName: '女',
      womenEg: 'WOMEN',
    },
    btnBg: 'https://image.vxiaoke360.com/FgD9sBaAQi5-pBzF-RnKSFmKveat',
  };

  _keyExtractor = (item, index) => `${index}`;

  componentDidMount() {
    const sex = this.props.navigation.getParam('sex', '');
    this.setState({
      sex,
    });
  }

  /**
   * 接口请求
   */
  async handleChoose(value) {
    const params = {
      age: value,
      sex: this.state.sex,
    };
    const res = await getPersonLike(params);
    if (res) {
      this.props.navigation.reset([NavigationActions.navigate({ routeName: 'MainPage' })], 0);
    }
  }

  async jumpPage() {
    const params = {
      age: '',
      sex: this.state.sex,
    };
    const res = await getPersonLike(params);
    if (res) {
      this.props.navigation.navigate('MainPage');
    }
  }

  render() {
    const { sex, personImg, info, btnBg } = this.state;
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
            <Text style={styles.textColor}>年龄</Text>
          </Text>
        </View>
        <View style={styles.personWrap}>
          <TouchableOpacity style={styles.imgBox}>
            <Image style={styles.personImg} source={{ uri: sex === '1' ? personImg.men : personImg.women }} />
            <View style={styles.personMenPos}>
              <View style={styles.sexNameBox}>
                <Text style={styles.sexName}>{sex === '1' ? info.menName : info.womenName}</Text>
              </View>
              <Text style={styles.sexEg}>{sex === '1' ? info.menEg : info.womenEg}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.ageWrap}>
            <TouchableOpacity onPress={() => this.handleChoose('95')}>
              <ImageBackground style={styles.ageBox} source={{ uri: btnBg }} resizeMode="cover">
                <Text style={styles.ageText}>
                  <Text style={styles.textBold}>95</Text>后
                </Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleChoose('90')}>
              <ImageBackground style={styles.ageBox} source={{ uri: btnBg }} resizeMode="cover">
                <Text style={styles.ageText}>
                  <Text style={styles.textBold}>90</Text>后
                </Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleChoose('80')}>
              <ImageBackground style={styles.ageBox} source={{ uri: btnBg }} resizeMode="cover">
                <Text style={styles.ageText}>
                  <Text style={styles.textBold}>80</Text>后
                </Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleChoose('70')}>
              <ImageBackground style={styles.ageBox} source={{ uri: btnBg }} resizeMode="cover">
                <Text style={styles.ageText}>
                  <Text style={styles.textBold}>70</Text>后
                </Text>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handleChoose('-1')}>
              <ImageBackground style={styles.ageBox} source={{ uri: btnBg }} resizeMode="cover">
                <Text style={[styles.ageText, { fontSize: 14 }]}>都不是</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.jumpBtnWrap}>
          <TouchableOpacity onPress={() => this.jumpPage()} style={styles.jumpBtn}>
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
  ageWrap: {
    marginTop: 4,
  },
  ageBox: {
    width: 110,
    height: 48,
    marginBottom: 20,
  },
  ageText: {
    textAlign: 'center',
    lineHeight: 48,
    fontSize: 16,
    color: '#333',
    fontFamily: 'DINA',
  },
  textBold: {
    fontFamily: 'DINA',
    fontSize: 15,
  },
  personWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imgBox: {
    position: 'relative',
    marginRight: 36,
  },
  personImg: {
    width: 192,
    height: 338,
  },
  personMenPos: {
    alignItems: 'flex-end',
    position: 'absolute',
    top: 104,
    right: 64,
  },
  personWomenPos: {
    alignItems: 'flex-start',
    position: 'absolute',
    top: 104,
    left: 50,
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
