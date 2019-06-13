import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, FlatList, RefreshControl } from 'react-native';
import UserList from './components/userList';
import { todtayUsers } from '../../services/api';

export default class UserLogged extends Component {
  static navigationOptions = {
    title: '今日登录用户',
  };

  constructor() {
    super();
    this.state = {
      showEmpty: false,
      userLists: [],
      curPage: 1,
      loadMoreText: '',
    };
  }

  renderList(item) {
    return <UserList listItem={item} />;
  }

  componentDidMount() {
    this.getUsers(1);
  }

  // 下拉刷新
  onHeaderRefresh = () => {
    console.log('下拉刷新===onHeaderRefresh');
    this.setState(
      {
        userLists: [],
        curPage: 1,
        loadMoreText: '',
      },
      () => {
        this.getUsers(1);
      }
    );
    this.canLoadMore = false;
  };

  // 上拉加载
  onFooterLoad = () => {
    const { curPage } = this.state;
    console.log('上拉加载===onFooterLoad');
    console.log('curPage', curPage);
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getUsers(curPage);
    }
  };

  loadingText = () => {
    const { loadMoreText } = this.state;
    return <Text style={styles.loadingText}>{loadMoreText}</Text>;
  };

  async getUsers(params) {
    const { userLists } = this.state;
    const res = await todtayUsers(params);
    let curPage = params;
    if (res && res.length) {
      curPage++;
      this.canLoadMore = true;
      this.setState({
        userLists: [...userLists, ...res],
        curPage,
        loadMoreText: res.length > 9 ? '加载中' : '—我是有底线的—',
      });
    } else {
      let loadMoreText = '';
      if (this.state.userLists.length > 0) {
        loadMoreText = '—我是有底线的—';
      } else {
        loadMoreText = '';
      }
      this.setState({
        loadMoreText,
        showEmpty: true,
      });
    }
  }

  emptyComponent() {
    const { showEmpty } = this.state;
    if (showEmpty) {
      return (
        <View style={styles.emptyWrap}>
          <Image style={styles.emptyImg} resizeMode="center" source={{ uri: 'http://family-img.vxiaoke360.com/search-empty.png' }} />
          <Text style={styles.emptyInfo}>暂无用户登录</Text>
        </View>
      );
    }
    return null;
  }

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const { userLists } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={userLists}
          onEndReachedThreshold={0.1}
          onEndReached={this.onFooterLoad}
          ListFooterComponent={() => this.loadingText()}
          keyExtractor={this._keyExtractor}
          renderItem={({ item }) => this.renderList(item)}
          ListEmptyComponent={() => this.emptyComponent()}
          refreshControl={<RefreshControl refreshing={false} onRefresh={this.onHeaderRefresh} title="加载中..." />}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingLeft: 19,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 12,
    color: '#999',
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
