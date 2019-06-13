import React, { Component } from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList, Image, StatusBar } from 'react-native';
import LoadingText from '@components/LoadingText';
import GoodsSaleItem from '@components/GoodsSaleItem';
import { getGoodsSaleUserList, getGoodsSaleDetail } from '../../services/api';

export default class GoodsSaleDetail extends Component {
  static navigationOptions = {
    title: '商品销售数据',
  };

  state = {
    goodsInfo: {
      goodsVO: {},
    },
    dataList: [],
    loadingState: '',
    currentPage: 1,
    pid: '',
  };

  componentDidMount() {
    const pid = this.props.navigation.getParam('id', '');
    this.setState({
      pid,
    });
    this.onHeaderRefresh();
  }

  // 下拉刷新
  onHeaderRefresh = () => {
    console.log('下拉刷新===onHeaderRefresh');
    this.canLoadMore = false;
    this.setState(
      {
        currentPage: 1,
        dataList: [],
        goodsInfo: {
          goodsVO: {},
        },
      },
      () => {
        this.getGoodsSaleList();
        this.getGoodsSaleDetail();
      }
    );
  };

  // 上拉加载
  onFooterLoad = () => {
    console.log('上拉加载===onFooterLoad');
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getGoodsSaleList();
    }
  };

  /**
   * 接口请求
   */
  async getGoodsSaleList() {
    const { currentPage, pid } = this.state;
    let loadingState = 'loading';
    let page = currentPage;
    this.setState({ loadingState });
    const params = {
      currentPage,
      pid,
    };
    const res = await getGoodsSaleUserList(params);

    if (res && res.length) {
      page++;
      this.canLoadMore = true;
      this.setState({
        dataList: [...this.state.dataList, ...res],
        currentPage: page,
        loadingState: '',
      });
    } else {
      if (this.state.dataList.length > 0) {
        loadingState = 'noMoreData';
      } else {
        loadingState = 'empty';
      }
      this.setState({
        loadingState,
      });
    }
  }

  async getGoodsSaleDetail() {
    const { pid } = this.state;
    const res = await getGoodsSaleDetail(pid);
    if (res) {
      this.setState({
        goodsInfo: res,
      });
    }
  }

  _keyExtractor = (item, index) => `${index}`;

  loadingText = () => {
    const { loadingState } = this.state;
    return <LoadingText loading={loadingState} />;
  };

  saleItem = info => {
    return <GoodsSaleItem item={info.item} />;
  };

  render() {
    const {
      dataList,
      goodsInfo,
      goodsInfo: { goodsVO },
    } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
        <View style={styles.goodsInfoWrap}>
          <Image style={styles.goodsImg} source={{ uri: goodsVO.thumbnail }} />
          <View style={styles.goodsInfo}>
            <Text style={styles.title}>{goodsVO.title}</Text>
            <View style={styles.priceWrap}>
              <Text style={styles.priceIcon}>￥</Text>
              <Text style={styles.priceText}>{goodsVO.discountPrice}</Text>
            </View>
          </View>
        </View>
        <View style={styles.dataWrap}>
          <View>
            <Text style={styles.dataText}>{goodsInfo.pvNum}</Text>
            <Text style={styles.dataTitle}>总曝光</Text>
          </View>
          <View>
            <Text style={styles.dataText}>{goodsInfo.uvNum}</Text>
            <Text style={styles.dataTitle}>用户数</Text>
          </View>
          <View>
            <Text style={styles.dataText}>{goodsInfo.volume}</Text>
            <Text style={styles.dataTitle}>销量</Text>
          </View>
        </View>
        <FlatList
          data={dataList}
          keyExtractor={this._keyExtractor}
          renderItem={this.saleItem}
          onEndReachedThreshold={0.1}
          onEndReached={this.onFooterLoad}
          ListFooterComponent={() => this.loadingText()}
          refreshControl={<RefreshControl refreshing={false} onRefresh={this.onHeaderRefresh} title="加载中..." />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  goodsInfoWrap: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 8,
    padding: 12,
  },
  goodsImg: {
    width: 90,
    height: 90,
    borderRadius: 4,
    marginRight: 8,
  },
  goodsInfo: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-between',
    flexWrap: 'wrap',
  },
  title: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    width: '100%',
  },
  priceWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    height: 25,
  },
  priceIcon: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FC4277',
    marginBottom: 3,
  },
  priceText: {
    fontFamily: 'DINAlternate-Bold',
    fontSize: 22,
    color: '#FC4277',
  },
  dataWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#EFEFEF',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 44,
    paddingRight: 44,
    backgroundColor: '#fff',
  },
  dataText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  dataTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
