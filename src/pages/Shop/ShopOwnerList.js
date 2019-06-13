import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ShopOwnerItem from '@components/ShopOnwerItem';
import ShareBox from '@components/ShareBox';
import ShopOnwerModal from '@components/ShopOnwerModal';
import { storeAdmin, storeAdminNumber, storeUserInfo } from '../../services/api';
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
    height: 138,
    alignItems: 'center',
    justifyContent: 'space-between',
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
  copyLinkButton: {
    height: 30,
    lineHeight: 30,
    borderColor: '#fc4277',
    backgroundColor: '#fff',
    borderWidth: 0.5,
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
  copyLinkButtonText: {
    textAlign: 'center',
    lineHeight: 30,
    color: '#fc4277',
    fontSize: 14,
  },
  showOwner: {
    color: '#666',
    fontSize: 14,
  },
  shopOwnerNum: {
    fontSize: 30,
    color: '#fc4277',
    fontFamily: 'DINAlternate-Bold',
  },
  showOwnerQuota: {
    width: '100%',
    height: 38,
    backgroundColor: '#fc4277',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dataLine: {
    width: 0.5,
    height: 12,
    backgroundColor: '#fff',
  },
  surplusQuota: {
    width: '50%',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#fff',
    fontSize: 13,
  },
  arrowIcon: {
    marginLeft: 4,
    marginTop: 2,
  },
});

export default class ShopOwnerList extends Component {
  static navigationOptions = {
    title: '店长管理',
  };

  current = 1;

  state = {
    shopOwnerList: [],
    order: 2,
    shopData: {},
    userInfo: {},
    loadingState: '',
    isModal: false,
    // 分享参数
    showShareBox: false,
    shareImageUrl: '',
    shareTitle: '店长直升通道',
    shareText: '',
  };

  componentDidMount() {
    this.onHeaderRefresh();
  }

  _keyExtractor = (item, index) => `${index}`;

  copyLink = () => {
    const { shopData } = this.state;
    this.setState({
      showShareBox: true,
      shareText: shopData.shopkeeperRise,
    });
  };

  linkingPhone = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log('不支持拨打电话功能');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  onSort = type => {
    const { order } = this.state;
    this.current = 1;
    if (type === 'type1') {
      if (order !== 1 && order !== 2) {
        const types = 2;
        this.setOrder(types);
      } else {
        const types = order === 1 ? 2 : 1;
        this.setOrder(types);
      }
    } else if (type === 'type2') {
      if (order !== 3 && order !== 4) {
        const types = 4;
        this.setOrder(types);
      } else {
        const types = order === 3 ? 4 : 3;
        this.setOrder(types);
      }
    }
  };

  setOrder = types => {
    this.setState(
      {
        order: types,
        shopOwnerList: [],
      },
      () => {
        this.getList();
      }
    );
  };

  closeModal = () => {
    this.setState({
      isModal: false,
    });
  };

  closeShare = () => {
    this.setState({
      showShareBox: false,
    });
  };

  jumpPage = (url, id) => {
    if (id) {
      this.props.navigation.navigate(url, { shopId: id });
    } else {
      this.props.navigation.navigate(url);
    }
  };

  // 下拉刷新
  onHeaderRefresh = () => {
    this.canLoadMore = false;
    this.current = 1;
    this.setState(
      {
        shopOwnerList: [],
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
    storeAdminNumber().then(res => {
      this.setState({
        shopData: res,
      });
    });
  };

  getList = () => {
    const { order } = this.state;
    let loadingState = 'loading';
    this.setState({ loadingState });
    const params = {
      current: this.current,
      order,
    };

    storeAdmin(params).then(res => {
      if (res && res.length > 0) {
        this.current += 1;
        this.canLoadMore = true;
        this.setState({
          shopOwnerList: [...this.state.shopOwnerList, ...res],
          loadingState: '',
        });
      } else {
        if (this.state.shopOwnerList.length > 0) {
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

  getUserInfo = id => {
    storeUserInfo(id).then(res => {
      if (res) {
        this.setState({
          userInfo: res,
          isModal: true,
        });
      }
    });
  };

  render() {
    const { shopData, shopOwnerList, loadingState, userInfo, order, isModal, showShareBox, shareImageUrl, shareText, shareTitle } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.shopOwnerStatus}>
          <Text style={styles.showOwner}>已直推店长</Text>
          <Text style={styles.shopOwnerNum}>{shopData.storeUsed || '0'}</Text>
          <View style={styles.showOwnerQuota}>
            <Text style={styles.surplusQuota}>剩余名额：{(Number(shopData.surplus) === -1 ? '无限' : shopData.surplus) || '0'}</Text>
            <View style={styles.dataLine} />
            <Text style={styles.surplusQuota} onPress={() => this.jumpPage('CheckPending')}>
              待审核：{shopData.countExamine || '0'}
            </Text>
          </View>
          <TouchableOpacity style={styles.copyLinkButton} onPress={this.copyLink} activeOpacity={Layout.activeOpacity}>
            <Text style={styles.copyLinkButtonText}>分享直升链接</Text>
            <Ionicons style={styles.arrowIcon} name="ios-arrow-forward" size={16} color="#FC4277" />
          </TouchableOpacity>
        </View>
        <ShopOwnerItem
          shopOwnerList={shopOwnerList}
          order={order}
          jumpPage={this.jumpPage}
          getUserInfo={this.getUserInfo}
          onFooterLoad={this.onFooterLoad}
          onHeaderRefresh={this.onHeaderRefresh}
          onSort={this.onSort}
          loadingState={loadingState}
        />
        <ShopOnwerModal isModal={isModal} userInfo={userInfo} linkingPhone={this.linkingPhone} closeModal={this.closeModal} />
        <ShareBox closeShare={this.closeShare} showShareBox={showShareBox} shareImageUrl={shareImageUrl} shareTitle={shareTitle} shareText={shareText} fromSource="ShopOwnerList" />
      </View>
    );
  }
}
