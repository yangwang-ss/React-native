import React, { Component } from 'react';
import {
  StyleSheet, Text, View, StatusBar, FlatList,
} from 'react-native';
import SchoolItem from '../../components/SchoolItem';
import { getcommunityTab3List } from '../../services/api';
import Layout from '../../constants/Layout';

export default class SchoolTabDetail extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  });

  state = {
    dataSource: [],
    loadMoreText: '',
    loadingState: {
      loading: '加载中...',
      noMoreData: '-我是有底线的-',
      failure: '服务器有点烫，稍后再试',
      emptyData: '暂无数据',
    },
    params: {
      tagId: 0,
      currentPage: 1,
    },
  }

  componentDidMount() {
    const tagId = this.props.navigation.getParam('tagId', '');
    console.log('333333333', tagId);
    const params = {
      tagId,
      currentPage: 1,
    };
    this.getCommunityList(params);
  }

  // 上拉加载
  onFooterLoad = () => {
    const { params } = this.state;
    if (this.state.dataSource.length > 9) {
      this.getCommunityList(params);
      console.log('上拉加载===onFooterLoad', params);
    }
  };

  jumpArticleDetail= (item, index) => {
    console.log('jumpArticleDetail====', item);
    const arr = this.state.dataSource;
    arr[index].readNum += 1;
    this.props.navigation.navigate('WebView', {
      title: '商学院',
      showShare: true,
      mainTitle: item.title,
      subTitle: '',
      thumbImage: item.imgUrl,
      src: item.contentUrl,
      aid: item.id,
    });
    this.setState({
      dataSource: arr,
    });
  }

  // 接口请求
  async getCommunityList(params) {
    const { loadingState } = this.state;
    let loadMoreText = loadingState.loading;
    let { currentPage } = params;
    const res = await getcommunityTab3List(params);
    if (res && res.length) {
      currentPage++;
      this.setState({
        dataSource: [...this.state.dataSource, ...res],
        params: {
          ...params,
          currentPage,
        },
        loadMoreText: res.length > 9 ? loadingState.loading : loadingState.noMoreData,
      });
    } else if (this.state.dataSource.length > 0) {
      loadMoreText = loadingState.noMoreData;
    } else {
      loadMoreText = loadingState.emptyData;
    }
    this.setState({
      loadMoreText,
    });
  }

  // 类表渲染
  communityItem = (info) => {
    const isLine = (info.index === this.state.dataSource.length - 1);
    return (
      <SchoolItem
        index={info.index}
        info={info.item}
        isLine={isLine}
        jumpArticleDetail={this.jumpArticleDetail}
      />
    );
  };

  _keyExtractor = (item, index) => `${index}`;

  loadingText = () => {
    const { loadMoreText, dataSource } = this.state;
    if (loadMoreText && dataSource.length) {
      return (
        <Text style={styles.loadingText}>{dataSource.length > 9 ? loadMoreText : '-我是有底线的-'}</Text>
      );
    }
    return null;
  };

  render() {
    const { dataSource } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <FlatList
          data={dataSource}
          keyExtractor={this._keyExtractor}
          renderItem={this.communityItem}
          onEndReachedThreshold={0.1}
          onEndReached={this.onFooterLoad}
          ListFooterComponent={() => this.loadingText()}
          ListEmptyComponent={() => <Text style={styles.loadingText2}>暂无数据</Text>}
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
  },
  title: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#EA4457',
    marginTop: 12,
  },
  loadingText: {
    width: '100%',
    lineHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontFamily: 'PingFangSC-Regular',
  },
  loadingText2: {
    width: '100%',
    lineHeight: 350,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontFamily: 'PingFangSC-Regular',
  },
});
