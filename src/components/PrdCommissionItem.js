import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';

export default class PrdColumnItem extends React.Component {
  state = {
    refresh: false,
  };

  productItem = () => {
    const { item } = this.props;
    const { isReview } = global;
    return (
      <TouchableOpacity style={styles.itemWrap} onPress={() => this.jumpDetail(item)} activeOpacity={1}>
        <View style={styles.itemContent}>
          <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: item.productImg }} style={styles.itemImg} />
          <View style={styles.itemInfo}>
            <View style={{ overflow: 'hidden', height: 38 }}>
              <Text numberOfLines={3} style={styles.itemTitle} ellipsizeMode="clip">{item.productName}</Text>
            </View>
            <View>
              <View style={styles.priceWrap}>
                <Text style={styles.price}>
                  <Text>￥</Text>
                  <Text style={styles.priceNum}>{item.salePrice}</Text>
                  <Text style={{ fontSize: 10, fontFamily: 'PingFangSC-Regular' }}> 专享价</Text>
                </Text>
                <Text style={styles.sales}>
月销
                  {item.volume || 0}
                </Text>
              </View>
              {
                +item.commission > 0 && !isReview
                && (
                <View style={styles.priceTag}>
                  <Image source={require('../../assets/commission-icon-jiang.png')} style={styles.tagJiang} />
                  <View style={styles.tagPrice}>
                    <Text style={styles.tagPrice}>
￥
                      {item.commission}
                    </Text>
                  </View>
                </View>
                )
              }
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

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
    padding: 4,
    backgroundColor: '#FFC991',
    borderRadius: 4,
    marginBottom: 8,
  },
  itemContent: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 4,
    borderRadius: 4,
  },
  itemImg: {
    flexShrink: 0,
    width: 128,
    height: 128,
    borderRadius: 4,
    backgroundColor: '#f4f4f4',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  itemTitle: {
    position: 'relative',
    fontSize: 14,
    fontFamily: 'PingFangSC-Medium',
    color: '#333',
    height: 50,
  },
  priceWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 35,
    marginBottom: 4,
  },
  price: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 12,
    color: '#FC4277',
  },
  priceNum: {
    fontSize: 18,
    fontFamily: 'DINA',
    paddingLeft: 5,
    paddingRight: 5,
  },
  sales: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    paddingBottom: 4,
  },
  priceTag: {
    borderRadius: 2,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagJiang: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  tagPrice: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FC4277',
    backgroundColor: '#FFE5CA',
    height: 18,
    lineHeight: 18,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    paddingRight: 4,
  },
});
