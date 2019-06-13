import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Image, ScrollView, AsyncStorage, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAssociationalWords, getSearchPrd, getSearchGuessLike } from '../../services/api';
import SortTab from '../../components/SortTab';
import PrdDoubleList from '../../components/PrdDoubleList';
import Layout from '../../constants/Layout';
import PrdColumnList from '../../components/PrdColumnList';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  loadingText: {
    width: Layout.window.width,
    lineHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
  },
  prdWrap: {
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  recommendPrdWrap: {
    flex: 1,
  },
  prdWrapBg: {
    backgroundColor: '#fff',
    marginBottom: 0,
    flex: 0,
  },
  recommendTitleBox: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendIcon: {
    width: 41,
    height: 5,
  },
  recommendTitle: {
    marginRight: 9,
    marginLeft: 9,
    color: '#333',
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
  },
  emptyImg: {
    width: 120,
    height: 120,
  },
  searchTipList: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 78,
    left: 0,
    backgroundColor: '#fff',
    zIndex: 999,
  },
  tipItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingRight: 24,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tipText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
  },
  tipIcon: {
    width: 13,
    height: 13,
    marginTop: 4,
  },
  backIcon: {
    marginTop: 4,
    paddingLeft: 20,
    paddingRight: 20,
  },
  searchWrap: {
    paddingTop: 30,
    flexDirection: 'row',
    paddingRight: 20,
    paddingBottom: 6,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  searchBox: {
    flex: 1,
    height: 32,
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
    flexDirection: 'row',
    padding: 8,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    marginTop: 1,
    padding: 0,
  },
  cancel: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    width: 18,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelIcon: {
    marginTop: -2,
  },
  recommendLabel: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
  },
  recommendItem: {
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
    marginRight: 12,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  recommendText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
    lineHeight: 24,
  },
  emptyWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 50,
  },
});

