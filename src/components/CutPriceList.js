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
      <TouchableOpacity activeOpacity={0.85} onPress={isEdite ? () => this.choonseId(item.goodsId) : () => this.jumpDetail(item.goodsId)}>
        <View style={styles.pWrap}>
          {isEdite ? <Image style={styles.choiceImg} source={item.selected ? require('../../assets/personal/choiced.png') : require('../../assets/personal/noChoice.png')} /> : null}
          <Image style={styles.pImg} source={{ uri: item.pic}} />
          <View style={styles.pInfo}>
            <View style={styles.titleWrap}>
              <Text style={styles.prdTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
           <View style={styles.priceWrap}>
           <Text style={styles.priceLabelBox}>
              ¥
              <Text style={styles.priceCount}>{item.subscribePrice}</Text>{item.subscribeType}
            </Text>
            <Text style={styles.priceLabelBox}>
              ¥
              <Text style={styles.priceCount}>{item.endprice} </Text>{item.endType}
            </Text>
           </View>
            <View style={{...styles.priceWrap,paddingLeft:6,paddingRight:6}}>
              <View style={styles.boxLable}>
                <Text style={styles.priceSales}>订阅价</Text>
              </View>
              <View style={styles.boxLable}>
                {/* <Text style={styles.priceSales}>
                    当前价<Text style={{color:"#FC4277"}}>↑</Text>
                </Text> */}
                <Text style={styles.priceSales}>
                    当前价<Text style={item.compareTo=== -1?styles.color1:styles.color2}>{item.compareTo=== -1?'↑':item.compareTo=== 1?'↓':''}</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  color1: {
    color: '#FC4277',
  },
  color2: {
    color: '#5ED707',
  },
  pWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  boxLable: {
    width: 52,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 2,
    backgroundColor: '#F6F6F6',
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
    width: 205,
    // flex: 1,
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
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FF1472',
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
    color: '#666',
    display: 'flex',
    alignItems: 'center',
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
    marginBottom: 33,
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
