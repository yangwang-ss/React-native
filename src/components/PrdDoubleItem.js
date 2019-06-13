import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Layout from '../constants/Layout';

export default class PrdDoubleItem extends React.Component {
  productItem = () => {
    const { item } = this.props;
    const { isReview } = global;

    let hasShopTitle = false;
    if (item && item.shopTitle) {
      hasShopTitle = true;
    }

    return (
      <TouchableOpacity style={[styles.itemWrap, item.needMR ? { marginRight: '4%' } : '']} onPress={() => this.jumpDetail(item)} activeOpacity={0.85}>
        <View style={styles.itemImg}>
          <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: item.imageUrl }} style={styles.itemImg} />
          {hasShopTitle && (
            <View style={styles.shopInfoWrap}>
              <Image source={item.source == 0 ? require('../../assets/icon-tb.png') : require('../../assets/icon-tm.png')} style={[styles.itemIcon]} />
              <Text numberOfLines={1} ellipsizeMode="clip" style={styles.shopTitle}>
                {item.shopTitle && item.shopTitle.substring(0, 5)}
              </Text>
            </View>
          )}
          {item.salesNum != '0' && (
            <View style={styles.salesWrap}>
              <Text style={styles.salesNum}>
                月销
                {item.salesNum}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.itemInfo}>
          <View style={{ overflow: 'hidden', height: Layout.scaleSize(32) }}>
            <Text numberOfLines={3} style={styles.itemTitle} ellipsizeMode="clip">
              {item.title}
            </Text>
          </View>
          <View style={styles.priceWrap}>
            <View style={styles.price}>
              <Text style={styles.priceSymbol}>￥</Text>
              <Text style={styles.priceNum}>{item.discountPrice}</Text>
              {+item.couponPrice > 0 && (
                <View style={styles.priceTextWrap}>
                  <Text style={styles.priceText}>券后价</Text>
                </View>
              )}
            </View>
          </View>
          {+item.buyAwardPrice > 0 ? (
            <View style={styles.jiangPriceTagWrap}>
              {+item.couponPrice > 0 ? (
                <View style={styles.priceTag}>
                  <Image source={require('../../assets/icon-quan.png')} style={styles.tagQuan} />
                  <LinearGradient style={styles.tagPrice} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FF78A5', '#FF568E']}>
                    <Text style={styles.tagPriceText}>￥{item.couponPrice}</Text>
                  </LinearGradient>
                </View>
              ) : null}
              {+item.buyAwardPrice > 0 && !isReview && (
                <LinearGradient style={styles.jiangPriceTag} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FDB666', '#FB9447']}>
                  <Text style={styles.tagPriceJiang}>奖: ￥{item.buyAwardPrice || 0}</Text>
                </LinearGradient>
              )}
            </View>
          ) : (
            <View style={styles.priceTagWrap}>
              <Text style={styles.defaultPrice}>￥{item.zkFinalPrice}</Text>
              {+item.couponPrice > 0 && (
                <View style={styles.priceTag}>
                  <Image source={require('../../assets/icon-quan.png')} style={styles.tagQuan} />
                  <LinearGradient style={styles.tagPrice} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FF78A5', '#FF568E']}>
                    <Text style={styles.tagPriceText}>￥{item.couponPrice}</Text>
                  </LinearGradient>
                </View>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  jumpDetail = item => {
    const { jumpDetail } = this.props;
    jumpDetail(item);
  };

  render() {
    return this.productItem();
  }
}

const styles = StyleSheet.create({
  itemWrap: {
    position: 'relative',
    width: '48%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  itemImg: {
    width: '100%',
    height: 165,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  salesWrap: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    zIndex: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  salesNum: {
    textAlign: 'center',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#fff',
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 6,
    paddingLeft: 6,
  },
  itemInfo: {
    marginTop: 8,
    paddingLeft: 6,
    paddingRight: 6,
  },
  itemTitle: {
    fontFamily: 'PingFangSC-Regular',
    height: 55,
    fontSize: Layout.scaleSize(12),
    lineHeight: Layout.scaleSize(16),
    color: '#333',
    position: 'relative',
  },
  itemIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  shopInfoWrap: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    zIndex: 3,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: '54%',
    height: 22,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 6,
  },
  shopTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#fff',
    width: '62.5%',
    marginLeft: 4,
  },
  priceWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
    marginBottom: 4,
  },
  price: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  priceSymbol: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 12,
    color: '#EA4457',
  },
  priceNum: {
    fontFamily: 'DINA',
    fontSize: 18,
    color: '#EA4457',
  },
  priceTextWrap: {
    width: 38,
    height: 14,
    borderRadius: 4,
    marginLeft: 5,
    textAlign: 'center',
    backgroundColor: 'rgba(234,68,87,0.20)',
    marginBottom: 2,
  },
  priceText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    textAlign: 'center',
    color: '#EA4457',
    lineHeight: 14,
  },
  sales: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    paddingBottom: 4,
  },
  quanPriceTag: {
    borderRadius: 2,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 2,
  },
  quanTagQuan: {
    width: 23,
    height: 23,
    resizeMode: 'contain',
  },
  quanTagPrice: {
    backgroundColor: '#ffcce6',
    height: 18,
    paddingRight: 4,
    borderBottomRightRadius: 2,
    borderTopRightRadius: 2,
  },
  quanTagPriceText: {
    fontFamily: 'PingFangSC-Medium',
    color: '#cc3d6d',
    fontSize: 12,
    lineHeight: 18,
  },
  jiangPriceTagWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 8,
  },
  priceTagWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  defaultPrice: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    lineHeight: 20,
    marginBottom: 8,
  },
  priceTag: {
    borderRadius: 2,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 2,
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
    paddingHorizontal: 4,
    height: 18,
  },
  tagPriceJiang: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#fff',
  },
});
