import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, StatusBar, TouchableWithoutFeedback,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { version } from '../../../package';
import store from '../../store/configureStore';
import common from '../../actions/common';

export default class About extends Component {
  static navigationOptions = {
    title: '关于我们',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  }

  componentDidMount() {

  }

  num = 1

  openGodModel() {
    if (this.num === 10) {
      store.dispatch(common(true));
      this.num = 1;
    }
    this.num += 1;
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <TouchableWithoutFeedback onPress={() => this.openGodModel()}>
          <Image style={styles.Img} source={{ uri: 'http://family-img.vxiaoke360.com/about-icon-app.png' }} />
        </TouchableWithoutFeedback>
        <Text style={styles.title}>米粒生活</Text>
        <Text style={styles.version}>
v
          {version}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    position: 'relative',
  },
  Img: {
    width: 68,
    height: 68,
    marginTop: 48,
    borderRadius: 10,
  },
  title: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#EA4457',
    marginTop: 12,
  },
  version: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999999',
  },


});
