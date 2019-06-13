import React from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import Swiper from 'react-native-swiper';

const styles = StyleSheet.create({
  bannerSwiper: {
    width: '100%',
    height: 142,
    alignSelf: 'center',
  },
  bannerImgWrap: {
    width: '100%',
    height: 142,
    paddingLeft: 10,
    paddingRight: 10,
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
type Props = {
  banners: Array,
  bannerJump: Function,
};
export default class Index extends React.Component<Props> {
  shouldComponentUpdate(nextProps) {
    const { banners } = this.props;
    return nextProps.length !== banners.length;
  }

  render() {
    const { banners, bannerJump } = this.props;
    if (banners.length < 1) {
      return null;
    }
    const bannerView = banners.map((item, i) => (
      <TouchableOpacity
        key={i}
        onPress={() => bannerJump(item, 'banner')}
        activeOpacity={1}
        style={styles.bannerImgWrap}
      >
        <Image style={styles.bannerImg} resizeMode="cover" source={{ uri: item.imageUrl }} />
      </TouchableOpacity>
    ));
    return (
      <Swiper
        containerStyle={styles.bannerSwiper}
        ref="scrollView"
        autoplay
        loop
        activeDotColor="#fff"
        paginationStyle={{ bottom: 8 }}
        removeClippedSubviews={false}
      >
        {bannerView}
      </Swiper>
    );
  }
}
