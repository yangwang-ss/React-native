import React, { Component } from 'react';
import { NavigationEvents } from 'react-navigation';
import { View } from 'react-native';
import VipIndex from './VipIndex';
import ShopVip from '../ShopVip/index';

export default class VipSwitch extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    isStore: false,
  };

  // componentDidMount() {
  //   this.props.navigation.setParams({ hasHeader: true });
  // }

  async init() {
    const userInfo =
      (await storage
        .load({
          key: 'userInfo',
        })
        .catch(e => e)) || {};
    console.log('isShop====', userInfo);
    this.setState({
      isStore: userInfo.isStore,
    });
    if (!userInfo.isStore) {
      this.refs.VipIndex.init();
    }
  }

  render() {
    const { isStore } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {!isStore ? <VipIndex navigation={this.props.navigation} ref="VipIndex" /> : null}
        {isStore ? <ShopVip navigation={this.props.navigation} /> : null}
        <NavigationEvents onDidFocus={() => this.init()} />
      </View>
    );
  }
}
