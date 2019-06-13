import React from 'react';
import {
  StyleSheet, View,
  RefreshControl,
  FlatList,
  StatusBar,
} from 'react-native';
import Layout from '../../constants/Layout';
import ProductItem from '../../components/PrdDoubleItem';
import LoadingText from '../../components/LoadingText';
import SortTab from '../../components/SortTab';

import {
  getPrdByCategoryId,
} from '../../services/api';

export default class PrdList extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title || '类目',
  });

  state = {
    refreshing: false,
    hasCoupon: true,
    canSwitch: true,
    curPage: 1,
    pageSize: 10,
    sortTab: 0,
    sortType: '',
    sortParams: '',
    loadingState: '',
    categoryDataList: [],
  }

  /**
   * 列表渲染
   */
  renderItem = (info) => {
    if (info.index % 2 == 0) {
      info.item.needMR = true;
    } else {
      info.item.needMR = false;
    }
    return (<ProductItem item={info.item} index={info.index} jumpDetail={this.jumpDetail} />);
  };


  /**
   * 事件绑定
   */
  jumpDetail = (item) => {
    console.log('jumpDetail====1', item);
    this.props.navigation.navigate('Detail', { pid: item.id });
  };

  // 下拉刷新
  onHeaderRefresh = () => {
    console.log('onHeaderRefresh==触发');
    this.setState({
      refreshing: true,
      curPage: 1,
      sortType: '',
      categoryDataList: [],
    }, () => {
      this.getPrdByCategoryId();
    });
  };

  // 上拉加载
  onFooterLoad = () => {
    console.log('onFooterLoad==触发');
    this.getPrdByCategoryId();
  };

  changeSort = (item, sortType, sortParams) => {
    this.setState({
      curPage: 1,
      categoryDataList: [],
      sortType,
      sortTab: item.sortIndex,
      sortParams,
    }, () => {
      this.getPrdByCategoryId();
    });
  };

  changeTagQuan = () => {
    let { hasCoupon, canSwitch } = this.state;
    if (canSwitch) {
      hasCoupon = !hasCoupon;
      this.setState({
        canSwitch: false,
        hasCoupon,
        curPage: 1,
        categoryDataList: [],
      }, () => {
        this.getPrdByCategoryId();
      });
    }
  }

  /**
   * 接口请求
   */
  // 父级类目商品
  async getPrdByCategoryId() {
    let loadingState = 'loading';
    this.setState({ loadingState });
    const {
      pageSize, sortParams, cid, hasCoupon,
    } = this.state;
    const { deviceId: deviceValue, deviceType } = Layout.device;
    let { curPage } = this.state;
    const params = {
      categoryId: cid,
      sort: sortParams,
      page: curPage,
      pageSize,
      deviceValue,
      deviceType,
      hasCoupon,
    };
    const res = await getPrdByCategoryId(params);
    console.log('getPrdByCategoryId===', res);
    if (res && res.length) {
      curPage++;
      this.setState({
        canSwitch: true,
        refreshing: false,
        categoryDataList: [...this.state.categoryDataList, ...res],
        loadingState: '',
        curPage,
      });
    } else {
      if (this.state.categoryDataList.length) {
        loadingState = 'noMoreData';
      } else {
        loadingState = 'empty';
      }
      this.setState({
        canSwitch: true,
        refreshing: false,
        loadingState,
      });
    }
  }

  /**
   * 初始化
   */
  init = () => {
    const cid = this.props.navigation.getParam('cid', '');
    const title = this.props.navigation.getParam('title', '');
    console.log('====', cid, title);
    this.setState({ cid }, () => {
      this.getPrdByCategoryId();
    });
  };

  componentDidMount() {
    this.init();
  }

  render() {
    const {
      sortType, sortTab, refreshing,
      loadingState, categoryDataList,
      hasCoupon,
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <SortTab sortType={sortType} sortTab={sortTab} changeSort={this.changeSort} hasCoupon={hasCoupon} changeTagQuan={this.changeTagQuan} />
        <View style={[styles.categoryPrdWrap, categoryDataList.length ? { height: Layout.window.height - 140 } : '']}>
          <FlatList
            numColumns={2}
            style={{ width: '100%' }}
            data={categoryDataList}
            keyExtractor={(item, index) => (item + index).toString()}
            renderItem={this.renderItem}
            refreshControl={(
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.onHeaderRefresh}
                title="加载中..."
              />
)}
            onEndReachedThreshold={0.1}
            onEndReached={this.onFooterLoad}
          />
        </View>
        <LoadingText loading={loadingState} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
  },
  sortTabsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  sortTab: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    padding: 10,
    alignSelf: 'stretch',
  },
  sortTypeTab: {
    fontFamily: 'PingFangSC-Medium',
    color: '#EA4457',
  },
  categoryPrdWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingLeft: 16,
    paddingRight: 16,
  },
});
