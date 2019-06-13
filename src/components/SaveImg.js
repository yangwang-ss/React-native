import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image/src/index';
import Toast from 'react-native-root-toast';
import Swiper from 'react-native-swiper';
import saveFile from '../utils/saveFile';

export default class SaveImg extends Component {
  state = {
    canDo: true,
  };

  onPressClosefullPic = () => {
    const { onPressClosefullPic } = this.props;
    onPressClosefullPic();
  };

  onIndexChanged = index => {
    const { onIndexChanged } = this.props;
    onIndexChanged(index);
  };

  // 保存图片
  DownloadImage = async uri => {
    const { fileType } = this.props;
    if (this.state.canDo) {
      const file = await saveFile({ fileType, file: uri, location: 'album' });
      if (file) {
        Toast.show('保存成功');
        setTimeout(() => {
          this.setState({
            canDo: true,
          });
        }, 3000);
      } else {
        Toast.show('请开启手机权限');
        setTimeout(() => {
          this.setState({
            canDo: true,
          });
        }, 3000);
      }
    }
    this.setState({
      canDo: false,
    });
  };

  imgSwiperList() {
    const { fullPicInfo, screenHeight } = this.props;
    return fullPicInfo.map((item, i) =>
      item.height > screenHeight ? (
        <ScrollView key={i} style={styles.swiperImg}>
          <TouchableOpacity style={[styles.swiperImgBox, { height: item.height }]} activeOpacity={1} onPress={() => this.onPressClosefullPic()}>
            <FastImage key={i} style={[styles.bannerImg, { height: item.height }]} resizeMode={FastImage.resizeMode.cover} source={{ uri: item.src, priority: FastImage.priority.normal }} />
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView key={i} contentContainerStyle={[styles.swiperImg, styles.swiperImgSmall]}>
          <TouchableOpacity style={[styles.swiperImgBox, { height: item.height }]} activeOpacity={1} onPress={() => this.onPressClosefullPic()}>
            <FastImage key={i} style={[styles.bannerImg, { height: item.height }]} resizeMode={FastImage.resizeMode.cover} source={{ uri: item.src, priority: FastImage.priority.normal }} />
          </TouchableOpacity>
        </ScrollView>
      )
    );
  }

  render() {
    const { fullPicInfo, imgSwiperIndex } = this.props;
    return (
      <TouchableOpacity activeOpacity={1} style={styles.fullPicWrap} onPress={() => this.onPressClosefullPic()}>
        <View style={styles.imgSwiperBox}>
          <Swiper
            containerStyle={styles.bannerSwiper}
            activeDotColor="#fff"
            paginationStyle={{ bottom: 8 }}
            removeClippedSubviews={false}
            loop={false}
            index={imgSwiperIndex}
            onIndexChanged={index => this.onIndexChanged(index)}
          >
            {this.imgSwiperList()}
          </Swiper>
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={() => this.DownloadImage(fullPicInfo[imgSwiperIndex].src)}>
          <Text style={styles.saveBtnText}>保存相册</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  fullPicWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9,
    elevation: 9,
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
  },
  saveBtn: {
    width: 80,
    height: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 24,
    position: 'absolute',
    bottom: 24,
    right: 16,
    zIndex: 999,
  },
  saveBtnText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
    lineHeight: 32,
    textAlign: 'center',
  },
  imgSwiperBox: {
    width: '100%',
    height: '100%',
  },
  bannerSwiper: {
    width: '100%',
    height: '100%',
  },
  swiperImg: {
    width: '100%',
    height: '100%',
  },
  swiperImgBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  swiperImgSmall: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerImg: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
});
