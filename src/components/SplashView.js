import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import SplashScreen from 'react-native-splash-screen';
import Layout from '../constants/Layout';
import store from '../store/configureStore';
import splashView from '../actions/splashView';

type Props = {
  splashImg: String,
  splashIcon: String,
  storeName: String,
  storeDesc: String,
};
export default class SplashView extends Component<Props> {
  static navigationOptions = {
    header: null,
  };

  flag = 3;

  componentDidMount() {
    SplashScreen.hide();
    this.onLoadEndImg();
  }

  onLoadEndImg = () => {
    const timer = setInterval(() => {
      if (this.flag < 1) {
        clearInterval(timer);
        store.dispatch(splashView({ showSplashView: false }));
      }
      this.flag -= 1;
    }, 1000);
  };

  closeSplash = () => {
    store.dispatch(splashView({ showSplashView: false }));
  };

  render() {
    const { splashImg, splashIcon, storeName, storeDesc } = this.props;
    const isIphoneX = Layout.device.deviceModel.indexOf('iPhone X') > -1;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <FastImage resizeMode={FastImage.resizeMode.cover} style={[styles.splashImg, { flex: 1 }]} source={splashImg ? { uri: splashImg } : require('@assets/splash-img1.png')} />
          <View style={[styles.splashIcon, { height: 126 }, isIphoneX ? { marginTop: 60 } : '']}>
            <FastImage resizeMode={FastImage.resizeMode.contain} style={{ width: 59, height: 59, borderRadius: 12 }} source={{ uri: splashIcon }} />
          </View>
          <View style={[styles.textWrap, { paddingTop: 122 }]}>
            <Text style={{ color: '#FF349E', fontSize: 37, fontFamily: 'FZZCHJW--GB1-0' }}>{storeName}</Text>
            <Text style={{ color: '#FF349E', fontSize: 14, fontFamily: 'PingFangSC-Medium', marginTop: 20 }}>{storeDesc}</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.skip, { top: global.statusBarHeight + 10 }]} onPress={this.closeSplash}>
          <Text style={{ color: '#fff', fontSize: 12 }}>跳过</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 11000,
    elevation: 11000,
  },
  splashImg: {
    width: '100%',
  },
  splashIcon: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skip: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    elevation: 100,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 60,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    alignItems: 'center',
  },
});
