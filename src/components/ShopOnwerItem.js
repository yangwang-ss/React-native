import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingText from '@components/LoadingText';
import Toast from 'react-native-root-toast';
import { getIsStore } from '../services/api';
import Layout from '../constants/Layout';

const styles = StyleSheet.create({
  ownerWrap: {
    flex: 1,
  },
  ownerContainer: {
    flex: 1,
  },
  itemsWrap: {
    width: '100%',
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#fff',
  },
  shopOwnerName: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  shopOwnerIcon: {
    width: 49,
    height: 16,
    marginLeft: 4,
  },
  showOwnerItem: {
    width: '100%',
    flexDirection: 'row',
    borderBottomColor: '#efefef',
    borderBottomWidth: 0.5,
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 6,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 8,
  },
  infoList: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'PingFangSC-Medium',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    fontFamily: 'PingFangSC-Regular',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'PingFangSC-Regular',
  },
  text: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'PingFangSC-Medium',
  },
  salesManImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 2,
  },
  mesgLeft: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
  },
  showShop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showShopText: {
    color: '#fc4277',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
  },
  showShopIcon: {
    marginLeft: 4,
    marginTop: 2,
  },
  nameBox: {
    flexDirection: 'row',
    alignItems: 'center',
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
  salesmanWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salesmanAvatar: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: 2,
  },
  salesmanName: {
    fontFamily: 'PingFangSC-Regular',
    color: '#333',
    fontSize: 12,
  },
});

export default class ShopOnwerItem extends React.Component {
  constructor(props) {
    super(props);
    this.showToast = true;
  }

  getUserInfo = id => {
    const { getUserInfo } = this.props;
    getUserInfo(id);
  };

  async showShop(id) {
    const res = await getIsStore(id);
    if (res && res.isShow) {
      const { jumpPage } = this.props;
      jumpPage('ShopDetail', id);
    } else {
      if (this.showToast) {
        Toast.show(res.copywriting);
      }
      this.showToast = false;
      setTimeout(() => {
        this.showToast = true;
      }, 2000);
    }
  }

  onSort = type => {
    const { onSort } = this.props;
    onSort(type);
  };

  loadingText = () => {
    const { loadingState } = this.props;
    return <LoadingText loading={loadingState} />;
  };

  onFooterLoad = () => {
    const { onFooterLoad } = this.props;
    onFooterLoad();
  };

  onHeaderRefresh = () => {
    const { onHeaderRefresh } = this.props;
    onHeaderRefresh();
  };

  listComponent = ({ item, index }) => {
    const { shopOwnerList, isSalesman } = this.props;
    const isLine = shopOwnerList.length - 1 === index;
    return (
      <View style={styles.itemsWrap}>
        <View style={[styles.showOwnerItem, isLine && styles.noBorder]}>
          <Image style={styles.itemImage} source={{ uri: item.headimgurl }} />
          <View style={styles.itemInfo}>
            <View style={styles.shopOwnerName}>
              <TouchableOpacity style={styles.nameBox} onPress={() => this.getUserInfo(item.userId)} activeOpacity={Layout.activeOpacity}>
                <Text style={styles.name}>{item.nickname.length > 11 ? `${item.nickname.substr(0, 11)}...` : item.nickname}</Text>
                <Image style={styles.shopOwnerIcon} source={require('@assets/icon-shopOwner.png')} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.showShop} onPress={() => this.showShop(item.storeId)} activeOpacity={Layout.activeOpacity}>
                <Text style={styles.showShopText}>查看店铺</Text>
                <Ionicons style={styles.showShopIcon} name="ios-arrow-forward" size={14} color="#FC4277" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => this.getUserInfo(item.userId)} activeOpacity={Layout.activeOpacity}>
              <View style={styles.infoList}>
                <Text style={styles.time}>直升时间：{item.upTime}</Text>
              </View>
              <View style={styles.infoList}>
                <Text style={styles.infoText}>团队人数：</Text>
                <Text style={styles.text}>{item.memberAmount}</Text>
              </View>
              <View style={styles.infoList}>
                <Text style={styles.infoText}>本月预估收益：</Text>
                <Text style={styles.text}>￥{item.curmonthIncome || '0'}</Text>
              </View>
              <View style={styles.infoList}>
                <Text style={styles.infoText}>上月预估收益：</Text>
                <Text style={styles.text}>￥{item.lastmonthIncome || '0'}</Text>
              </View>
              <View style={styles.infoList}>
                <Text style={styles.infoText}>累计预估收益：</Text>
                <Text style={styles.text}>￥{item.historyIncome || '0'}</Text>
              </View>
              {!isSalesman && (
                <View style={styles.infoList}>
                  <Text style={styles.infoText}>业务员：</Text>
                  <View style={styles.salesmanWrap}>
                    {Boolean(item.salesmanHeadImgUrl) && <Image style={styles.salesmanAvatar} source={{ uri: item.salesmanHeadImgUrl }} />}
                    <Text style={styles.salesmanName}>{item.salesmanNickname}</Text>
                  </View>
                </View>
              )}
              <View style={styles.infoList}>
                <Text style={styles.infoText}>最近登录时间：</Text>
                <Text style={styles.infoText}>{item.lastLoginDate}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { shopOwnerList, order } = this.props;
    return (
      <View style={styles.ownerContainer}>
        <View style={styles.filterList}>
          <TouchableOpacity style={styles.filterItem} onPress={() => this.onSort('type1')} activeOpacity={Layout.activeOpacity}>
            <Text style={styles.sortTitle}>直升时间</Text>
            <View style={styles.triangle}>
              <View style={[styles.topTriangle, { borderBottomColor: order === 2 ? '#fc4277' : '#666' }]} />
              <View style={[styles.bottomTriangle, { borderTopColor: order === 1 ? '#fc4277' : '#666' }]} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterItem} onPress={() => this.onSort('type2')} activeOpacity={Layout.activeOpacity}>
            <Text style={styles.sortTitle}>团队人数</Text>
            <View style={styles.triangle}>
              <View style={[styles.topTriangle, { borderBottomColor: order === 4 ? '#fc4277' : '#666' }]} />
              <View style={[styles.bottomTriangle, { borderTopColor: order === 3 ? '#fc4277' : '#666' }]} />
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.ownerWrap}
          data={shopOwnerList}
          onEndReachedThreshold={0.1}
          keyExtractor={this._keyExtractor}
          renderItem={this.listComponent}
          onEndReached={this.onFooterLoad}
          ListFooterComponent={() => this.loadingText()}
          refreshControl={<RefreshControl refreshing={false} onRefresh={this.onHeaderRefresh} title="加载中..." />}
        />
      </View>
    );
  }
}
