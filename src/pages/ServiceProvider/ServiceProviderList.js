import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import ServiceProviderItem from '@components/ServiceProviderItem';
import ShareBox from '@components/ShareBox';
import { getCityRiseList, getCityRiseData } from '../../services/api';
import Layout from '../../constants/Layout';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f4f4',
  },
  linkWrap: {
    width: '100%',
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 12,
    paddingTop: 50,
    paddingBottom: 56,
  },
  copyLinkButton: {
    height: 36,
    lineHeight: 36,
    borderColor: '#FC4277',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingLeft: 8,
    paddingRight: 8,
    marginRight: 8,
  },
  copyLinkButtonText: {
    textAlign: 'center',
    lineHeight: 36,
    color: '#FC4277',
    fontSize: 14,
  },
  copyLinkButton2: {
    borderColor: '#F731BC',
  },
  copyLinkButtonText2: {
    color: '#F731BC',
  },
  tabWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    borderBottomColor: '#f4f4f4',
    borderBottomWidth: 8,
  },
  tabBox: {
    paddingBottom: 12,
    flex: 1,
  },
  tabLineActive: {
    borderBottomColor: '#FC4277',
    borderBottomWidth: 1,
  },
  tabActive: {
    color: '#FC4277',
  },
  tabNum: {
    color: '#333',
    fontSize: 18,
    fontFamily: 'DINAlternate-Bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  tabText: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    textAlign: 'center',
  },
  tabLine: {
    height: 24,
    width: 1,
    backgroundColor: '#ddd',
    position: 'absolute',
    top: 8,
    right: 0,
  },
  itemsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EFEFEF',
  },
  itemText: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'PingFangSC-Medium',
    textAlign: 'center',
  },
  itemWidth1: {
    width: '26%',
  },
  itemWidth2: {
    width: '48%',
  },
  infoWrap: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default class ServiceProviderList extends Component {
  static navigationOptions = {
    title: '服务商直升',
  };

  state = {
    list: [],
    menus: [
      {
        name: '审核通过',
        type: 1,
      },
      {
        name: '待审核',
        type: 0,
      },
      {
        name: '拒绝',
        type: 2,
      },
    ],
    params: {
      type: 1,
      currentPage: 1,
    },
    riseData: {
      count: [
        {
          value: '0',
        },
        {
          value: '0',
        },
        {
          value: '0',
        },
      ],
    },
    loadingState: '',
    // 分享参数
    showShareBox: false,
    shareImageUrl: '',
    shareTitle: '服务商直升通道',
    shareText: '',
    riseType: 1,
  };

  componentDidMount() {
    const riseType = this.props.navigation.getParam('type', '');
    this.setState({
      riseType,
    });
    this.onHeaderRefresh();
  }

  menuChange = item => {
    const datas = {
      currentPage: 1,
      type: item.type,
    };
    this.setState(
      {
        list: [],
        params: datas,
      },
      () => {
        this.getList();
        this.getNumber();
      }
    );
  };

  copyLink = type => {
    const { riseData } = this.state;
    this.setState({
      showShareBox: true,
      shareText: type === 1 ? riseData.sharePersonUrl : riseData.shareCityUrl,
    });
  };

  closeShare = () => {
    this.setState({
      showShareBox: false,
    });
  };

  // 下拉刷新
  onHeaderRefresh = () => {
    const { params } = this.state;
    const datas = {
      type: params.type,
      currentPage: 1,
    };
    this.canLoadMore = false;
    this.setState(
      {
        list: [],
        params: datas,
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
    getCityRiseData().then(res => {
      const arr = [
        {
          value: res.auditedNum,
        },
        {
          value: res.auditingNum,
        },
        {
          value: res.unAuditNum,
        },
      ];
      this.setState({
        riseData: {
          count: arr,
          sharePersonUrl: res.sharePersonUrl,
          shareCityUrl: res.shareCityUrl,
        },
      });
    });
  };

  getList = () => {
    const {
      params,
      params: { currentPage },
    } = this.state;
    let page = currentPage;
    let loadingState = 'loading';
    this.setState({ loadingState });
    getCityRiseList(params).then(res => {
      if (res && res.length > 0) {
        page++;
        this.canLoadMore = true;
        this.setState({
          list: [...this.state.list, ...res],
          loadingState: '',
          params: {
            ...params,
            currentPage: page,
          },
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

  renderMenus = () => {
    const { menus, params, riseData } = this.state;
    const arr = [];
    menus.map((item, index) => {
      arr.push(
        <TouchableOpacity onPress={() => this.menuChange(item)} key={index} style={[styles.tabBox, params.type === item.type && styles.tabLineActive]}>
          <Text style={[styles.tabNum, params.type === item.type && styles.tabActive]}>{riseData.count[index].value || '0'}</Text>
          <Text style={[styles.tabText, params.type === item.type && styles.tabActive]}>{item.name}</Text>
          <View style={styles.tabLine} />
        </TouchableOpacity>
      );
    });
    return arr;
  };

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const { list, loadingState, showShareBox, shareImageUrl, shareText, shareTitle, riseType } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.linkWrap}>
          <TouchableOpacity style={styles.copyLinkButton} onPress={() => this.copyLink(1)} activeOpacity={Layout.activeOpacity}>
            <Text style={styles.copyLinkButtonText}>分享基础服务商直升链接</Text>
          </TouchableOpacity>
          {riseType === 2 && (
            <TouchableOpacity style={[styles.copyLinkButton, styles.copyLinkButton2]} onPress={() => this.copyLink(2)} activeOpacity={Layout.activeOpacity}>
              <Text style={[styles.copyLinkButtonText, styles.copyLinkButtonText2]}>分享城市服务商直升链接</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.tabWrap}>{this.renderMenus()}</View>
        <View style={styles.infoWrap}>
          <View style={styles.itemsWrap}>
            <Text style={[styles.itemText, styles.itemWidth1]}>姓名</Text>
            <Text style={[styles.itemText, styles.itemWidth2]}>联系电话</Text>
            <Text style={[styles.itemText, styles.itemWidth1]}>服务商等级</Text>
          </View>
          <ServiceProviderItem list={list} onFooterLoad={this.onFooterLoad} onHeaderRefresh={this.onHeaderRefresh} loadingState={loadingState} />
        </View>
        <ShareBox closeShare={this.closeShare} showShareBox={showShareBox} shareImageUrl={shareImageUrl} shareTitle={shareTitle} shareText={shareText} fromSource="ShopOwnerList" />
      </View>
    );
  }
}
