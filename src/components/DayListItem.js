import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class DayListItem extends Component {
  state = {
    colors: [{
      value: ['#FF9D00', '#FFB700']
    }, {
      value: ['#4C9ADF', '#74B6F5']
    }, {
      value: ['#EC0F0F', '#FF2626']
    }],
  };

  render() {
    const { colors } = this.state;
    const { info } = this.props;
    return (
      <View style={styles.container}>
        {
          info.rankingTag ? (
            <LinearGradient
              style={styles.topLable}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              colors={colors[info.rankingTag - 1].value}
            >
              <Text style={styles.lableText}>{`NO.${info.rankingTag}`}</Text>
            </LinearGradient>
          ) : null
        }
        <Image style={styles.proImg} source={{ uri: info.picture }} />
        <View style={styles.proInfoWrap}>
          <View style={styles.proInfoBox}>
            <Text numberOfLines={1} style={styles.proTitle}>{info.title}</Text>
            <Text style={styles.saleTitle}>
              已售
              <Text style={styles.saleNum}>{info.buyNum}</Text>
              件
            </Text>
            {
              Boolean(info.coupon) ? (
                <View style={styles.priceTag}>
                  <Image source={require('../../assets/personal/quan.png')} style={styles.tagQuan} />
                  <View style={styles.tagPrice}>
                    <Text style={styles.tagPriceText}>￥{info.coupon}</Text>
                  </View>
                </View>
              ) : null
            }
          </View>
          {
            info.status === 0 ? (
              <View style={styles.proInfoBox}>
                <Text style={styles.originPrice}>{info.source}：￥{info.price}</Text>
                <Text style={styles.priceBox}>
                  ￥
                  <Text style={styles.priceText}>{info.discountPrice}</Text>
                  {info.coupon ? '券后' : '优惠价'}
                </Text>
              </View>
            ) : (
              <View style={styles.noPriceBox}>
                <Text style={styles.noPrice}>商品已抢光</Text>
              </View>
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 12,
    flexDirection: 'row',
  },
  topLable: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 55,
    height: 26,
    lineHeight: 26,
    textAlign: 'center',
    borderBottomRightRadius: 14,
    zIndex: 99,
    elevation: 99,
  },
  lableText: {
    lineHeight: 26,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
  },
  proImg: {
    width: 128,
    height: 128,
    borderRadius: 4,
    marginRight: 8,
  },
  proInfoWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    flex: 1,
  },
  proInfoBox: {
    width: '100%',
  },
  proTitle: {
    width: '100%',
    fontSize: 14,
    color: '#333',
    fontFamily: 'PingFangSC-Medium',
    marginBottom: 2,
  },
  saleTitle: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'PingFangSC-Regular',
  },
  saleNum: {
    fontSize: 13,
    color: '#FF9E05',
    fontFamily: 'PingFangSC-Medium',
  },
  priceTag: {
    borderRadius: 2,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 2,
    marginTop: 7,
  },
  tagQuan: {
    width: 24,
    height: 18,
    resizeMode: 'contain',
  },
  tagPrice: {
    height: 17.5,
    paddingRight: 4,
    borderBottomRightRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: '#FFE088'
  },
  tagPriceText: {
    fontFamily: 'PingFangSC-Regular',
    color: '#BC5E0A',
    fontSize: 12,
    paddingRight: 4,
  },
  originPrice: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
  },
  priceBox: {
    fontSize: 12,
    color: '#FC4277',
    fontFamily: 'PingFangSC-Semibold',
  },
  priceText: {
    fontSize: 22,
    color: '#FC4277',
    fontFamily: 'DINAlternate-Bold',
  },
  noPriceBox: {
    width: '94%',
    height: 30,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  noPrice: {
    fontSize: 12,
    color: '#bbb',
    fontFamily: 'PingFangSC-Regular',
    lineHeight: 30,
    textAlign: 'center',
  },
})
