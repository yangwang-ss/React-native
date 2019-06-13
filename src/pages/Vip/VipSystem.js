/* eslint-disable default-case */
import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, ScrollView, StatusBar } from 'react-native';
import FastImage from 'react-native-fast-image';
import Layout from '../../constants/Layout';

export default class OrderConfirm extends Component {
  static navigationOptions = {
    title: '米粒会员制度',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  };

  state = {
    titleH: 0,
    formH: 0,
    textH: 0,
    iconTop: 46,
    showIcon: false,
  };

  /**
   * 事件绑定
   */
  getImgH = async () => {
    const imgList = ['https://image.vxiaoke360.com/vipsystem-title.png', 'https://image.vxiaoke360.com/vipsystem-form2.png', 'https://image.vxiaoke360.com/vipsystem-text2.png'];
    const screenWidth = Layout.window.width;
    const getImgH = uri =>
      new Promise((resolve, reject) => {
        console.log('uri===', uri);
        Image.getSize(uri, (width, height) => {
          const imgH = Math.floor((screenWidth / width) * height);
          resolve(imgH);
        });
      });
    const titleH = await getImgH(imgList[0]);
    const formH = await getImgH(imgList[1]);
    const textH = await getImgH(imgList[2]);
    this.setState({ titleH, formH, textH });
  };

  setVipType = vipType => {
    let iconTop = 46;
    const screenWidth = Layout.window.width;
    if (vipType === 0) {
      iconTop = Math.floor((screenWidth / 375) * 46);
    }
    if (vipType === 30) {
      iconTop = Math.floor((screenWidth / 375) * 92);
    }
    if (vipType === 40) {
      iconTop = Math.floor((screenWidth / 375) * 138);
    }
    this.setState({ iconTop, showIcon: vipType <= 40 });
  };

  componentWillMount() {
    this.getImgH();
  }

  componentDidMount() {
    const vipType = +this.props.navigation.getParam('vipType', 0);
    this.setVipType(vipType);
  }

  render() {
    const { titleH, formH, textH, iconTop, showIcon } = this.state;
    return (
      <View>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
          <FastImage style={[styles.vipTitle, { height: titleH }]} resizeMode={FastImage.resizeMode.contain} source={require('../../../assets/vip/vipsystem-title.png')} />
          <View style={styles.vipLevelWrap}>
            {showIcon ? (
              <View style={[styles.vipLevelIcon, { top: iconTop }]}>
                <Text style={styles.vipLevelText}>我的等级</Text>
                <View style={styles.arrowDown} />
              </View>
            ) : null}
            <FastImage style={[styles.vipForm, { height: formH }]} resizeMode={FastImage.resizeMode.contain} source={require('../../../assets/vip/vipsystem-form.png')} />
          </View>
          <FastImage style={[styles.vipText, { height: textH }]} resizeMode={FastImage.resizeMode.contain} source={require('../../../assets/vip/vipsystem-text.png')} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3A3F53',
  },
  vipLevelWrap: {
    position: 'relative',
    width: '100%',
  },
  vipLevelIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 52,
    height: 16,
    position: 'absolute',
    top: 46,
    left: 10,
    zIndex: 3,
    elevation: 3,
    backgroundColor: '#3A3F53',
    borderRadius: 8,
  },
  vipLevelText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#F0E4C4',
  },
  vipTitle: {
    width: '90%',
    marginTop: 30,
    marginBottom: 8,
  },
  vipForm: {
    width: '99%',
    alignSelf: 'center',
  },
  vipText: {
    width: '90%',
    marginTop: 17,
    marginBottom: 26,
  },
  btnSystemWrap: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    width: '100%',
    zIndex: 9,
    elevation: 9,
    paddingLeft: 16,
    paddingRight: 16,
  },
  btnSystem: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  btnSystemText: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 18,
    color: '#8B572A',
  },
  btnChannelWrap: {
    marginBottom: 90,
  },
  btnChannelText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#FFCA80',
  },
  arrowDown: {
    position: 'absolute',
    top: 14,
    left: '50%',
    marginLeft: -4,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderTopColor: '#3A3F53',
    borderRightWidth: 4,
    borderRightColor: 'transparent',
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    borderBottomWidth: 6,
    borderBottomColor: 'transparent',
  },
});