export default class SearchProduct extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    queryStr: '',
    inputValue: '',
    searchList: [],
    isSearchValue: false,
    hasCoupon: false,
    canSwitch: true,
    sortType: '',
    sortParams: '',
    sortTab: 0,
    pageNo: 1,
    loadMoreText: '',
    loadingState: {
      loading: '加载中...',
      noMoreData: '-我是有底线的-',
      failure: '好嗨哟，居然请求失败了 =.=!',
      emptyData: '抱歉！没有找到搜索的商品',
    },
    isEmpty: false,
    searchProduct: [],
    recommendProduct: [],
    isDouble: false,
    speList: [],
  };

  componentDidMount() {
    const value = this.props.navigation.getParam('value', '');
    this.wordsStorage(value);
    this.searchProduct(value);
  };

  _keyExtractor = (item, index) => `${index}`;

  backSearch = () => {
    this.props.navigation.goBack();
  };

  // 缓存搜索历史
  wordsStorage = value => {
    let wordsArr = [];
    AsyncStorage.getItem('historySearch').then(result => {
      wordsArr = JSON.parse(result) || [];
      wordsArr.map((item, index) => {
        if (item === value) {
          wordsArr.splice(index, 1);
        }
      });
      wordsArr.unshift(value);
      AsyncStorage.setItem('historySearch', JSON.stringify(wordsArr));
    });
  };

  // 清空搜索条件
  clearSearch = () => {
    this.setState({
      inputValue: '',
      searchList: [],
      isSearchValue: false,
    });
  };

  // 搜索框文字变化
  onChangeText = value => {
    this.setState({
      inputValue: value,
    });
    if (value.length) {
      this.getSearchTextList(value);
    } else {
      this.setState({
        searchList: [],
        isSearchValue: false,
      });
    }
  };

  // 输入框回车
  onSubmitEditing = () => {
    const { inputValue } = this.state;
    this.searchProduct(inputValue);
  };

  // 搜索商品
  searchProduct = value => {
    const data = {
      queryStr: value,
      sort: '',
      pageNo: 1,
    };
    this.setState(
      {
        isSearchValue: false,
        inputValue: value,
        searchProduct: [],
        sortTab: 0,
        sortType: '',
        ...data,
      },
      () => {
        this.getSearchProduct(data);
      }
    );
  };

  // 排序
  changeSort = (item, sortType, sortParams) => {
    if (item.sortIndex == 3) {
      this.setState({
        isDouble: !this.state.isDouble,
      });
      return;
    }
    const params = {
      sort: sortParams,
      pageNo: 1,
      queryStr: this.state.queryStr,
    };
    this.setState(
      {
        sortType,
        sortTab: item.sortIndex,
        sortParams,
        searchProduct: [],
        pageNo: 1,
      },
      () => {
        this.getSearchProduct(params);
      }
    );
  };

  changeTagQuan = () => {
    let { hasCoupon, canSwitch } = this.state;
    if (canSwitch) {
      hasCoupon = !hasCoupon;
      this.setState(
        {
          hasCoupon,
          pageNo: 1,
          searchProduct: [],
        },
        () => {
          const params = {
            pageNo: this.state.pageNo,
            queryStr: this.state.queryStr,
            sort: this.state.sortParams,
          };
          this.getSearchProduct(params);
        }
      );
    }
  };

  jumpDetail = item => {
    this.props.navigation.push('Detail', { pid: item.id });
  };

  // 上拉加载
  onFooterLoad = () => {
    const { searchProduct } = this.state;
    if (searchProduct.length < this.listLength) {
      let num = 20;
      if (this.totalList.length < 20) {
        num = this.totalList.length;
      }
      this.setState({
        searchProduct: [...searchProduct, ...this.totalList.splice(0, num)],
      });
      return;
    }
    if (this.hasMore) {
      this.hasMore = false;
      const params = {
        pageNo: this.state.pageNo,
        queryStr: this.state.queryStr,
        sort: this.state.sortParams,
      };
      console.log('上拉加载===onFooterLoad', params);
      this.getSearchProduct(params);
    }
  };

  /**
   * 接口请求
   */
  // 商品列表
  async getSearchProduct(params) {
    const { deviceId, deviceType } = Layout.device;
    const { loadingState, hasCoupon } = this.state;
    let loadMoreText = loadingState.loading;
    this.setState({
      loadMoreText,
      isEmpty: false,
      recommendProduct: [],
    });

    let { pageNo } = params;
    params.deviceValue = deviceId;
    params.deviceType = deviceType;
    params.hasCoupon = hasCoupon;
    params.pageSize = 100;
    console.log('getSearchProduct==params', params);
    const res = await getSearchPrd(params);
    let arr;
    if (res && res.list.length) {
      loadMoreText = '';
      const num = 20 - res.count;
      this.totalList = res.list;
      this.hasMore = true;
      if (res.list.length < 100) {
        console.log('......', res.list.length);
        this.hasMore = false;
        loadMoreText = loadingState.noMoreData;
      }
      if (pageNo === 1) {
        this.listLength = res.list.length;
      } else {
        this.listLength += res.list.length;
      }
      if (res.count > 0 && pageNo == 1) {
        pageNo++;
        arr = res.list.splice(0, res.count);
        //  console.log('7788', arr, res.list)
        this.setState({
          searchProduct: this.totalList.splice(0, num),
          speList: arr,
          pageNo,
        });
      } else {
        pageNo++;
        this.setState({
          searchProduct: [...this.state.searchProduct, ...this.totalList.splice(0, num)],
          pageNo,
        });
      }
    } else if (this.state.searchProduct.length > 0) {
      loadMoreText = loadingState.noMoreData;
    } else {
      this.setState({
        isEmpty: true,
      });
      loadMoreText = loadingState.emptyData;
      this.getGuessLike();
    }
    this.setState({
      canSwitch: true,
      loadMoreText,
    });
  }

  // 猜你喜欢列表
  async getGuessLike() {
    const { systemName, apnm, net } = Layout.device;
    let deviceNet = '';
    if (net.toLowerCase() === 'wifi') {
      deviceNet = 'wifi';
    } else if (net.toLowerCase() === 'none') {
      deviceNet = 'none';
    } else {
      deviceNet = 'cell';
    }
    const params = {
      os: systemName,
      apnm,
      net: deviceNet,
    };
    const res = await getSearchGuessLike(params);
    if (res) {
      this.setState({
        recommendProduct: res,
      });
    }
  }

  // 获取搜索联想词列表
  async getSearchTextList(params) {
    const res = await getAssociationalWords(params);
    if (res && res.length) {
      this.setState({
        searchList: res,
        isSearchValue: true,
      });
    } else {
      this.setState({
        isSearchValue: false,
      });
    }
  }

  /**
   * 元素渲染
   */
  // 推荐热词
  renderRecommendLabel = () => {
    const { searchList } = this.state;
    const arr = [];
    searchList.map((item, i) => {
      arr.push(
        <TouchableOpacity key={i} onPress={() => this.searchProduct(item)} style={styles.recommendItem}>
          <Text style={styles.recommendText}>{item}</Text>
        </TouchableOpacity>
      );
    });
    return arr;
  };

  // 搜索联想词列表
  renderSearchListItem = info => {
    const { item } = info;
    return (
      <TouchableOpacity style={styles.tipItem} onPress={() => this.searchProduct(item)}>
        <Text style={styles.tipText}>{item}</Text>
        <Image source={require('../../../assets/icon-search-arrow.png')} style={styles.tipIcon} />
      </TouchableOpacity>
    );
  };

  // 加载中文字
  loadingText = () => {
    const { loadMoreText } = this.state;
    if (loadMoreText) {
      return <Text style={styles.loadingText}>{loadMoreText}</Text>;
    }
    return null;
  };

  render() {
    const { inputValue, isSearchValue, searchList, isEmpty, sortType, sortTab, hasCoupon } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.searchWrap}>
          <TouchableOpacity onPress={this.backSearch} style={styles.backIcon}>
            <Ionicons name="ios-arrow-back" size={25} color="#666" />
          </TouchableOpacity>
          <View style={styles.searchBox}>
            <Image style={styles.searchIcon} source={require('../../../assets/icon-search2.png')} />
            <TextInput
              style={styles.searchInput}
              placeholder="请输入要搜索的商品名称"
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitEditing}
              returnKeyType="search"
              value={inputValue}
            />
            <TouchableOpacity style={styles.cancel} onPress={this.clearSearch}>
              <Ionicons style={styles.cancelIcon} name="ios-close" size={22} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
        {!isEmpty && (
          <View>
            <SortTab sortType={sortType} sortTab={sortTab} changeSort={this.changeSort} hasCoupon={hasCoupon} changeTagQuan={this.changeTagQuan} />
            {searchList.length > 0 && (
              <View style={{ width: '100%', backgroundColor: '#fff', paddingTop: 10 }}>
                <ScrollView contentContainerStyle={styles.recommendLabel} horizontal>
                  {this.renderRecommendLabel()}
                </ScrollView>
              </View>
            )}
          </View>
        )}
        {isSearchValue && (
          <View style={styles.searchTipList}>
            <FlatList data={searchList} keyboardShouldPersistTaps="handled" keyExtractor={this._keyExtractor} renderItem={this.renderSearchListItem} />
          </View>
        )}
        <View style={[styles.prdWrap, isEmpty && styles.prdWrapBg]}>
          {this.state.searchProduct.length || this.state.speList.length ? (
            <PrdColumnList list={this.state.searchProduct} jumpDetail={this.jumpDetail} onFooterLoad={this.onFooterLoad} loadingText={this.loadingText} speList={this.state.speList} />
          ) : null}
          {isEmpty && (
            <View style={styles.emptyWrap}>
              <Image style={styles.emptyImg} source={{ uri: 'http://family-img.vxiaoke360.com/no-search2.png' }} />
              <Text style={{ marginTop: 8, color: '#666' }}>抱歉！没有找到搜索的商品</Text>
            </View>
          )}
        </View>
        {this.state.recommendProduct.length > 0 && (
          <View style={[styles.prdWrap, styles.recommendPrdWrap]}>
            <View style={styles.recommendTitleBox}>
              <Image style={styles.recommendIcon} source={require('../../../assets/vip/line-left.png')} />
              <Text style={styles.recommendTitle}>为你推荐精选商品</Text>
              <Image style={styles.recommendIcon} source={require('../../../assets/vip/line-right.png')} />
            </View>
            <PrdDoubleList list={this.state.recommendProduct} jumpDetail={this.jumpDetail} onFooterLoad={() => null} />
          </View>
        )}
      </View>
    );
  }
}
