import React, { Component } from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList, ScrollView, Keyboard, Image, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationEvents } from 'react-navigation';
import OrderItem from '@components/OrderItem';
import NoOrder from '@components/NoOrder';
import LoadingText from '@components/LoadingText';
import { getOrderList, getDeliverGoods } from '../../services/api';

export default class OrderList extends Component {
  static navigationOptions = {
    title: '订单管理',
  };

  state = {
    list: [],
    menus: [
      {
        name: '全部',
        active: true,
        type: -1,
        left: 0,
      },
      {
        name: '待发货',
        active: false,
        type: 1,
        left: 0,
      },
      {
        name: '已发货',
        active: false,
        type: 2,
        left: 30,
      },
      {
        name: '已完成',
        active: false,
        type: 3,
        left: 60,
      },
    ],
    loadingState: '',
    isEmpty: false,
    params: {
      type: -1,
      currentPage: 1,
      keyWord: '',
    },
  };

  init() {
    this.onHeaderRefresh()
  }

  jumpDetail = id => {
    this.props.navigation.navigate('OrderDetail', { id });
  };

  menuChange = (item, index) => {
    const { menus } = this.state;
    const menusArr = menus;
    menusArr.map(item => {
      item.active = false;
    });
    menusArr[index].active = true;
    const datas = {
      currentPage: 1,
      type: item.type,
      keyWord: '',
    };
    this.setState(
      {
        menus: menusArr,
        list: [],
        params: datas,
      },
      () => {
        this.getStoreOrderList(datas);
      }
    );
  };

  // 下拉刷新
  onHeaderRefresh = () => {
    const { params } = this.state;
    const datas = {
      type: params.type,
      currentPage: 1,
      keyWord: '',
    };
    console.log('下拉刷新===onHeaderRefresh');
    this.canLoadMore = false;
    this.setState(
      {
        params: datas,
        list: [],
      },
      () => {
        this.getStoreOrderList(datas);
      }
    );
  };

  // 上拉加载
  onFooterLoad = () => {
    const { params } = this.state;
    console.log('上拉加载===onFooterLoad');
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getStoreOrderList(params);
    }
  };

  onChangeText = val => {
    const { params } = this.state;

    this.setState({
      params: {
        ...params,
        keyWord: val,
      },
    });
  };

  onSubmitEditing = () => {
    const {
      params: { keyWord },
      menus,
    } = this.state;
    const datas = {
      type: -1,
      currentPage: 1,
      keyWord,
    };
    const menusArr = menus;
    menusArr.map(item => {
      item.active = false;
    });
    menusArr[0].active = true;
    this.setState(
      {
        list: [],
        params: datas,
      },
      () => {
        Keyboard.dismiss();
        this.getStoreOrderList(datas);
      }
    );
  };

  clearSearch = () => {
    const { type } = this.state.params;
    const datas = {
      type,
      currentPage: 1,
      keyWord: '',
    };
    this.setState({
      params: datas,
      list: [],
    });
    this.getStoreOrderList(datas);
  };

  // 接口请求
  async getStoreOrderList(params) {
    let loadingState = 'loading';
    this.setState({
      loadingState,
      isEmpty: false,
    });

    let { currentPage } = params;
    const res = await getOrderList(params);
    if (res && res.length) {
      currentPage++;
      this.canLoadMore = true;
      this.setState({
        list: [...this.state.list, ...res],
        params: {
          ...params,
          currentPage,
        },
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

  async deliverGoods(id) {
    const res = await getDeliverGoods(id);
    if (res) {
      this.onHeaderRefresh();
    }
  }

  // 元素渲染
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

  orderItem = info => {
    return <OrderItem index={info.index} info={info.item} jumpDetail={this.jumpDetail} deliverGoods={this.deliverGoods.bind(this)} />;
  };

  renderMenus = () => {
    const { menus } = this.state;
    const arr = [];
    menus.map((item, index) => {
      arr.push(
        <View key={index} style={styles.tabWrap}>
          <Text onPress={() => this.menuChange(item, index)} style={[styles.tabs, item.active ? styles.tabActive : '']}>
            {item.name}
          </Text>
          {item.active && <View style={styles.tabIcon} />}
        </View>
      );
    });
    return arr;
  };

  render() {
    const { list, params, isEmpty } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
        <View style={styles.inputWrap}>
          <View style={styles.inputBox}>
            <Image style={styles.searchIcon} source={require('../../../assets/icon-search2.png')} />
            <TextInput
              style={styles.searchInput}
              placeholder="订单号、收货人姓名或手机号…"
              placeholderTextColor="#999"
              onChangeText={this.onChangeText}
              returnKeyType="search"
              onSubmitEditing={this.onSubmitEditing}
              underlineColorAndroid="transparent"
              value={params.keyWord}
            />
            <TouchableOpacity style={styles.cancelWrap} onPress={this.clearSearch}>
              <Ionicons style={styles.cancelIcon} name="ios-close" size={22} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <ScrollView contentContainerStyle={styles.scrollView} horizontal>
            {this.renderMenus()}
          </ScrollView>
        </View>
        <View style={[list.length > 0 && styles.orderWrap]}>
          <FlatList
            style={[list.length > 0 && styles.flatWrap]}
            data={list}
            keyExtractor={this._keyExtractor}
            renderItem={this.orderItem}
            onEndReachedThreshold={0.1}
            onEndReached={this.onFooterLoad}
            ListFooterComponent={() => this.loadingText()}
            refreshControl={<RefreshControl refreshing={false} onRefresh={this.onHeaderRefresh} title="加载中..." />}
          />
        </View>
        <NoOrder isEmpty={isEmpty} text="暂无订单" />
        <NavigationEvents onDidFocus={() => this.init()} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  orderWrap: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    flex: 1,
  },
  flatWrap: {
    flex: 1,
  },
  scrollView: {
    paddingTop: 20,
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: '100%',
  },
  tabWrap: {
    width: '30%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  tabIcon: {
    borderWidth: 1,
    borderColor: '#ea4457',
    width: 15,
  },
  tabs: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PingFangSC-Regular',
    marginBottom: 10,
    lineHeight: 24,
  },
  tabActive: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 26,
  },
  inputWrap: {
    padding: 12,
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  inputBox: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 19,
    height: 18,
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    height: 18,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  cancelWrap: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    width: 20,
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelIcon: {
    marginTop: -2,
  },
});
