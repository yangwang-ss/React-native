import React from 'react';
import {
  StyleSheet,
  Text, View, Image,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Layout from '../../constants/Layout';
import RechargeItem from '../../components/RechargeItem';
import LoadingText from '../../components/LoadingText';
import { getChargeSearch } from '../../services/api';

export default class RechargeList extends React.Component {
  static navigationOptions = {
    title: '充值中心',
  };

  state = {
    refreshing: false,
    hasMore: true,
    pageNo: 1,
    pageSize: 10,
    queryStr: '',
    loadingState: 'loading',
    list: [],
  };

  /**
   * 事件绑定
   */
  jumpDetail = (item) => {
    this.props.navigation.navigate('Detail', { pid: item.id });
  };

  // 搜索商品
  searchProduct = (value) => {
    const data = {
      queryStr: value,
      pageNo: 1,
    };
    this.setState({
      list: [],
      ...data,
    }, () => {
      this.getSearchProduct(data);
    });
  };


  // 下拉刷新
  onHeaderRefresh = () => {
    console.log('onHeaderRefresh==触发');
    this.setState({
      refreshing: true,
      pageNo: 1,
      list: [],
    }, () => {
      this.getSearchProduct();
    });
  };

  // 上拉加载
  onFooterLoad = () => {
    console.log('onFooterLoad==触发');
    const { hasMore } = this.state;
    if (hasMore) {
      const params = {
        pageNo: this.state.pageNo,
        queryStr: this.state.queryStr,
      };
      console.log('上拉加载===onFooterLoad', params);
      this.getSearchProduct(params);
    }
  };

  /**
   * 接口请求
   */
  // 商品
  async getSearchProduct(params) {
    const { deviceId, deviceType } = Layout.device;
    const { list, pageSize } = this.state;
    let loadingState = 'loading';
    this.setState({ loadingState });
    let { pageNo } = params;
    params.deviceValue = deviceId;
    params.deviceType = deviceType;
    params.pageSize = pageSize;
    params.sort = '';
    params.hasCoupon = false;
    console.log('getChargeSearch==params', params);
    const res = await getChargeSearch(params);
    console.log('getChargeSearch==', res);
    if (res && res.length) {
      pageNo++;
      this.setState({
        refreshing: false,
        list: [...list, ...res],
        loadingState: '',
        pageNo,
      });
    } else {
      if (list && list.length) {
        loadingState = 'noMoreData';
        this.setState({
          hasMore: false,
        });
      } else {
        loadingState = 'empty';
      }
      this.setState({
        refreshing: false,
        loadingState,
      });
    }
  }

  componentDidMount() {
    const value = this.props.navigation.getParam('value', '');
    this.searchProduct(value);
  }

  /**
   * 元素渲染
   */
  renderItem = (info) => {
    if (info.index % 2 == 0) {
      info.item.needMR = true;
    } else {
      info.item.needMR = false;
    }
    return (<RechargeItem item={info.item} index={info.index} jumpDetail={this.jumpDetail} />);
  };

  render() {
    const { refreshing, loadingState, list } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.listWrap}>
          <FlatList
            numColumns={2}
            data={list}
            keyExtractor={(item, index) => (item + index).toString()}
            renderItem={this.renderItem}
            style={styles.productFlatList}
            onEndReachedThreshold={0.1}
            onEndReached={this.onFooterLoad}
          />
          <LoadingText loading={loadingState} bgColor="#f4f4f4" />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  listWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingLeft: 16,
    paddingRight: 16,
  },
  productFlatList: {
    flex: 1,
    width: '100%',
  },
});
