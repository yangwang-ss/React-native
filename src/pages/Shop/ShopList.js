import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, FlatList, RefreshControl } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShopListItem from '../../components/ShopListItem';
import LoadingText from '../../components/LoadingText';
import { shopList } from '../../services/api';

export default class ShopList extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    pList: [],
    loadingState: 'noMoreData',
    refreshing: true,
  };

  onHeaderRefresh = () => {
    this.getList();
  };

  init() {
    this.getList();
  }

  // 事件
  jumpDetail = id => {
    this.props.navigation.navigate('ShopDetail', { shopId: id });
  };

  // 业务
  renderList(ele) {
    const { item, index } = ele;
    if (item) {
      return <ShopListItem data={item} jumpDetail={this.jumpDetail} index={index} />;
    }
    return null;
  }

  // 接口请求
  async getList() {
    const res = await shopList();
    if (res && res.length) {
      this.setState({
        pList: res,
        refreshing: false,
      });
    }
  }

  // 功能函数
  _keyExtractor = (item, index) => `${index}`;

  loadingText = () => {
    const { loadingState } = this.state;
    return <LoadingText loading={loadingState} />;
  };

  render() {
    const { pList, refreshing } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#FF2798', '#FF2D69']} style={[styles.headerWrap, { height: global.headerHeight, paddingTop: global.statusBarHeight }]}>
          <Text style={styles.headerText}>门店</Text>
        </LinearGradient>
        {pList.length ? (
          <FlatList
            data={pList}
            keyExtractor={this._keyExtractor}
            renderItem={(item) => this.renderList(item)}
            onEndReachedThreshold={0.2}
            onEndReached={this.onFooterLoad}
            ListFooterComponent={() => this.loadingText()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onHeaderRefresh} />}
          />
        ) : null}
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
  },
  headerText: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 18,
    color: '#fff',
  },
});
