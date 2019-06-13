import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import * as CacheManager from 'react-native-http-cache';
import { refreshUserInfo } from '../../services/api';

export default class Settings extends Component {
  static navigationOptions = {
    title: '设置',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  };

  state = {
    userInfo: {},
    cacheSize: '0B',
  };

  bytesToSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes < 160000) return '0B';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return `${bytes} ${sizes[i]}`;
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  componentDidMount() {
    this.getCacheSize();
  }

  async getCacheSize() {
    const cacheSize = await CacheManager.getCacheSize();
    this.setState({
      cacheSize: this.bytesToSize(cacheSize),
    });
  }

  jumpAbout() {
    this.props.navigation.navigate('About');
  }

  logOut() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Auth' })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  clearCache() {
    CacheManager.clearCache();
    this.getCacheSize();
  }

  async getTaoBaoNick() {
    const { taobaoUserId, tbOAuthUrl } =
      (await storage
        .load({
          key: 'userInfo',
        })
        .catch(e => e)) || {};
    if (!taobaoUserId) {
      this.props.navigation.navigate('WebView', {
        src: tbOAuthUrl,
        refresh: () => {
          this.init();
        },
      });
    }
  }

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const { cacheSize } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.mesgWrap}>
          <Text style={styles.mesgLeft}>接受消息提醒</Text>
          <Text style={styles.mesgRight} />
          {/* <Text style={styles.mesgRight}>已关闭</Text> */}
        </View>
        <View style={styles.box2}>
          {/* <Text style={styles.box2Left}>如果你要关闭或开启消息提醒，请在“设置”-“通知”功能中，找到“米粒生活”更改,  <Text style={styles.box2Right}>去更改</Text><Image style={styles.box2Img} source={require('../../../assets/icon-red-more.png')}/></Text> */}
          <Text style={styles.box2Left}>如果你要关闭或开启消息提醒，请在“设置”-“通知”功能中，找到“米粒生活”更改</Text>
        </View>
        <TouchableOpacity style={[styles.mesgWrap, styles.mesgWrap2]} activeOpacity={0.85} onPress={() => this.clearCache()}>
          <Text style={styles.mesgLeft}>清除缓存</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.mesgLeft}>{cacheSize}</Text>
            <Image style={styles.box2Img} source={require('../../../assets/icon-gray-more.png')} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mesgWrap, styles.mesgWrap2]} activeOpacity={0.85} onPress={() => this.jumpAbout()}>
          <Text style={styles.mesgLeft}>关于我们</Text>
          <Image style={styles.box2Img} source={require('../../../assets/icon-gray-more.png')} />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={()=> this.logOut()}>
          <Text style={styles.outBtn}>退出登录</Text>
        </TouchableOpacity>   */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f4f4',
  },
  mesgWrap: {
    width: '100%',
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16,
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mesgLeft: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
  },
  mesgRight: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#999',
  },
  outBtn: {
    width: '100%',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#EA4457',
    backgroundColor: '#fff',
    marginTop: 24,
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
  },
  box2: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    flexDirection: 'row',
  },
  box2Img: {
    width: 6.5,
    height: 10,
    marginLeft: 4,
  },
  box2Left: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  box2Right: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#EA4457',
  },
  mesgWrap2: {
    marginTop: 12,
  },
});
