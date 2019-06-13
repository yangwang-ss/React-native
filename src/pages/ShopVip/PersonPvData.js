import React, { Component } from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList, Image, StatusBar } from 'react-native';
import VipIcon from '@components/VipIcon';
import LoadingText from '@components/LoadingText';
import { getMemberPvProList, getMemberPvDetail } from '../../services/api';

export default class PersonPvData extends Component {
  static navigationOptions = {
    title: '会员管理',
  };

  state = {
    userInfo: {},
    dataList: [],
    loadingState: '',
    currentPage: 1,
    userId: '',
  };

  componentDidMount() {
    const userId = this.props.navigation.getParam('userId', '');
    this.setState({
      userId,
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
        userInfo: {},
      },
      () => {
        this.getMemberPvProList();
        this.getMemberPvDetail();
      }
    );
  };

  // 上拉加载
  onFooterLoad = () => {
    console.log('上拉加载===onFooterLoad');
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getMemberPvProList();
    }
  };

  /**
   * 接口请求
   */
  async getMemberPvProList() {
    const { currentPage, userId } = this.state;
    let page = currentPage;
    let loadingState = 'loading';
    this.setState({ loadingState });
    const params = {
      currentPage,
      userId,
    };
    const res = await getMemberPvProList(params);

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

  async getMemberPvDetail() {
    const { userId } = this.state;
    const res = await getMemberPvDetail(userId);
    if (res) {
      this.setState({
        userInfo: res,
      });
    }
  }

  _keyExtractor = (item, index) => `${index}`;

  loadingText = () => {
    const { loadingState } = this.state;
    return <LoadingText loading={loadingState} />;
  };

  saleItem = info => {
    const { dataList } = this.state;
    const { item } = info;
    return (
      <View style={styles.productWrap}>
        <Image style={styles.productImg} source={{ uri: item.productImg }} />
        <View style={[styles.productInfo, info.index === dataList.length - 1 && styles.noLine]}>
          <Text style={styles.productTitle}>{item.productName}</Text>
          <View style={styles.priceWrap}>
            <Text style={styles.priceIcon}>￥</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        </View>
        {item.orderNum > 0 && (
          <View style={styles.productLabel}>
            <Text style={styles.productNum}>成交{item.orderNum}单</Text>
            <Image style={styles.productLabelIcon} source={require('../../../assets/label-pvIcon.png')} />
          </View>
        )}
      </View>
    );
  };

  render() {
    const { dataList, userInfo } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
        <View style={styles.userInfoWrap}>
          <View style={styles.userInfoBox}>
            <Image style={styles.userAvator} source={{ uri: userInfo.headImg }} />
            <View>
              <View style={styles.userNameWrap}>
                <Text style={styles.userName}>{userInfo.nickname}</Text>
                <VipIcon roleId={userInfo.level} levelName={userInfo.levelName} />
              </View>
              <Text style={styles.userTime}>最近来访时间：{userInfo.latelyTime}</Text>
            </View>
          </View>
        </View>
        <View style={styles.dataWrap}>
          <View>
            <Text style={styles.dataText}>{userInfo.visitGoodsNum || '0'}</Text>
            <Text style={styles.dataTitle}>访问商品次数</Text>
          </View>
          <View style={styles.dataLine} />
          <View>
            <Text style={styles.dataText}>{userInfo.shareGoodsNum || '0'}</Text>
            <Text style={styles.dataTitle}>分享次数</Text>
          </View>
          <View style={styles.dataLine} />
          <View>
            <Text style={styles.dataText}>{userInfo.storeOrderNum || '0'}</Text>
            <Text style={styles.dataTitle}>门店订单数</Text>
          </View>
          <View style={styles.dataLine} />
          <View>
            <Text style={styles.dataText}>{userInfo.tbkOrderNum || '0'}</Text>
            <Text style={styles.dataTitle}>淘宝订单数</Text>
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
  productWrap: {
    backgroundColor: '#fff',
    paddingTop: 14,
    paddingLeft: 16,
    flexDirection: 'row',
  },
  productImg: {
    width: 109,
    height: 109,
    borderRadius: 2,
    marginRight: 8,
  },
  productInfo: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    height: 123,
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 1,
    marginRight: 16,
  },
  noLine: {
    borderBottomWidth: 0,
  },
  productTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    width: '100%',
  },
  priceWrap: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 40,
  },
  priceIcon: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 17,
    color: '#FA4B91',
  },
  price: {
    fontFamily: 'DINA',
    fontSize: 20,
    color: '#FA4B91',
  },
  productLabel: {
    position: 'absolute',
    right: 0,
    bottom: 14,
    width: 108,
    height: 44,
  },
  productLabelIcon: {
    width: '100%',
    height: '100%',
  },
  productNum: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
    color: '#fff',
    position: 'absolute',
    left: 10,
    bottom: 8,
    zIndex: 9,
    elevation: 9,
  },
  dataWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 34,
    paddingRight: 34,
    paddingBottom: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  dataLine: {
    height: 20,
    width: 1,
    backgroundColor: '#F4F4F4',
  },
  dataText: {
    fontFamily: 'DINA',
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  dataTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  userInfoWrap: {
    backgroundColor: '#fff',
    padding: 20,
  },
  userInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userNameWrap: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  userName: {
    fontFamily: 'PingFangSC-Medium',
    color: '#333',
    fontSize: 16,
    marginRight: 6,
  },
  userTime: {
    fontFamily: 'PingFangSC-Regular',
    color: '#999',
    fontSize: 12,
  },
});
