import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class CollectList extends React.Component {
  jumpDetail = item => {
    const { jumpDetail } = this.props;
    jumpDetail(item);
  };

  choonseId = id => {
    const { updateData } = this.props;
    updateData(id);
  };

  render() {
    const { product, isEdite } = this.props;
    const { isReview } = global;
    const { item } = product;
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={isEdite ? () => this.choonseId(item.id) : () => this.jumpDetail(item.id)}>
        <View style={styles.pWrap}>
          {isEdite ? <Image style={styles.choiceImg} source={item.selected ? require('../../assets/personal/choiced.png') : require('../../assets/personal/noChoice.png')} /> : null}
          <Image style={styles.pImg} source={{ uri: item.imageUrls[0] }} />
          <View style={styles.pInfo}>
            <View style={styles.titleWrap}>
              {
                item.tagDesc && (
                  <LinearGradient
                    style={styles.titleLabelWrap}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    colors={item.tagDesc.color}
                  >
                    <Text style={styles.prdIcon}>{item.tagDesc.name}</Text>
                  </LinearGradient>
                )
              }
              <Text style={styles.prdTitle} numberOfLines={2}>
                {item.tagDesc && (
                  <Text style={styles.prdTitleIndent}>
                    {item.tagDesc.name}
                    {item.tagDesc.name.substr(0, 2)}
                  </Text>
                )}
                {item.title}
              </Text>
            </View>
            <View style={styles.priceWrap}>
              <View style={{...styles.priceWrap1}}>
                <Image style={styles.pIcon} source={item.source == 0 ? require('../../assets/myCollect-icon-tb.png') : require('../../assets/myCollect-icon-tm.png')} />
                <Text style={styles.priceSales}>{item.shopTitle.length > 12 ? `${item.shopTitle.substr(0, 12)}...` : item.shopTitle}</Text>
              </View>
              <Text style={styles.priceSales}>
                月销
                {item.salesNum}
              </Text>
            </View>
            <Text style={styles.priceLabelBox}>
              ¥
              <Text style={styles.priceCount}>{item.discountPrice} </Text>
              {
                item.couponPrice > 0 ? '券后' : '优惠价'
              }
            </Text>
            <View style={styles.priceTagwrap}>
              {item.couponPrice > 0 ? (
                <View style={styles.priceTag}>
                  <Image source={require('../../assets/icon-quan.png')} style={styles.tagQuan} />
                  <LinearGradient style={styles.tagPrice} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} colors={['#FF78A5', '#FF568E']}>
                    <Text style={styles.tagPriceText}>￥{item.couponPrice}</Text>
                  </LinearGradient>
                </View>
              ) : (
                <View />
              )}
              {item.sharePrice > 0 && !isReview && (
                <LinearGradient style={styles.jiangPriceTag} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FB9447', '#FDB666']}>
                  <Text style={styles.tagPriceJiang}>奖: ￥{item.sharePrice || 0}</Text>
                </LinearGradient>
              )}
            </View>

          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  pWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  choiceImg: {
    width: 24,
    height: 24,
    marginLeft: 8,
    marginRight: 24,
  },
  pImg: {
    width: 128,
    height: 128,
    borderRadius: 4,
  },
  pInfo: {
    height: 128,
    paddingLeft: 8,
    flex: 1,
  },
  pIcon: {
    width: 14,
    height: 14,
    marginRight: 3,
  },
  priceWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceWrap1: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabelBox: {
    marginTop: 13,
    marginBottom: 12,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FF1472',
    width: '100%',
  },
  priceCount: {
    fontFamily: 'DINA',
    fontSize: 22,
    height: 23,
    color: '#FC4277',
    marginLeft: 3,
    marginRight: 3,
  },
  priceLabelWrap: {
    paddingLeft: 2,
    paddingRight: 2,
    borderRadius: 2,
    marginBottom: 2,
    marginLeft: 4,
    height: 12,
  },
  priceSales: {
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
    textAlign: 'center',
    paddingRight: 4,
  },
  jiangPriceTag: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 2,
    paddingVertical: 1,
    paddingHorizontal: 6,
    height: 18,
    marginLeft: 4,
  },
  tagPriceJiang: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#fff',
  },
  titleWrap: {
    position: 'relative',
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  titleLabelWrap: {
    flexDirection: 'row',
    position: 'absolute',
    top: 1,
    left: 0,
    zIndex: 99,
    elevation: 99,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 2,
    paddingLeft: 8,
    paddingRight: 8,
  },
  prdIcon: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 18,
    width: '100%',
  },
  prdTitleIndent: {
    fontFamily: 'PingFangSC-Regular',
    color: '#fff',
    fontSize: 10,
    opacity: 0,
  },
  prdTitle: {
    flex: 1,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
  },
});
