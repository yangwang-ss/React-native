import React, { Component } from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import VipIndex from './VipIndex';

export default class VipPage extends Component {
  static navigationOptions = {
    header: null,
  }

  render() {
    return (
      <View>
        <StatusBar barStyle="light-content" />
        <VipIndex navigation={this.props.navigation} showBackBtn />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
