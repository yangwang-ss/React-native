import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import CheckPendingItem from '../../components/CheckPendingItem';
import { getSalesManCheckPending } from '../../services/api';

export default class CheckPending extends Component {
  static navigationOptions = {
    title: '待审核',
  };

  state = {
    userLists: [],
    pageNum: 1,
    loadingState: '',
    isEmpty: false,
  };

  componentDidMount() {
    this.onHeaderRefresh();
  }

  // 下拉刷新
  onHeaderRefresh = () => {
    this.canLoadMore = false;
    const page = 1;
    this.setState(
      {
        pageNum: page,
        userLists: [],
      },
      () => {
        this.getList(page);
      }
    );
  };

  // 上拉加载
  onFooterLoad = () => {
    const { pageNum } = this.state;
    console.log('上拉加载===onFooterLoad');
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getList(pageNum);
    }
  };

  async getList(pageNum) {
    let loadingState = 'loading';
    let curPage = pageNum;
    this.setState({
      loadingState,
      isEmpty: false,
    });

    const res = await getSalesManCheckPending(pageNum);
    if (res && res.list && res.list.length > 0) {
      curPage++;
      this.canLoadMore = true;
      this.setState({
        userLists: [...this.state.userLists, ...res.list],
        pageNum: curPage,
        loadingState: '',
      });
    } else {
      if (this.state.userLists.length > 0) {
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

  render() {
    const { userLists, isEmpty, loadingState } = this.state;
    return (
      <View style={styles.container}>
        <CheckPendingItem
          userLists={userLists}
          isEmpty={isEmpty}
          loadingState={loadingState}
          onFooterLoad={this.onFooterLoad}
          onHeaderRefresh={this.onHeaderRefresh}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    flex: 1,
  },
});
