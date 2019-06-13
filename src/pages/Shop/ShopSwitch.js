/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import LoadingIcon from '@components/LoadingIcon';
import { NavigationEvents } from 'react-navigation';
import { judgeShopPage } from '../../services/api';
import ShopList from './ShopList';
import ShopDetail from './ShopDetail';

export default class ShopSwitch extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    pageObj: {},
    showLoading: true,
  };

  isFirst = true;

  init() {
    this.getSwitch();
    const { pageObj } = this.state;
    if (pageObj.type === 1) {
      this.refs.ShopDetail.init(pageObj.value);
    }
  }

  // 接口
  async getSwitch() {
    const res = await judgeShopPage();
    console.log('店铺入口判断', res);
    if (res) {
      this.setState({
        pageObj: res,
        showLoading: false,
      });
      if (!this.isFirst) {
        if (this.oldType === res.type) {
          return false;
        }
        this.oldType = res.type;
      } else {
        this.oldType = res.type;
      }
      this.isFirst = false;
      if (res.type === 2) {
        this.refs.ShopList.init();
      }
    } else {
      this.setState({
        showLoading: false,
        pageObj: { type: 0 },
      });
    }
  }

  _keyExtractor = (item, index) => `${index}`;

  onMessage(e) {
    let { data } = e.nativeEvent;
    if (data) {
      try {
        data = JSON.parse(data);
      } catch (err) {
        console.log(err);
        return;
      }
      if (data.type === 'jumpPage') {
        const { title, url } = data.info;
        this.refs.webView.reload();
        this.props.navigation.navigate('WebView', { title, src: `${url}?isApp=1`, disabledReload: true, isUpload: true });
      }
    }
  }

  render() {
    const injectedJavascript = `(function() {
      window.postMessage = function(data) {
        window.ReactNativeWebView.postMessage(data);
      };
    })()`;
    const { pageObj, hasLoad, showLoading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {pageObj.type === 2 ? <ShopList navigation={this.props.navigation} ref="ShopList" /> : null}
        {pageObj.type === 1 ? <ShopDetail navigation={this.props.navigation} hideBack shopId={pageObj.value} ref="ShopDetail" /> : null}
        {pageObj.type === 0 ? (
          <View style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
            <View style={[styles.headerWrap, { height: global.headerHeight, zIndex: 10, elevation: 10, paddingTop: global.statusBarHeight }]}>
              <Text style={styles.headerText}>店长特别版</Text>
            </View>
            <WebView
              ref="webView"
              source={{ uri: 'https://family-h5.vxiaoke360.com/h5-mlsh-store/index.html#/storeInroduce?isApp=1' }}
              useWebKit
              injectedJavaScript={injectedJavascript}
              onMessage={e => this.onMessage(e)}
            />
          </View>
        ) : null}
        <LoadingIcon showLoading={showLoading} />
        <NavigationEvents onDidFocus={() => this.init()} />
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
  headerWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  headerText: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 18,
    color: '#333333',
  },
});
