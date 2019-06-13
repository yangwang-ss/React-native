import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import VipIndex from './VipIndex';

export default class VipIndexPage extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return <VipIndex navigation={this.props.navigation} />;
  }
}
