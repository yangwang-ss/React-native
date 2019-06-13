import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Layout from '../constants/Layout';

export default class ShopListItem extends Component {
  jumpShopDetail(id) {
    const { jumpDetail } = this.props;
    jumpDetail(id);
  }

  renderPlist() {
    const { goodsVOS } = this.props.data;
    const arr = [];
    console.log(this.props.data, goodsVOS);
    if (goodsVOS) {
      goodsVOS.map((item, index) => {
        if (index <= 2) {
          arr.push(
            <View style={[styles.pWrap, index == 1 && styles.margin12]} key={index}>
              <Image style={styles.pImg} source={{ uri: item.thumbnail }} />
              <Text style={styles.pTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.pPrice}>
                ¥<Text style={styles.pPriceNum}>{item.discountPrice}</Text>
              </Text>
            </View>
          );
        }
      });
    }
    return arr;
  }

  renderTagList(i) {
    const { tagList } = this.props.data;
    const arr = [];
    tagList.map((item, index) => {
      arr.push(
        <View key={index} style={[styles.labelBg, i % 3 == 1 ? styles.labelBg2 : i % 3 == 2 ? styles.labelBg3 : '']}>
          <Text style={[styles.labelText, i % 3 == 1 ? styles.labelText2 : i % 3 == 2 ? styles.labelText3 : '']}>{item}</Text>
        </View>
      );
    });
    return arr;
  }

  render() {
    const { data, index } = this.props;
    return (
      <TouchableOpacity style={styles.listWrap} activeOpacity={0.85} onPress={() => this.jumpShopDetail(data.id)}>
        {index == 0 ? <Image source={require('../../assets/Shop/shoplist-bg.png')} style={styles.listBg} /> : null}
        <View style={styles.listContentWrap}>
          <View style={styles.listContent}>
            <Image
              source={index % 3 == 0 ? require('../../assets/Shop/list-bg1.png') : index % 3 == 1 ? require('../../assets/Shop/list-bg2.png') : require('../../assets/Shop/list-bg3.png')}
              resizeMode="stretch"
              style={styles.listContentBg}
            />

            <View style={styles.listTop}>
              <View style={styles.topLeft}>
                <Image style={styles.shopIcon} source={{ uri: data.icon }} />
                <View style={styles.shopNameWrap}>
                  <Text style={styles.shopName} numberOfLines={1}>
                    {data.name}
                  </Text>
                  <View style={styles.shopTitle} />
                  <Text style={styles.shopTitleText} numberOfLines={1}>
                    {data.ranking || data.introduce}
                  </Text>
                </View>
              </View>
              <View style={styles.topRight}>
                <Image style={styles.rangeIcon} source={require('../../assets/Shop/moods.png')} />
                <Text style={styles.rangeText}>{data.hotValue}</Text>
              </View>
            </View>
            <View style={styles.labelWrap}>{this.renderTagList(index)}</View>
            <View style={styles.pContent}>{this.renderPlist()}</View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  listWrap: {
    width: '100%',
    position: 'relative',
    marginBottom: 12,
    minHeight: Layout.scaleSize(244),
  },
  listBg: {
    width: '100%',
    paddingTop: 10,
    height: 150,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  listContentWrap: {
    width: '100%',
    paddingLeft: 12,
    paddingRight: 12,
  },
  listContent: {
    width: '100%',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    position: 'relative',
  },
  listContentBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Layout.window.width - 24,
    height: Layout.scaleSize(244),
  },
  listTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopIcon: {
    width: 44,
    height: 44,
  },
  shopNameWrap: {
    width: 190,
    marginLeft: 8,
    height: 44,
    position: 'relative',
  },
  shopName: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 15,
    color: '#333',
  },
  shopTitle: {
    height: 18,
    marginTop: 5,
  },
  shopTitleText: {
    maxWidth: 190,
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingLeft: 6,
    paddingRight: 6,
    height: 18,
    alignItems: 'center',
    backgroundColor: '#FFC800',
    borderRadius: 2,
    marginTop: 5,
    fontFamily: 'PingFangSC-Medium',
    fontSize: 11,
    color: '#fff',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rangeIcon: {
    width: 15,
    height: 20,
    marginRight: 4,
  },
  rangeText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  labelBg: {
    paddingLeft: 6,
    paddingRight: 6,
    height: 18,
    alignItems: 'center',
    marginRight: 4,
    backgroundColor: '#FFDFE8',
    borderRadius: 2,
    marginTop: 8,
  },
  labelBg2: {
    backgroundColor: '#FFE0C6',
  },
  labelBg3: {
    backgroundColor: '#FFEEA5',
  },
  labelText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FC4277',
  },
  labelText2: {
    color: '#FF6A0C',
  },
  labelText3: {
    color: '#E89801',
  },
  pContent: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    marginTop: 16,
  },
  margin12: {
    marginLeft: Layout.scaleSize(12),
    marginRight: Layout.scaleSize(12),
  },
  pWrap: {
    width: Layout.scaleSize(100),
  },
  pImg: {
    width: '100%',
    height: Layout.scaleSize(100),
    resizeMode: 'cover',
  },
  pTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#333',
    marginTop: 5,
  },
  pPrice: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FC4277',
  },
  pPriceNum: {
    fontFamily: 'DINA',
    fontSize: 18,
  },
});
