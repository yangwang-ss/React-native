import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, Text,
} from 'react-native';
import Swiper from 'react-native-swiper';

const styles = StyleSheet.create({
  bannerSwiper: {
    width: '100%',
    height: 68,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  bannerImgWrap: {
    width: '100%',
    height: 68,
    paddingLeft: 10,
    paddingRight: 10,
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vipBannerWrap: {
    width: '100%',
    height: 68,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    position: 'absolute',
    left: 10,
    right: 0,
  },
  vipBannerText1: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'PingFangSC-Medium',
    fontSize: 20,
    color: '#fff',
  },
  vipBannerText2: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#fff',
    letterSpacing: 4,
  },
});
export default class AdBannerComponents extends Component {
  bannerView = () => {
    const { banners, bannerJump } = this.props;
    const bannerArr = [];
    banners.map((item, i) => (
      bannerArr.push(
        <TouchableOpacity
          key={i}
          onPress={() => bannerJump(item, 'indexAd')}
          activeOpacity={1}
          style={styles.bannerImgWrap}
        >
          <Image style={styles.bannerImg} resizeMode="cover" source={{ uri: item.imageUrl || item.background }} />
          {
            item.isStoreInfo && (
              <View style={styles.vipBannerWrap}>
                <Text style={styles.vipBannerText1}>{item.name}</Text>
                <Text style={styles.vipBannerText2}>欢迎光临</Text>
              </View>
            )
          }
        </TouchableOpacity>
      )
    ));
    return bannerArr;
  };

  render() {
    const { banners, storeInfo } = this.props;
    if (banners.length < 1 && !storeInfo.background) {
      return null;
    }
    return (
      <Swiper
        containerStyle={styles.bannerSwiper}
        key={banners.length}
        autoplay
        loop
        activeDotColor="#fff"
        paginationStyle={{ bottom: 8 }}
        removeClippedSubviews={false}
      >
        {this.bannerView()}
      </Swiper>
    );
  }
}
