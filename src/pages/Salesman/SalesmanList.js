import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl, StatusBar, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationEvents } from 'react-navigation';
import SalesmanItem from '@components/SalesmanItem';
import SalesmanModal from '@components/SalesmanModal';
import LoadingText from '@components/LoadingText';
import { getSalesmanList, getSalesmanNumber, cancelSalesman } from '../../services/api';
import Layout from '../../constants/Layout';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f4f4',
  },
  ownerWrap: {
    backgroundColor: '#fff',
  },
  shopOwnerStatus: {
    width: '100%',
    height: 112,
    alignItems: 'center',
    paddingTop: 24,
    position: 'relative',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  sortTitle: {
    fontFamily: 'PingFangSC-Regular',
    color: '#666',
    fontSize: 13,
  },
  toListButton: {
    height: 30,
    lineHeight: 30,
    borderColor: '#fc4277',
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderRightWidth: 0,
    position: 'absolute',
    top: 16,
    right: 0,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toListButtonText: {
    textAlign: 'center',
    lineHeight: 30,
    color: '#fc4277',
    fontSize: 14,
  },
  showOwner: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
  shopOwnerNum: {
    fontSize: 30,
    color: '#fc4277',
    fontFamily: 'DINAlternate-Bold',
  },
  filterList: {
    width: '100%',
    height: 46.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomColor: '#efefef',
    borderBottomWidth: 0.5,
    backgroundColor: '#fff',
  },
  filterItem: {
    fontSize: 13,
    color: '#666',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  triangle: {
    marginLeft: 4,
  },
  topTriangle: {
    width: 0,
    height: 0,
    borderColor: 'transparent',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 5,
    borderBottomColor: '#666',
  },
  bottomTriangle: {
    width: 0,
    height: 0,
    borderColor: 'transparent',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderTopColor: '#666',
    marginTop: 2,
  },
  arrowIcon: {
    marginLeft: 4,
    marginTop: 2,
  },
});

export default class SalesmanList extends Component {
  static navigationOptions = {
    title: '业务员管理',
  };

  current = 1;

  state = {
    list: [],
    sort: 2,
    shopData: {},
    loadingState: '',
    isModal: false,
    type: 2,
    userInfo: {},
  };

  init() {
    this.onHeaderRefresh();
  }

  toSalesmanList = () => {
    this.props.navigation.navigate('UpSalesmanList');
  };

  onSort = type => {
    const { sort } = this.state;
    this.current = 1;
    if (type === 'type1') {
      if (sort !== 1 && sort !== 2) {
        const types = 2;
        this.setSort(types);
      } else {
        const types = sort === 1 ? 2 : 1;
        this.setSort(types);
      }
    } else if (type === 'type2') {
      if (sort !== 3 && sort !== 4) {
        const types = 4;
        this.setSort(types);
      } else {
        const types = sort === 3 ? 4 : 3;
        this.setSort(types);
      }
    }
  };

  setSort = types => {
    this.setState(
      {
        sort: types,
        list: [],
      },
      () => {
        this.getList();
      }
    );
  };

  handelSalesman = item => {
    this.setState({
      isModal: true,
      userInfo: item,
    });
  };

  closeModal = () => {
    this.setState({
      isModal: false,
    });
  };

  changeSalesman = () => {
    const { userInfo } = this.state;
    this.cancelSalesman(userInfo.userId);
  };

  // 下拉刷新
  onHeaderRefresh = () => {
    this.canLoadMore = false;
    this.current = 1;
    this.setState(
      {
        list: [],
      },
      () => {
        this.getList();
        this.getNumber();
      }
    );
  };

  // 上拉加载
  onFooterLoad = () => {
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getList();
    }
  };

  getNumber = () => {
    getSalesmanNumber().then(res => {
      if (res) {
        this.setState({
          shopData: res,
        });
      }
    });
  };

  getList = () => {
    const { sort } = this.state;
    let loadingState = 'loading';
    this.setState({ loadingState });
    const params = {
      curPage: this.current,
      sort,
    };

    getSalesmanList(params).then(res => {
      if (res && res.length > 0) {
        this.current += 1;
        this.canLoadMore = true;
        this.setState({
          list: [...this.state.list, ...res],
          loadingState: '',
        });
      } else {
        if (this.state.list.length > 0) {
          loadingState = 'noMoreData';
        } else {
          loadingState = 'empty';
        }
        this.setState({
          loadingState,
        });
      }
    });
  };

  cancelSalesman = id => {
    cancelSalesman(id).then(res => {
      if (res) {
        this.onHeaderRefresh();
        this.setState({
          isModal: false,
        });
      } else {
        this.setState({
          isModal: false,
        });
      }
    });
  };

  shopOwnerListItem = ({ item, index }) => {
    const { list, type } = this.state;
    return <SalesmanItem item={item} type={type} handelSalesman={this.handelSalesman} getUserInfo={this.getUserInfo} isLine={list.length - 1 === index} />;
  };

  loadingText = () => {
    const { loadingState } = this.state;
    return <LoadingText loading={loadingState} />;
  };

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const { shopData, list, sort, isModal, type, userInfo } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.shopOwnerStatus}>
          <Text style={styles.showOwner}>业务员</Text>
          <Text style={styles.shopOwnerNum}>{shopData.count || '0'}</Text>
          <TouchableOpacity style={styles.toListButton} onPress={this.toSalesmanList} activeOpacity={Layout.activeOpacity}>
            <Text style={styles.toListButtonText}>直升业务员</Text>
            <Ionicons style={styles.arrowIcon} name="ios-arrow-forward" size={16} color="#FC4277" />
          </TouchableOpacity>
        </View>
        <View style={styles.filterList}>
          <TouchableOpacity style={styles.filterItem} onPress={() => this.onSort('type1')} activeOpacity={Layout.activeOpacity}>
            <Text style={styles.sortTitle}>直升时间</Text>
            <View style={styles.triangle}>
              <View style={[styles.topTriangle, { borderBottomColor: sort === 2 ? '#fc4277' : '#666' }]} />
              <View style={[styles.bottomTriangle, { borderTopColor: sort === 1 ? '#fc4277' : '#666' }]} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterItem} onPress={() => this.onSort('type2')} activeOpacity={Layout.activeOpacity}>
            <Text style={styles.sortTitle}>店长人数</Text>
            <View style={styles.triangle}>
              <View style={[styles.topTriangle, { borderBottomColor: sort === 4 ? '#fc4277' : '#666' }]} />
              <View style={[styles.bottomTriangle, { borderTopColor: sort === 3 ? '#fc4277' : '#666' }]} />
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.ownerWrap}
          data={list}
          onEndReachedThreshold={0.1}
          keyExtractor={this._keyExtractor}
          renderItem={this.shopOwnerListItem}
          onEndReached={this.onFooterLoad}
          ListFooterComponent={() => this.loadingText()}
          refreshControl={<RefreshControl refreshing={false} onRefresh={this.onHeaderRefresh} title="加载中..." />}
        />
        <SalesmanModal isModal={isModal} type={type} userInfo={userInfo} closeModal={this.closeModal} changeSalesman={this.changeSalesman} />
        <NavigationEvents onDidFocus={() => this.init()} />
      </View>
    );
  }
}
