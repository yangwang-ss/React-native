import React, { Component } from 'react';
import {
  StyleSheet, View, FlatList, StatusBar
} from 'react-native';
import DrawList from '../../components/DrawList';
import EmptyState from '../../components/EmptyState';
import LoadingText from '../../components/LoadingText';
import { drawDetails } from '../../services/api';

export default class DrawDetail extends Component {
  static navigationOptions = {
    title: '余额明细',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  }

  state = {
    pList: [],
    currentPage: 1,
    loadingState: '',
    isEmpty: false,
  }

  componentDidMount() {
    this.getList(1);
  }

  // 上拉加载
  onFooterLoad = () => {
    const { currentPage } = this.state;
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getList(currentPage);
    }
  };

  /**
   * 接口请求
   */
  async getList(page) {
    let loadingState = 'loading';
    this.setState({
      loadingState,
      isEmpty: false,
    });

    let currentPage = page;
    const res = await drawDetails(page);
    if (res && res.list && res.list.length) {
      currentPage++;
      this.canLoadMore = true;
      this.setState({
        pList: [...this.state.pList, ...res.list],
        currentPage,
        loadingState: '',
      });
    } else {
      if (this.state.pList.length > 0) {
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

  _keyExtractor = (item, index) => `${index}`;

  renderList(item) {
    return <DrawList detail={item} />;
  }

  emptyState = () => {
    return (
      <View style={styles.empty}>
        <EmptyState />
      </View>
    );
  };

  loadingText = () => {
    const { loadingState, pList } = this.state;
    if (pList.length > 0) {
      return (
        <LoadingText loading={loadingState} />
      );
    }
    return null;
  };

  render() {
    const { isEmpty } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        {
          this.state.pList.length > 0 && (
            <FlatList
              style={styles.flatWrap}
              data={this.state.pList}
              keyExtractor={this._keyExtractor}
              renderItem={item => this.renderList(item)}
              onEndReachedThreshold={0.2}
              onEndReached={this.onFooterLoad}
              ListFooterComponent={() => this.loadingText()}
            />
          )
        }
        {
          isEmpty && (
            this.emptyState()
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  flatWrap: {
    flex: 1,
  },
  empty: {
    marginTop: 80,
    flex: 1,
  },
});
