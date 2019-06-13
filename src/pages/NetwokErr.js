import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, FlatList, RefreshControl, NetInfo } from 'react-native';

export default class NetwokErr extends Component {
  static navigationOptions = {
    title: '网络错误',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  };

  state = {
    refreshing: false,
  };

  componentDidMount() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      console.log(`Initial, type: ${connectionInfo.type}, effectiveType: ${connectionInfo.effectiveType}`);
    });
    function handleFirstConnectivityChange(connectionInfo) {
      console.log(`First change, type: ${connectionInfo.type}, effectiveType: ${connectionInfo.effectiveType}`);
      NetInfo.removeEventListener('connectionChange', handleFirstConnectivityChange);
    }
    NetInfo.addEventListener('connectionChange', handleFirstConnectivityChange);
  }

  onPullRefresh() {
    this.setState({
      refreshing: true,
    });
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log(`onPullRefresh isConnected: ${isConnected ? 'online' : 'offline'}`);
      this.setState({
        refreshing: false,
      });
      if (isConnected) {
        this.props.navigation.goBack();
      }
    });
  }

  emptyComponent = () => {
    return (
      <View style={styles.emptyWrap}>
        <Image style={styles.emptyImg} source={require('@assets/network-error.png')} />
        <Text style={styles.emptyInfo}>你的网络不稳定喔，请稍后刷新重试</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          ListEmptyComponent={() => this.emptyComponent()}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onPullRefresh()} title="加载中..." tintColor="#EA4457" titleColor="#333" />}
        />
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
    justifyContent: 'center',
  },
  emptyWrap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImg: {
    width: 150,
    height: 150,
    marginTop: 100,
  },
  emptyInfo: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
