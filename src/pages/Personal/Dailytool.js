import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity, StatusBar,
} from 'react-native';

type Props = {};
export default class Dailytool extends Component<Props> {
  static navigationOptions = {
    title: '日常工具',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  }

  componentDidMount() {
    // const { params } = this.state;
    // this.onHeaderRefresh(params);
  }

  _keyExtractor = (item, index) => `${index}`;


  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.wrap}>
          <View style={styles.toolsWrap}>
            <Image style={styles.toolsWrapImg} />
            <View style={styles.toolsWrapText}>
              <Text style={styles.toolsText1}>手电筒</Text>
              <Text style={styles.toolsText2}>一道光明</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.loadBtn}>前往下载</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.wrap}>
          <View style={styles.toolsWrap}>
            <Image style={styles.toolsWrapImg} />
            <View style={styles.toolsWrapText}>
              <Text style={styles.toolsText1}>手电筒</Text>
              <Text style={styles.toolsText2}>一道光明</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.loadBtn}>前往下载</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
  },
  wrap: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    height: 76,
    borderBottomWidth: 0.5,
    borderBottomColor: '#efefef',
    alignItems: 'center',
  },
  toolsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolsWrapImg: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#999',
  },
  toolsWrapText: {
    marginLeft: 12,
  },
  toolsText1: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333',
  },
  toolsText2: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  loadBtn: {
    width: 66,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#EA4457',
    backgroundColor: '#fff',
    height: 30,
    borderRadius: 15,
    lineHeight: 30,
    textAlign: 'center',
    borderWidth: 0.5,
    borderColor: '#EA4457',
  },
});
