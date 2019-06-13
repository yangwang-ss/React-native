import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Layout from '../constants/Layout';

export default class PrdColumnItem extends React.Component {
  state = {
    refresh: false,
  };

  productItem = () => {
    const { item } = this.props;
    return (
      <TouchableOpacity style={styles.itemWrap} onPress={() => this.jumpDetail(item)} activeOpacity={Layout.activeOpacity}>
        <FastImage source={{ uri: item.imageUrl }} style={styles.itemImg} resizeMode={FastImage.resizeMode.cover} />
        <View style={styles.itemInfo}>
          <Image source={item.source == 0 ? require('../../assets/icon-tb.png') : require('../../assets/icon-tm.png')} style={[styles.itemIcon, item.source == 0 ? '' : styles.itemIconTM]} />
          <View style={{ overflow: 'hidden', height: 38 }}>
            <Text numberOfLines={3} style={styles.itemTitle} ellipsizeMode="clip">{item.title}</Text>
          </View>
          {
            item.shopTitle
            && (
              <View style={styles.shopTagWrap}>
                <Image source={item.source == 0 ? require('../../assets/icon-tb.png') : require('../../assets/icon-tm.png')} style={[styles.itemIcon, item.source == 0 ? '' : styles.itemIconTM]} />
                <Text numberOfLines={1} ellipsizeMode="clip" style={styles.shopTitle}>{item.shopTitle}</Text>
              </View>
            )
          }
          <View style={styles.priceWrap}>
            <Text style={styles.price}>
              <Text>￥ </Text>
              <Text style={styles.priceNum}>{item.discountPrice}</Text>
              {
                +item.couponPrice > 0
                && <Text> 券后</Text>
              }
            </Text>
            <Text style={styles.sales}>
月销
              {item.salesNum}
            </Text>
          </View>
          <View style={styles.priceTagwrap}>
            {
              +item.couponPrice > 0
              && (
              <View style={styles.priceTag}>
                <Image source={require('../../assets/icon-quan.png')} style={styles.tagQuan} />
                <Text style={styles.tagPrice}>
￥
                  {item.couponPrice}
                </Text>
              </View>
              )
            }
            {
              +item.buyAwardPrice > 0
              && (
              <View style={styles.priceTag}>
                <Image source={require('../../assets/icon-jiang.png')} style={styles.tagJiang} />
                <Text style={styles.tagPriceJiang}>
￥
                  {item.buyAwardPrice}
                </Text>
              </View>
              )
            }
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  jumpDetail = (item) => {
    const { jumpDetail } = this.props;
    jumpDetail(item);
  };

  render() {
    return this.productItem();
  }
}

const styles = StyleSheet.create({
  itemWrap: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  itemImg: {
    width: 128,
    height: 128,
    borderRadius: 4,
    backgroundColor: '#f4f4f4',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 4,
    justifyContent: 'space-between',
  },
  itemTitle: {
    position: 'relative',
    fontSize: 14,
    fontFamily: 'PingFangSC-Medium',
    color: '#333',
    height: 50,
  },
  itemIconPlaceholder: {
    width: 30,
    height: 30,
    marginLeft: 30,
    paddingLeft: 80,
  },
  itemIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  itemIconTM: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  shopTagWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  shopTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  priceWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 32,
    marginBottom: 4,
  },
  price: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#d6040f',
  },
  priceNum: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingRight: 5,
  },
  sales: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    paddingBottom: 4,
  },
  priceTagwrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTag: {
    borderRadius: 2,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tagJiang: {
    width: 19,
    height: 19,
    resizeMode: 'contain',
  },
  tagQuan: {
    width: 23,
    height: 23,
    resizeMode: 'contain',
  },
  tagPrice: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 12,
    color: '#cc3d6d',
    backgroundColor: '#ffcce6',
    height: 18,
    lineHeight: 18,
    borderRadius: 2,
    paddingRight: 4,
  },
  tagPriceJiang: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#EA4457',
    backgroundColor: '#ffcce6',
    height: 18,
    lineHeight: 18,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    paddingRight: 4,
  },
});
