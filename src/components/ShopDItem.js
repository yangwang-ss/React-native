import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ShopDetailItem extends Component {
  jumpDetail(id) {
    const { jumpDetail } = this.props;
    jumpDetail(id);
  }

  render() {
    const { data, index } = this.props;
    const { isReview } = global;
    return (
      <TouchableOpacity style={styles.pWrap} activeOpacity={0.85} onPress={() => this.jumpDetail(data.id)}>
        <View style={styles.pImgWrap}>
          <Image style={styles.pImg} source={{ uri: data.thumbnail }} />
          <View style={styles.pLabel}>
            <Text style={styles.pLabelText}>门店自营</Text>
          </View>
        </View>
        <View style={styles.pTitleWrap}>
          <View>
            <Text style={styles.pTitle} numberOfLines={2}>
              {data.title}
            </Text>
            <View style={styles.priceTagwrap}>
              {data.couponPrice > 0 ? (
                <View style={styles.priceTag}>
                  <Image source={require('../../assets/icon-quan.png')} style={styles.tagQuan} />
                  <LinearGradient style={styles.tagPrice} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FF78A5', '#FF568E']}>
                    <Text style={styles.tagPriceText}>￥{data.couponPrice}</Text>
                  </LinearGradient>
                </View>
              ) : null}
              {!isReview && data.awardPrice > 0 ? (
                <LinearGradient style={styles.jiangPriceTag} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FB9447', '#FDB666']}>
                  <Text style={styles.tagPriceJiang}>奖: ￥{data.awardPrice}</Text>
                </LinearGradient>
              ) : null}
            </View>
          </View>
          <View style={styles.priceWrap}>
            <Text style={styles.price}>
              <Text style={{ fontFamily: 'DINA' }}>￥</Text>
              <Text style={styles.priceNum}>{data.discountPrice}</Text>
              {data.couponPrice > 0 ? <Text>券后</Text> : null}
            </Text>

            <LinearGradient style={styles.buyNow} tart={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={['#FF497D', '#FF2BA8']}>
              <Text style={styles.buyText}>立即抢</Text>
              {/* <Image style={styles.buyImg} source={require('../../assets/right-white.png')} /> */}
              <Ionicons name="ios-arrow-forward" size={14} color="#fff" />
            </LinearGradient>
          </View>
          <View />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  pWrap: {
    flexDirection: 'row',
    height: 152,
    paddingTop: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EFEFEF',
  },
  pImgWrap: {
    position: 'relative',
    width: 128,
    borderRadius: 4,
    marginRight: 8,
  },
  pImg: {
    width: 128,
    height: 128,
    borderRadius: 4,
  },
  pLabel: {
    backgroundColor: '#FFC800',
    borderRadius: 2,
    paddingLeft: 6,
    paddingRight: 6,
    height: 18,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  pLabelText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 11,
    color: '#fff',
  },
  pTitleWrap: {
    flex: 1,
    position: 'relative',
  },
  pTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
  },
  priceTagwrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceTag: {
    borderRadius: 2,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 2,
    marginRight: 4,
  },
  tagQuan: {
    width: 24,
    height: 18,
    resizeMode: 'contain',
  },
  tagJiang: {
    width: 18,
    height: 18,
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
  priceWrap: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    // marginTop: 42,
    height: 31,
    marginBottom: 8,
    marginRight: 10,
    position: 'absolute',
    bottom: 3,
    left: 0,
  },
  price: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#EF317B',
  },
  priceNum: {
    fontSize: 22,
    paddingLeft: 5,
    paddingRight: 5,
    fontFamily: 'DINA',
  },
  buyNow: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 30,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#fff',
    marginRight: 3,
  },
  buyImg: {
    width: 6.6,
    height: 10,
    marginLeft: 2,
  },
});
