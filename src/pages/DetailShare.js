import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationEvents } from 'react-navigation';
import { getTKL } from '../services/api';
import ShareModal from '../components/ShareModal';
import Layout from '../constants/Layout';

export default class DetailShare extends Component {
  static navigationOptions = {
    title: '创建分享',
  };

  state = {
    userInfo: {},
    imgArr: [],
    imgCheckArr: [],
    shareImg: '',
    sharePrice: '0.00',
    shareTkl: '',
    checkedNum: 1,
    sharePage: '',
  };

  async componentDidMount() {
    const { params } = this.props.navigation.state;
    let list;
    if (params.imgArr.length) {
      list = params.imgArr.map(item => ({
        url: item,
        checked: false,
      }));
    }
    if (params.isStoreGoods) {
      const { invitationCode } = await storage.load({ key: 'userInfo' }).catch(e => e);
      const tkl =
        params.discountPrice > 0
          ? `${params.title}\n👇👇👇\n【在售价】￥${params.salePrice}\n【券后价】￥${
              params.discountPrice
            }\n打开米粒生活立即抢购\n-----------------\nhttps://www.vxiaoke360.com/H5/mlsh-download-yyb/index.html\n-----------------\n邀请码: ${invitationCode}`
          : `${params.title}\n👇👇👇\n【在售价】￥${params.salePrice}\n【优惠价】￥${
              params.discountPrice
            }\n打开米粒生活立即抢购\n-----------------\nhttps://www.vxiaoke360.com/H5/mlsh-download-yyb/index.html\n-----------------\n邀请码: ${invitationCode}`;
      this.setState({
        shareTkl: tkl,
      });
    } else {
      this.getPrdTKL(params.pid);
    }

    this.setState({
      sharePrice: params.sharePrice,
      shareImg: params.shareImg,
      imgArr: list,
      shareImageUrl: params.shareImageUrl,
      shareParams: {
        sharePage: params.sharePage,
        pid: params.pid,
      },
    });
  }

  didInit = () => {
    global.isShowSearchModal = false;
  };

  blur = () => {
    global.isShowSearchModal = true;
  };

  selectImg(index) {
    const arr = this.state.imgArr;
    arr[index].checked = !arr[index].checked;
    const list = [];
    arr.map(item => {
      if (item.checked) {
        list.push(item);
      }
    });
    this.setState({
      imgArr: arr,
      imgCheckArr: list,
      checkedNum: Number(list.length) + 1,
    });
  }

  renderImgArr() {
    const { imgArr } = this.state;
    const arr = [];
    imgArr.map((item, index) => {
      index <= 5 &&
        arr.push(
          <TouchableOpacity style={[styles.imgSmallBox, index == 2 || index == 3 ? styles.imgSpe : '']} key={index} onPress={() => this.selectImg(index)} activeOpacity={0.85}>
            <Image style={styles.imgSmall} source={{ uri: item.url }} />
            <Image style={styles.imgCheck} source={item.checked ? require('../../assets/icon-checked-red.png') : require('../../assets/icon-checked-gray.png')} />
          </TouchableOpacity>
        );
    });
    return arr;
  }

  // 获取淘口令
  async getPrdTKL(id) {
    const res = await getTKL(id);
    console.log('获取淘口令');
    if (res) {
      this.setState({
        shareTkl: res,
      });
    }
    return true;
  }

  render() {
    const { shareTkl, shareImg, sharePrice, shareImageUrl, imgCheckArr, checkedNum, shareParams } = this.state;
    if (!shareImg) {
      return null;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ width: '100%' }}>
          {!isReview && (
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FF3AAA', '#FC4277']} style={styles.headWrap}>
              <Image style={styles.headIcon} source={require('../../assets/icon-share-fits.png')} />
              <Text style={styles.headText}>奖励收益预估: ¥{sharePrice}</Text>
            </LinearGradient>
          )}
          <View style={styles.tklWrap}>
            <Text style={styles.tklText}>{shareTkl}</Text>
          </View>
          <View style={styles.titleWrap}>
            <Text style={styles.titleText1}>分享图片</Text>
            <Text style={styles.titleText2}>(已选择{checkedNum}张图片)</Text>
          </View>
          <View style={styles.imgWrap}>
            <View style={styles.imgContent}>
              <View style={styles.imgBigWrap}>
                <Image style={styles.imgBig} source={{ uri: shareImg }} />
                <Image style={styles.imgCheck} source={require('../../assets/icon-checked-red.png')} />
              </View>
              <View style={styles.imgSmallWrap}>{this.renderImgArr()}</View>
            </View>
          </View>
          <View style={{ height: 150 }} />
        </ScrollView>
        <View style={styles.fixedWrap}>
          <ShareModal shareParams={shareParams} shareTkl={shareTkl} imgArr={imgCheckArr} shareImg={shareImg} shareImageUrl={shareImageUrl} />
        </View>
        <NavigationEvents onDidFocus={() => this.didInit()} onWillBlur={() => this.blur()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f4f4',
    position: 'relative',
  },
  headWrap: {
    width: '100%',
    height: 36,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: 'pink',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  headText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#fff',
    lineHeight: 36,
  },
  tklWrap: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
  },
  tklText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  titleWrap: {
    height: 48,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleText1: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 18,
    color: '#333',
    lineHeight: 48,
  },
  titleText2: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    lineHeight: 48,
    marginLeft: 2,
  },
  imgWrap: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  imgContent: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 6,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imgBigWrap: {
    width: Layout.scaleSize(156),
    height: Layout.scaleSize(278),
    backgroundColor: '#fff',
    position: 'relative',
  },
  imgBig: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imgSmallWrap: {
    width: Layout.scaleSize(182),
    height: Layout.scaleSize(278),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imgSmallBox: {
    width: Layout.scaleSize(88),
    height: Layout.scaleSize(88),
    position: 'relative',
  },
  imgSmall: {
    width: Layout.scaleSize(88),
    height: Layout.scaleSize(88),
  },
  imgSpe: {
    marginTop: 6,
    marginBottom: 6,
  },
  imgCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    zIndex: 2,
  },
  fixedWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 20,
    width: '100%',
  },
});
