import React, { Component } from 'react';
import {
  StyleSheet, View, FlatList, RefreshControl, StatusBar, TextInput, Image, TouchableOpacity, Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SalesmanItem from '@components/SalesmanItem';
import SalesmanModal from '@components/SalesmanModal';
import LoadingText from '@components/LoadingText';
import { getUpSalesmanList, upSalesman } from '../../services/api';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  ownerWrap: {
    backgroundColor: '#fff',
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
  inputWrap: {
    paddingBottom: 6,
    backgroundColor: '#fff',
    paddingRight: 20,
    flexDirection: 'row',
    alignContent: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  backIconWrap: {
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backIcon: {
    marginTop: 2,
  },
  inputBox: {
    flex: 1,
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

export default class UpSalesmanList extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    list: [],
    loadingState: '',
    params: {
      curPage: 1,
      key: '',
    },
    isModal: false,
    type: 1,
    userInfo: {},
  };

  componentDidMount() {
    this.onHeaderRefresh();
  }

  handelSalesman = (item) => {
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
    this.upSalesman(userInfo.userId);
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  // 下拉刷新
  onHeaderRefresh = () => {
    const datas = {
      curPage: 1,
      key: '',
    };
    this.canLoadMore = false;
    this.setState(
      {
        params: datas,
        list: [],
      },
      () => {
        this.getList(datas);
      }
    );
  };

  // 上拉加载
  onFooterLoad = () => {
    const { params } = this.state;
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getList(params);
    }
  };

  onChangeText = val => {
    const { params } = this.state;

    this.setState({
      params: {
        ...params,
        key: val,
      },
    });
  };

  onSubmitEditing = () => {
    const {
      params: { key },
    } = this.state;
    const datas = {
      curPage: 1,
      key,
    };
    this.setState(
      {
        list: [],
        params: datas,
      },
      () => {
        Keyboard.dismiss();
        this.getList(datas);
      }
    );
  };

  clearSearch = () => {
    const datas = {
      curPage: 1,
      key: '',
    };
    this.setState({
      params: datas,
      list: [],
    });
    this.getList(datas);
  };

  async getList(params) {
    let loadingState = 'loading';
    this.setState({
      loadingState,
    });
    let { curPage } = params;
    const res = await getUpSalesmanList(params);
    if (res && res.list && res.list.length) {
      curPage++;
      this.canLoadMore = true;
      this.setState({
        params: {
          ...params,
          curPage,
        },
        list: [...this.state.list, ...res.list],
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
  }

  async upSalesman(id) {
    const res = await upSalesman(id);
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
  }

  shopOwnerListItem = ({ item, index }) => {
    const { list, type } = this.state;
    return (
      <SalesmanItem
        item={item}
        type={type}
        handelSalesman={this.handelSalesman}
        getUserInfo={this.getUserInfo}
        isLine={list.length - 1 === index}
      />
    );
  };

  loadingText = () => {
    const { loadingState } = this.state;
    return <LoadingText loading={loadingState} />;
  };

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const { list, isModal, type, userInfo, params } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.inputWrap}>
          <TouchableOpacity style={styles.backIconWrap} onPress={this.goBack}>
            <Ionicons style={styles.backIcon} name="ios-arrow-back" size={26} color="#666" />
          </TouchableOpacity>
          <View style={styles.inputBox}>
            <Image style={styles.searchIcon} source={require('@assets/icon-search2.png')} />
            <TextInput
              style={styles.searchInput}
              placeholder="请输入手机号或邀请码…"
              placeholderTextColor="#999"
              onChangeText={this.onChangeText}
              returnKeyType="search"
              onSubmitEditing={this.onSubmitEditing}
              underlineColorAndroid="transparent"
              value={params.key}
            />
            <TouchableOpacity style={styles.cancelWrap} onPress={this.clearSearch}>
              <Ionicons style={styles.cancelIcon} name="ios-close" size={22} color="#999" />
            </TouchableOpacity>
          </View>
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
        <SalesmanModal
          isModal={isModal}
          type={type}
          userInfo={userInfo}
          closeModal={this.closeModal}
          changeSalesman={this.changeSalesman}
        />
      </View>
    );
  }
}
