import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Layout from '../constants/Layout';

const styles = StyleSheet.create({
  titleWrap: {
    width: '100%',
    height: 35,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  titleBg: {
    width: 121,
    height: 12,
  },
  titleText: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    textAlign: 'center',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 12,
    color: '#333',
    lineHeight: 35,
  },
  firstItem: {
    position: 'relative',
    width: '100%',
    height: 185,
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  firstTitle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  firstText: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 16,
    color: '#de3c96',
    textAlign: 'center',
    marginRight: 18,
    marginLeft: 18,
  },
  firstBgIcon: {
    width: 17.6,
    height: 11.4,
  },
  firstBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  firstWrap: {
    position: 'absolute',
    top: 36,
    left: 0,
    width: Layout.window.width,
  },
  firstContent: {
    width: '100%',
    padding: 10,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  itemWrap: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    paddingBottom: 20,
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
    marginLeft: 4,
    justifyContent: 'space-between',
  },
  itemTitle: {
    position: 'relative',
    fontSize: Layout.scaleSize(14),
    color: '#333',
    lineHeight: Layout.scaleSize(20),
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
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
    paddingTop: 4,
    paddingBottom: 4,
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
    marginRight: 20,
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
});
type Props = {
  jumpDetail: Function,
  item: Object,
  index: number,
  showTitle: string,
  titleText: string,
  storeInfo: Object,
};
export default class PrdList extends React.PureComponent<Props> {
  jumpDetail = item => {
    const { jumpDetail } = this.props;
    jumpDetail(item);
  };

  render() {
    const { item, index, showTitle, titleText, storeInfo } = this.props;
    const { isReview } = global;

    let hasShopTitle = false;
    if (item && item.shopTitle) {
      hasShopTitle = true;
    }

    if (index == 0) {
      return (
        <TouchableOpacity onPress={() => this.jumpDetail(item)} activeOpacity={Layout.activeOpacity}>
          <View style={styles.firstItem}>
            <View style={styles.firstTitle}>
              <Image source={require('../../assets/bg-prd.png')} style={styles.firstBg} />
              <Image source={require('../../assets/bg-prd1.png')} style={styles.firstBgIcon} />
              <Text style={styles.firstText}>{storeInfo.name}为你精选</Text>
              <Image source={require('../../assets/bg-prd2.png')} style={styles.firstBgIcon} />
            </View>
            <View style={styles.firstWrap}>
              <View style={styles.firstContent}>
                <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: item.imageUrl }} style={styles.itemImg} />
                <View style={styles.itemInfo}>
                  <View style={{ overflow: 'hidden', height: Layout.scaleSize(39) }}>
                    <Text numberOfLines={3} style={styles.itemTitle}>
                      {item.title}
                    </Text>
                  </View>
                  <View style={styles.shopInfoWrap}>
                    {hasShopTitle && (
                      <View style={styles.shopTagWrap}>
                        <Image
                          source={item.source == 0 ? require('../../assets/icon-tb.png') : require('../../assets/icon-tm.png')}
                          style={[styles.itemIcon, item.source == 0 ? '' : styles.itemIconTM]}
                        />
                        <Text numberOfLines={1} ellipsizeMode="clip" style={styles.shopTitle}>
                          {item.shopTitle && item.shopTitle.substring(0, 12)}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.sales}>
                      月销
                      {item.salesNum}
                    </Text>
                  </View>
                  <View style={styles.priceWrap}>
                    <Text style={styles.price}>
                      <Text style={{ fontFamily: 'DINA' }}>￥ </Text>
                      <Text style={styles.priceNum}>{item.discountPrice}</Text>
                      <Text> 券后</Text>
                    </Text>
                  </View>
                  <View style={styles.priceTagwrap}>
                    {+item.couponPrice > 0 ? (
                      <View style={styles.priceTag}>
                        <Image source={require('../../assets/icon-quan.png')} style={styles.tagQuan} />
                        <LinearGradient style={styles.tagPrice} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FF78A5', '#FF568E']}>
                          <Text style={styles.tagPriceText}>￥{item.couponPrice}</Text>
                        </LinearGradient>
                      </View>
                    ) : (
                      <View />
                    )}
                    {+item.buyAwardPrice > 0 && !isReview && (
                      <LinearGradient style={styles.jiangPriceTag} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FDB666', '#FB9447']}>
                        <Text style={styles.tagPriceJiang}>奖: ￥{item.buyAwardPrice || 0}</Text>
                      </LinearGradient>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={() => this.jumpDetail(item)} activeOpacity={Layout.activeOpacity}>
        {showTitle && (
          <View style={styles.titleWrap}>
            <Image style={styles.titleBg} source={require('../../assets/search-title-bg.png')} />
            <Text style={styles.titleText}>{titleText}</Text>
          </View>
        )}
        <View style={styles.itemWrap}>
          <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: item.imageUrl }} style={styles.itemImg} />
          <View style={styles.itemInfo}>
            <View style={{ overflow: 'hidden', height: Layout.scaleSize(39) }}>
              <Text numberOfLines={3} style={styles.itemTitle}>
                {item.title}
              </Text>
            </View>
            <View style={styles.shopInfoWrap}>
              {hasShopTitle && (
                <View style={styles.shopTagWrap}>
                  <Image source={item.source == 0 ? require('../../assets/icon-tb.png') : require('../../assets/icon-tm.png')} style={[styles.itemIcon, item.source == 0 ? '' : styles.itemIconTM]} />
                  <Text numberOfLines={1} ellipsizeMode="clip" style={styles.shopTitle}>
                    {item.shopTitle && item.shopTitle.substring(0, 12)}
                  </Text>
                </View>
              )}
              <Text style={styles.sales}>
                月销
                {item.salesNum}
              </Text>
            </View>
            <View style={styles.priceWrap}>
              <Text style={styles.price}>
                <Text style={{ fontFamily: 'DINA' }}>￥ </Text>
                <Text style={styles.priceNum}>{item.discountPrice}</Text>
                {+item.couponPrice > 0 && <Text> 券后</Text>}
              </Text>
            </View>
            <View style={styles.priceTagwrap}>
              {+item.couponPrice > 0 ? (
                <View style={styles.priceTag}>
                  <Image source={require('../../assets/icon-quan.png')} style={styles.tagQuan} />
                  <LinearGradient style={styles.tagPrice} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FF78A5', '#FF568E']}>
                    <Text style={styles.tagPriceText}>￥{item.couponPrice}</Text>
                  </LinearGradient>
                </View>
              ) : (
                <View />
              )}
              {+item.buyAwardPrice > 0 && !isReview && (
                <LinearGradient style={styles.jiangPriceTag} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FB9447', '#FDB666']}>
                  <Text style={styles.tagPriceJiang}>奖: ￥{item.buyAwardPrice || 0}</Text>
                </LinearGradient>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
