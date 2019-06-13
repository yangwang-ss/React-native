import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Layout from '../constants/Layout';

export default class RechargeItem extends React.Component {
  productItem = () => {
    const { item } = this.props;
    const { isReview } = global;

    return (
      <TouchableOpacity style={[styles.itemWrap, item.needMR ? { marginRight: '4%' } : '']} onPress={() => this.jumpDetail(item)} activeOpacity={0.85}>
        <View style={styles.itemImg}>
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={{ uri: item.imageUrl }}
            style={styles.itemImg}
          />
        </View>
        <View style={styles.itemInfo}>
          <View style={{ overflow: 'hidden', height: Layout.scaleSize(32) }}>
            <Text numberOfLines={3} style={styles.itemTitle}>
              <Image source={item.source != 0 ? require('../../assets/icon-tb.png') : require('../../assets/icon-tm.png')} style={styles.itemIcon} />
              {item.title}
            </Text>
          </View>
          <View style={styles.jiangPriceTagWrap}>
            {
              +item.buyAwardPrice > 0 && !isReview && (
                <View style={styles.jiangPriceTag}>
                  <Text style={styles.tagPriceJiang}>
奖￥
                    {item.buyAwardPrice || 0}
                  </Text>
                </View>
              )
            }
            {
              +item.couponPrice > 0 && (
                <View style={styles.quanPriceTag}>
                  <Image source={require('../../assets/recharge-icon-quan.png')} style={styles.quanTagQuan} />
                  <View style={styles.quanTagPrice}>
                    <Text style={styles.quanTagPriceText}>
￥
                      {item.couponPrice}
                    </Text>
                  </View>
                </View>
              )
            }
          </View>
          <View style={styles.priceWrap}>
            <View style={styles.price}>
              <Text style={styles.priceSymbol}>￥</Text>
              <Text style={styles.priceNum}>{item.discountPrice}</Text>
              <Text style={styles.priceText}>券后</Text>
              <Text style={styles.priceDefault}>
￥
                {item.zkFinalPrice}
              </Text>
            </View>
          </View>
          <View style={styles.salesWrap}>
            <Text style={styles.salesNum}>
月销
              {item.salesNum}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * 事件绑定
   */
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
    position: 'relative',
    width: '48%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#FC4277',
    lineHeight: 18,
  },
  priceText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#FC4277',
    lineHeight: 18,
  },
  priceDefault: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  priceNum: {
    fontFamily: 'DINA',
    fontSize: 22,
    color: '#FC4277',
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
  },
  quanTagQuan: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  quanTagPrice: {
    backgroundColor: '#FFE088',
    height: 18,
    paddingRight: 6,
    borderBottomRightRadius: 2,
    borderTopRightRadius: 2,
  },
  quanTagPriceText: {
    fontFamily: 'PingFangSC-Regular',
    color: '#BC5E0A',
    fontSize: 12,
    lineHeight: 18,
  },
  jiangPriceTagWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 2,
    marginBottom: 4,
  },
  priceTagWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  priceTag: {
    borderRadius: 2,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
    marginRight: 10,
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
  tagQuan: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  tagJiang: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
  },
  jiangPriceTag: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEE3EB',
    height: 18,
    borderRadius: 2,
    paddingLeft: 4,
    paddingRight: 4,
    marginRight: 6,
  },
  tagPrice: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#fff',
    backgroundColor: '#FF2C3D',
    height: 16,
    lineHeight: 16,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    paddingRight: 1,
    overflow: 'hidden',
    marginRight: 4,
  },
  tagPriceJiang: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FC4277',
  },
  itemIcon: {
    width: 13,
    height: 13,
    marginRight: 6,
    resizeMode: 'contain',
  },
  salesWrap: {
    justifyContent: 'flex-start',
    marginBottom: 6,
  },
  salesNum: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
});
