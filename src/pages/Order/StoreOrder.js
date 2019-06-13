import React, { Component } from 'react';
import {
  StyleSheet, View, RefreshControl, FlatList, StatusBar,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import OrderItem from '@components/OrderItem';
import ReceivingModal from '@components/ReceivingModal';
import NoOrder from '@components/NoOrder';
import LoadingText from '@components/LoadingText';
import { getStoreOrderList, getReceiving } from '../../services/api';

export default class StoreOrder extends Component {
  static navigationOptions = {
    title: '门店订单',
  }

  state = {
    list: [],
    loadingState: '',
    currentPage: 1,
    isEmpty: false,
    isReceivingModal: false,
    receivingId: '',
  };

  init = () => {
    this.onHeaderRefresh();
  };

  isReceiving = (id) => {
    this.setState({
      receivingId: id,
      isReceivingModal: true,
    });
  };

  cancelAlert = () => {
    this.setState({
      isReceivingModal: false,
    });
  };

  jumpDetail = (id) => {
    this.props.navigation.navigate('StoreOrderDetail', { id })
  };

  // 下拉刷新
  onHeaderRefresh = () => {
    console.log('下拉刷新===onHeaderRefresh');
    this.canLoadMore = false;
    this.setState({
      currentPage: 1,
      list: [],
    }, () => {
      this.getStoreOrderList();
    });
  };

  // 上拉加载
  onFooterLoad = () => {
    console.log('上拉加载===onFooterLoad');
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getStoreOrderList();
    }
  };

  /**
   * 接口请求
   */
  async getStoreOrderList() {
    const { currentPage } = this.state;
    let page = currentPage;
    let loadingState = 'loading';
    this.setState({ loadingState });
    const res = await getStoreOrderList(page);

    if (res && res.length) {
      page++;
      this.canLoadMore = true;
      this.setState({
        list: [...this.state.list, ...res],
        currentPage: page,
        loadingState: '',
      });
    } else {
      if (this.state.list.length > 0) {
        loadingState = 'noMoreData';
      } else {
        this.setState({
          isEmpty: true,
        });
        loadingState = '';
      }
      this.setState({
        loadingState,
      });
    }
  }

  async receiving() {
    const { receivingId } = this.state;
    const res = await getReceiving(receivingId);
    if (res) {
      this.setState({
        isReceivingModal: false,
      });
      this.onHeaderRefresh();
    }
  }

  _keyExtractor = (item, index) => `${index}`;

  loadingText = () => {
    const { loadingState, list } = this.state;
    if (list.length > 0) {
      return (
        <LoadingText loading={loadingState} />
      );
    }
    return null;
  };

  orderItem = (info) => {
    return (
      <OrderItem
        index={info.index}
        info={info.item}
        isStore
        isReceiving={this.isReceiving}
        jumpDetail={this.jumpDetail}
      />
    );
  };

  render() {
    const { list, isEmpty, isReceivingModal } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
        {
          list.length > 0 && (
            <FlatList
              data={list}
              keyExtractor={this._keyExtractor}
              renderItem={this.orderItem}
              onEndReachedThreshold={0.1}
              onEndReached={this.onFooterLoad}
              ListFooterComponent={() => this.loadingText()}
              refreshControl={(
                <RefreshControl
                  refreshing={false}
                  onRefresh={this.onHeaderRefresh}
                  title="加载中..."
                />
              )}
            />
          )
        }
        <NoOrder isEmpty={isEmpty} text="暂无订单喔，快去下单吧~" />
        <ReceivingModal
          isReceivingModal={isReceivingModal}
          receiving={this.receiving.bind(this)}
          cancelAlert={this.cancelAlert}
        />
        <NavigationEvents onDidFocus={() => this.init()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    flex: 1,
  },
});
