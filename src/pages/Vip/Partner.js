import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, StatusBar, Platform, ScrollView, TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image/src/index';
import LinearGradient from 'react-native-linear-gradient';
import { BoxShadow } from 'react-native-shadow';
import Swiper from 'react-native-swiper';
import Toast from 'react-native-root-toast';
import { getPartnerBanner, vipBuyUpdate } from '../../services/api';
import Layout from '../../constants/Layout';

const memberShadow = {
  width: 106,
  height: 30,
  color: '#1D2026',
  border: 12,
  radius: 10,
  opacity: 0.3,
  x: 0,
  y: 0,
  style: { position: 'absolute', left: 18, top: 16 },
};

const bannerShadow = {
  width: 372,
  height: 207,
  color: '#000',
  border: 12,
  radius: 0,
  opacity: 0.2,
  x: 0,
  y: 0,
  style: { position: 'absolute', left: 21, top: 60 },
};

export default class OrderConfirm extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    canDo: true,
    bannerList: [],
    price: 0,
  };

  componentWillMount() {
    this.getPartnerBanner();
  }

  /**
   * 事件绑定
   */
  onPressGoBack = () => {
    this.props.navigation.goBack();
  };

  getImgHeight = async (list) => {
    const screenWidth = Layout.window.width;
    const srcArray = [...list];
    const getImgH = uri => new Promise((resolve, reject) => {
      console.log('uri===', uri);
      Image.getSize(uri, (width, height) => {
        const imgH = Math.floor(screenWidth / width * height);
        resolve(imgH);
      });
    });
    const imgArr = [];
    let index = 0;
    const setImg = async (uri) => {
      const imgH = await getImgH(uri);
      const imgItem = { src: uri, imgH };
      imgArr.push(imgItem);
      index++;
      if (index < list.length) {
        const item = srcArray[index];
        setImg(item);
      } else {
        this.setState({
          bannerList: imgArr,
        });
      }
    };
    setImg(srcArray[index]);
  };


  async onPressVipUpdate() {
    const { canDo } = this.state;
    if (!canDo) return;
    this.setState({ canDo: false });
    const res = await vipBuyUpdate();
    console.log('===', res);
    if (res) {
      const {
        sign, prepayId, partnerId, packageValue, nonceStr, timeStamp, orderId,
      } = res;
      const payParams = {
        partnerId, prepayId, nonceStr, timeStamp, package: packageValue, sign,
      };
      console.log('payParams====', payParams);
      WeChat
        .pay(payParams)
        .then((res) => {
          console.log('WeChat pay===', res);
          Toast.show('支付成功，即将跳转...', {
            duration: 1200,
            position: 0,
          });
          setTimeout(() => {
            this.props.navigation.navigate('OrderSuccess');
          }, 1000);
        })
        .catch((err) => {
          console.log('WeChat pay===err', err);
        });
    }
    setTimeout(() => {
      this.setState({ canDo: true });
    }, 5000);
  }


  async getPartnerBanner() {
    const res = await getPartnerBanner();
    console.log('banner======', res);
    if (res) {
      const bannerList = res && res.pictures || [];
      this.getImgHeight(bannerList);
      this.setState({
        price: res.price,
      });
    }
  }

  bannerList() {
    const { bannerList } = this.state;
    return bannerList.map((item, i) => (
      <FastImage key={i} style={{ width: '100%', height: item.imgH, borderRadius: 8 }} source={{ uri: item.src }} resizeMode={FastImage.resizeMode.contain} />
    ));
  }

  render() {
    const { bannerList, price } = this.state;
    return (
      <ScrollView style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="#333" />
        <TouchableOpacity style={styles.btnBackWrap} onPress={this.onPressGoBack}>
          <Image style={styles.btnIconBack} source={require('../../../assets/detail/icon-back-white.png')} />
        </TouchableOpacity>
        <Image style={styles.partnerBg} source={{ uri: 'https://image.vxiaoke360.com/Fok6P2lm-MIYhHnHuLkc-K7BWBDr' }} />
        <View style={styles.banenrWrapBox}>
          <BoxShadow setting={bannerShadow} />
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={['#e1cda1', '#be9d65']}
            style={styles.banenrWrap}
          >
            <View style={styles.bannerTitleHeight}>
              <View style={styles.iconTitleWrap}>
                <Image style={styles.iconTitleBg} resizeMode="contain" source={{ uri: 'http://family-img.vxiaoke360.com/vipIndex-title-bg.png' }} />
                <Text style={styles.iconTitleText}>尊享超级权益</Text>
              </View>
            </View>
            <View style={styles.bannerContent}>
              {
                bannerList.length > 0
                && (
                <Swiper
                  loop
                  autoplay
                  autoplayTimeout={Platform.OS === 'ios' ? 2.5 : 4}
                  autoplayTimeout={4}
                  horizontal
                  scrollEnabled
                  showsButtons={false}
                  showsPagination
                  paginationStyle={{ bottom: 4 }}
                  dot={(
                    <View style={{
                      backgroundColor: 'rgba(66,66,66, 0.2)',
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      marginRight: 4,
                    }}
                    />
)}
                  activeDot={(
                    <View style={{
                      backgroundColor: 'rgba(66,66,66, 0.7)',
                      width: 12,
                      height: 6,
                      borderRadius: 3,
                      marginRight: 4,
                    }}
                    />
)}
                  removeClippedSubviews={false}
                >
                  {this.bannerList()}
                </Swiper>
                )
              }
            </View>
          </LinearGradient>
        </View>
        <View style={styles.memberWrap}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={['#E2CFA3', '#D6C094']}
            style={styles.memberBox}
          >
            <Text style={styles.memberTitle}>会员有效期：</Text>
            <Text style={styles.memberText}>付款之日升级为合伙人</Text>
            <Text style={styles.memberTitle}>会员注册费用：</Text>
            <Text style={styles.memberText}>一旦支付，不支持退款。</Text>
            <View style={styles.totalBox}>
              <View style={styles.textBox}>
                <Text style={styles.totalTitle}>总计：￥</Text>
                <Text style={styles.totalText}>{price}</Text>
              </View>
              <View>
                <BoxShadow setting={memberShadow} />
                <TouchableOpacity style={styles.btnUpdateWrap} activeOpacity={0.85} onPress={() => this.onPressVipUpdate()}>
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['#262626', '#4E4D4D']}
                    style={styles.btnWrap}
                  >
                    <Text style={styles.btnText}>立即升级</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    width: Layout.window.width,
    height: Layout.window.height,
  },
  btnBackWrap: {
    position: 'absolute',
    left: 4,
    top: 30,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  btnIconBack: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  partnerBg: {
    height: 287,
    width: '100%',
  },
  banenrWrapBox: {
    paddingLeft: 16,
    paddingRight: 16,
    height: 255,
    position: 'relative',
    top: -38,
  },
  banenrWrap: {
    width: '100%',
    borderRadius: 8,
  },
  bannerTitleHeight: {
    paddingBottom: 16,
  },
  iconTitleWrap: {
    width: '100%',
    height: 16,
    alignItems: 'center',
    position: 'relative',
    marginTop: 19,
  },
  iconTitleBg: {
    width: 286,
    height: 16,
  },
  iconTitleText: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    position: 'absolute',
    top: -4,
    left: 0,
    width: '100%',
    textAlign: 'center',
  },
  bannerContent: {
    backgroundColor: '#fff',
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
  },
  memberWrap: {
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 20,
    paddingBottom: 55,
  },
  memberBox: {
    height: 233,
    width: '100%',
    borderRadius: 8,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
  },
  memberTitle: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 15,
    color: '#424242',
    marginBottom: 10,
  },
  memberText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#000',
    marginBottom: 10,
    marginLeft: 18,
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  textBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
  },
  totalTitle: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 15,
    color: '#424242',
    lineHeight: 28,
  },
  totalText: {
    fontSize: 26,
    fontFamily: 'PingFangSC-Semibold',
    color: '#424242',
  },
  btnWrap: {
    width: 140,
    height: 49,
    borderRadius: 100,
  },
  btnText: {
    fontSize: 18,
    fontFamily: 'PingFangSC-Semibold',
    color: '#FFE4B1',
    lineHeight: 49,
    textAlign: 'center',
  },
});
