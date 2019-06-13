import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image,
  FlatList, RefreshControl, StatusBar,
  TouchableOpacity, TextInput, Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';
import Layout from '../../constants/Layout';
import ReferralsTip from '../../components/ReferralsTip';
import { getMyReferrals, getStoreMyReferrals, upCounts, storeUpCounts } from '../../services/api';

export default class MyReferrals extends Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    dataSource: [],
    loadMoreText: '',
    loadingState: {
      loading: '加载中...',
      noMoreData: '-我是有底线的-',
      failure: '好嗨哟，居然请求失败了 =.=!',
      emptyData: '暂无数据',
    },
    params: {
      curPage: 1,
      pageSize: 10,
      key: '',
    },
    referralsInfo: {
      upComplete: 0,
      remain: 0,
      tips1: '',
      tips2: '',
      tips3: '',
    },
    isTipModal: false,
    roleType: 1,
  };

  async componentDidMount() {
    const userInfo = (await storage
      .load({
        key: 'userInfo',
      })
      .catch(e => e)) || {};
    this.setState({
      roleType: userInfo.isAgent ? 1 : 2,
    }, () => {
      this.onHeaderRefresh();
    });
  }

  componentWillUnmount() {
    Toast.hide(this.loadingToast);
  }

  _keyExtractor = (item, index) => `${index}`;

  // 下拉刷新
  onHeaderRefresh = () => {
    const datas = {
      ...this.state.params,
      curPage: 1,
      key: '',
    };
    console.log('下拉刷新===onHeaderRefresh', datas);
    this.canLoadMore = false;
    this.setState({
      params: datas,
      dataSource: [],
    }, () => {
      this.getReferralsCount();
      this.getReferralsList(datas);
    });
  };

  // 上拉加载
  onFooterLoad = () => {
    const { params } = this.state;
    console.log('上拉加载===onFooterLoad', params);
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getReferralsList(params);
    }
  };

  onChangeText = (val) => {
    const { params } = this.state.params;

    this.setState({
      params: {
        ...params,
        key: val,
      },
    });
  };

  onSubmitEditing= () => {
    const { params } = this.state;
    const datas = {
      ...params,
      curPage: 1,
    };
    this.setState({
      dataSource: [],
    });
    Keyboard.dismiss();
    this.getReferralsList(datas);
  };

  clearSearch = () => {
    const datas = {
      ...this.state.params,
      curPage: 1,
      key: '',
    };
    this.setState({
      params: datas,
      dataSource: [],
    });
    this.getReferralsList(datas);
  };

  openTip = () => {
    this.setState({
      tipContent: this.state.referralsInfo,
      isTipModal: true,
    });
  };

  closeTipModal = () => {
    this.setState({
      isTipModal: false,
    });
  };

  backPage = () => {
    this.props.navigation.goBack();
  };

  /**
   * 接口请求
   */
  async getReferralsList(params) {
    const { loadingState, roleType } = this.state;
    let loadMoreText = loadingState.loading;
    this.setState({ loadMoreText });

    let { curPage } = params;

    let res = null;
    if (roleType === 1) {
      res = await getMyReferrals(params);
    } else {
      res = await getStoreMyReferrals(params);
    }

    if (res && res.list && res.list.length) {
      curPage++;
      loadMoreText = '';
      this.canLoadMore = true;
      this.setState({
        dataSource: [...this.state.dataSource, ...res.list],
        params: {
          ...params,
          curPage,
        },
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

  async getReferralsCount() {
    const { roleType } = this.state;
    let res = null;
    if (roleType === 1) {
      res = await upCounts();
    } else {
      res = await storeUpCounts();
    }

    if (res) {
      this.setState({
        referralsInfo: res,
      });
    }
  }

  loadingText = () => {
    const { loadMoreText } = this.state;
    return (
      <Text style={styles.loadingText}>{loadMoreText}</Text>
    );
  };

  referralsItem = (info) => {
    const isLine = (info.index === this.state.dataSource.length - 1);
    const { item } = info;

    return (
      <View style={[styles.itemContent, !isLine && { borderBottomColor: '#EFEFEF', borderBottomWidth: 0.5 }]}>
        <Image style={styles.itemAvatar} source={{ uri: item.headImg }} />
        <View>
          <Text style={styles.itemName}>{item.nickname}</Text>
          <Text style={styles.itemTime}>{item.desc}</Text>
        </View>
      </View>
    );
  };

  render() {
    const {
      dataSource, params, isTipModal, tipContent, referralsInfo,
    } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.topWrap}>
          <Image style={styles.referralsBg} source={require('../../../assets/img-referralsBg.png')} />
          <View style={styles.titleBox}>
            <TouchableOpacity style={styles.backIconBox} onPress={this.backPage}>
              <Ionicons name="ios-arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.titleText}>我直推的合伙人</Text>
          </View>
          <View style={styles.referralsDataWrap}>
            <View style={styles.referralsData}>
              <Text style={styles.referralsTitle}>已直推合伙人</Text>
              <Text style={styles.referralsNum}>{referralsInfo.upComplete}</Text>
            </View>
            <View style={styles.referralsData}>
              <TouchableOpacity style={styles.referralsTitleWrap} onPress={this.openTip}>
                <Text style={styles.referralsTitle}>剩余名额</Text>
                <Ionicons style={styles.questionIcon} name="ios-help-circle-outline" size={18} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.referralsNum}>{referralsInfo.remain}</Text>
            </View>
          </View>
        </View>
        <View style={styles.contentWrap}>
          <View style={styles.inputWrap}>
            <Image style={styles.searchIcon} source={require('../../../assets/icon-search2.png')} />
            <TextInput
              style={styles.searchInput}
              placeholder="请输入用户的昵称或手机号"
              placeholderTextColor="#999"
              onChangeText={this.onChangeText}
              returnKeyType="search"
              onSubmitEditing={this.onSubmitEditing}
              underlineColorAndroid="transparent"
              value={params.key}
            />
            <TouchableOpacity style={styles.cancelInner} onPress={this.clearSearch}>
              <Ionicons style={styles.cancelIcon} name="ios-close" size={22} color="#999" />
            </TouchableOpacity>
          </View>
          <FlatList
            style={styles.listWrap}
            data={dataSource}
            keyExtractor={this._keyExtractor}
            renderItem={this.referralsItem}
            onEndReachedThreshold={0.1}
            onEndReached={this.onFooterLoad}
            ListFooterComponent={() => this.loadingText()}
            refreshControl={(
              <RefreshControl
                refreshing={false}
                onRefresh={this.onHeaderRefresh}
                title="加载中..."
              />
)}
          />
        </View>
        {
          isTipModal && (
            <ReferralsTip
              closeTipModal={this.closeTipModal}
              tipContent={tipContent}
            />
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Layout.window.width,
    backgroundColor: '#fff',
    flex: 1,
  },
  loadingText: {
    width: '100%',
    lineHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
  },
  inputWrap: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  cancelInner: {
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
  topWrap: {
    position: 'relative',
    width: '100%',
    height: 224,
    marginBottom: 12,
  },
  referralsBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  titleBox: {
    position: 'relative',
    padding: 19,
    paddingTop: 33,
    paddingBottom: 0,
  },
  backIconBox: {
    position: 'absolute',
    top: 34,
    left: 19,
    paddingRight: 30,
    paddingBottom: 10,
    zIndex: 99,
  },
  titleText: {
    textAlign: 'center',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 18,
    color: '#fff',
  },
  referralsDataWrap: {
    paddingLeft: 70,
    paddingRight: 70,
    marginTop: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  referralsTitle: {
    textAlign: 'center',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#fff',
    marginBottom: 12,
  },
  referralsNum: {
    textAlign: 'center',
    fontFamily: 'DINA',
    fontSize: 30,
    color: '#fff',
  },
  referralsTitleWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  questionIcon: {
    marginLeft: 4,
  },
  contentWrap: {
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
  },
  itemContent: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center',
  },
  itemAvatar: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 20,
  },
  itemName: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  itemTime: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  listWrap: {
    flex: 1,
  },
});
