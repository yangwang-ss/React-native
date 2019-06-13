import React, { Component } from 'react';
import {
  StyleSheet, View, ImageBackground, Image, Text, FlatList, Animated, TouchableOpacity, Clipboard, AppState,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import RNAlibcSdk from 'react-native-alibc-sdk';
import { NavigationEvents } from 'react-navigation';
import { isTbAuth } from '../services/api';
import Layout from '../constants/Layout';
import authVerification from '../utils/authVerification';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export default class CartDetail extends Component {
  static navigationOptions = {
    title: '省钱购物车',
  }

  state = {
    list: [],
  }

  componentDidMount() {
    const result = this.props.navigation.getParam('data', 0);
    this.setState({
      ...result,
    });
    AppState.addEventListener('change', this._handleAppStateChange);
    this.init();
  }

  _handleAppStateChange =(nextAppState) => {
    if (nextAppState === 'active') {
      this.init();
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  init = async () => {
    // 防止渠道授权物理键返回引起的授权状态不正确的问题
    const authObj = (await storage.load({
      key: 'tbAuth',
    }).catch(e => e)) || {};
    if (authObj && authObj instanceof Object && !authObj.message) {
      if (authObj.isAuth) {
        const newAuthObj = await isTbAuth();
        storage.save({
          key: 'tbAuth',
          data: newAuthObj,
        });
      }
    }
  }

  onPressBuy = async (item) => {
    Clipboard.setString('');
    const isAuth = await authVerification({ navigation: this.props.navigation });
    if (isAuth) {
      RNAlibcSdk.show({
        type: 'url',
        payload: item.convertTbkUrl,
        openType: 'native',
      }, (err, info) => {
        if (!err) console.log(info);
        else console.log(err);
      });
    }
  }

  _renderItemComponent = ({ item, index }) => (
    <TouchableOpacity onPress={() => this.onPressBuy(item)} activeOpacity={Layout.activeOpacity}>
      <View style={styles.itemWrap}>
        <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: item.productImage }} style={styles.itemImg} />
        <View style={styles.itemInfo}>
          <View style={{ overflow: 'hidden', height: Layout.scaleSize(46) }}>
            <Text numberOfLines={3} style={styles.itemTitle}>{item.productName}</Text>
          </View>
          <View style={styles.shopInfoWrap}>
            <View style={styles.shopTagWrap}>
              <Image source={item.source == 0 ? require('../../assets/icon-tb.png') : require('../../assets/icon-tm.png')} style={[styles.itemIcon, item.source == 0 ? '' : styles.itemIconTM]} />
              <Text numberOfLines={1} ellipsizeMode="clip" style={styles.shopTitle}>{item.shopTitle && item.shopTitle.substring(0, 12)}</Text>
            </View>
          </View>
          <View style={styles.priceWrap}>
            <Text style={styles.price}>
              <Text style={{ fontFamily: 'DINA' }}>￥ </Text>
              <Text style={styles.priceNum}>{item.discountPrice}</Text>
              {
                        +item.couponPrice > 0 && <Text> 券后</Text>
                      }
              <Text style={styles.sales}>
                {' '}
已售
                {item.salesNum}
              </Text>
            </Text>
          </View>
          <View style={styles.priceTagwrap}>
            {
                      +item.couponPrice > 0 ? (
                        <View style={styles.priceTag}>
                          <Image source={require('../../assets/icon-quan.png')} style={styles.tagQuan} />
                          <LinearGradient
                            style={styles.tagPrice}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            colors={['#FF78A5', '#FF568E']}
                          >
                            <Text style={styles.tagPriceText}>
￥
                              {item.couponPrice}
                            </Text>
                          </LinearGradient>
                        </View>
                      ) : <View />
                    }
            {
                      +item.buyAwardPrice > 0 && !isReview && (
                        <LinearGradient
                          style={styles.jiangPriceTag}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          colors={['#FB9447', '#FDB666']}
                        >
                          <Text style={styles.tagPriceJiang}>
奖: ￥
                            {item.buyAwardPrice}
                          </Text>
                        </LinearGradient>
                      )
                    }
            <LinearGradient
              style={styles.cart}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={['#FC4277', '#FF099A']}
            >
              <Image source={require('../../assets/icon-cart.png')} style={{ width: 18, height: 18 }} />
            </LinearGradient>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  render() {
    const {
      list, totalCouponNum, totalConponPrice, totalBuyAwardPrice,
    } = this.state;
    return (
      <AnimatedFlatList
        style={styles.flatList}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          () => (
            <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#333' }}>暂无数据</Text>
            </View>
          )
        }
        ListHeaderComponent={() => (
          <ImageBackground source={require('../../assets/cart_bg2.png')} style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <Image source={require('../../assets/icon-cart-search2.png')} style={{ width: 16, height: 16 }} />
              <Text style={styles.text1}>搜索结果</Text>
            </View>
            <View style={styles.count}>
              <View style={styles.item}>
                <Text style={[styles.text, styles.text2]}>{totalCouponNum}</Text>
                <Text style={styles.text}>发现优惠券(张)</Text>
              </View>
              <View style={styles.item}>
                <Text style={[styles.text, styles.text2]}>{totalConponPrice}</Text>
                <Text style={styles.text}>可为你省钱(元)</Text>
              </View>
              <View style={styles.item}>
                <Text style={[styles.text, styles.text2]}>{totalBuyAwardPrice}</Text>
                <Text style={styles.text}>可为你赚钱(元)</Text>
              </View>
            </View>
          </ImageBackground>
        )}
        data={list}
        renderItem={this._renderItemComponent}
      >
        <NavigationEvents onDidFocus={() => this.init()} />
      </AnimatedFlatList>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  header: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  flatList: {
    flex: 1,
    backgroundColor: '#f6f5f6',
    paddingLeft: 12,
    paddingRight: 12,
  },
  text1: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  count: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 18,
  },
  item: {
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
  text2: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 22,
  },
  itemWrap: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  itemImg: {
    flexShrink: 0,
    width: 128,
    height: 128,
    borderRadius: 4,
    backgroundColor: '#d6d3d3',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  itemTitle: {
    position: 'relative',
    fontSize: Layout.scaleSize(15),
    color: '#333',
    lineHeight: Layout.scaleSize(24),
    fontFamily: 'PingFangSC-Medium',
    height: 80,
  },
  itemIconPlaceholder: {
    width: 30,
    height: 30,
    marginLeft: 30,
    paddingLeft: 30,
  },
  itemIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  itemIconTM: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  shopInfoWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopTagWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  shopTagIcon: {
    width: 10,
    height: 10,
    marginRight: 3,
  },
  shopTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  priceWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
    marginBottom: 8,
    marginRight: 10,
  },
  price: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#EF317B',
  },
  priceNum: {
    fontSize: 22,
    paddingLeft: 5,
    paddingRight: 5,
    fontFamily: 'DINA',
  },
  sales: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  priceTagwrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceTag: {
    borderRadius: 2,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 2,
    marginRight: 7,
  },
  tagQuan: {
    width: 24,
    height: 18,
    resizeMode: 'contain',
  },
  tagJiang: {
    width: 19,
    height: 19,
    resizeMode: 'contain',
  },
  tagPrice: {
    height: 18,
    paddingRight: 4,
    borderBottomRightRadius: 2,
    borderTopRightRadius: 2,
  },
  tagPriceText: {
    fontFamily: 'PingFangSC-Regular',
    color: '#fff',
    fontSize: 12,
    lineHeight: 18,
    paddingRight: 4,
  },
  jiangPriceTag: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 2,
    paddingVertical: 1,
    paddingHorizontal: 6,
    height: 18,
  },
  tagPriceJiang: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#fff',
  },
  cart: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    right: 0,
    bottom: 0,
  },
});
