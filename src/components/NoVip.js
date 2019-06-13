import React from 'react';
import {
  View, Text, Image, StyleSheet,
} from 'react-native';

export default class NoVip extends React.Component {
  render() {
    return (
      <View>
        <View style={styles.iconWrap}>
          <View style={styles.iconTitleWrap}>
            <Image style={styles.iconTitleBg} resizeMode="contain" source={{ uri: 'http://family-img.vxiaoke360.com/vipIndex-title-bg.png' }} />
            <Text style={styles.iconTitleText}>VIP精选权益</Text>
          </View>
          <Text style={styles.iconTitle2}>天猫淘宝官方</Text>
          <Image style={styles.fitImg} source={{ uri: 'http://family-img.vxiaoke360.com/vipIndex-fit-img1.png' }} />
        </View>
        <View style={[styles.iconWrap, styles.iconWrap1]}>
          <View style={styles.iconTitleWrap}>
            <Image style={styles.iconTitleBg} resizeMode="contain" source={{ uri: 'http://family-img.vxiaoke360.com/vipIndex-title-bg.png' }} />
            <Text style={styles.iconTitleText}>超级大牌</Text>
          </View>
          <Image style={styles.fitImg} source={{ uri: 'http://family-img.vxiaoke360.com/vipIndex-fit-img2.png' }} />
        </View>
        <View style={styles.aboutWrap}>
          <View style={styles.iconTitleWrap}>
            <Image style={styles.iconTitleBg} resizeMode="contain" source={{ uri: 'http://family-img.vxiaoke360.com/vipIndex-title-bg.png' }} />
            <Text style={styles.iconTitleText}>关于米粒生活</Text>
          </View>
          <View style={styles.aboutTextWrap}>
            <Image style={styles.aboutBg} source={{ uri: 'http://family-img.vxiaoke360.com/vipIndex-text-wrap.png' }} />
            <Text style={styles.aboutBgContent}>
米粒生活创始团队来自阿里巴巴、网易等电商平台，由IDG资本领投4000万元天使轮投资。
              米粒生活是真正的0投资、0成本、0门槛、0囤货、0发货、0风险的优惠返佣平台，旨在帮用户在社交中分享优惠，在分享中创造价值。
            </Text>
          </View>
        </View>
        {/*
        <View style={styles.aboutWrap}>
          <View style={styles.iconTitleWrap}>
            <Image style={styles.iconTitleBg} resizeMode={'contain'} source={{uri: 'http://family-img.vxiaoke360.com/vipIndex-title-bg.png'}}/>
            <Text  style={styles.iconTitleText}>售后说明</Text>
          </View>
          <View style={styles.aboutTextWrap}>
            <Image style={styles.aboutBg} source={{uri: 'http://family-img.vxiaoke360.com/vipIndex-text-wrap.png'}}/>
            <View style={styles.aboutBgBox}>
              <Text style={styles.aboutBgText1}>会员有效期：</Text>
              <Text style={styles.aboutBgText2}><Text style={styles.aboutBgTextEmpty}>         </Text>付款之日起365天。</Text>
              <Text style={styles.aboutBgText1}>退换货说明：</Text>
              <Text style={styles.aboutBgText2}><Text style={styles.aboutBgTextEmpty}>         </Text>1、如商品出现质量问题，请与卖家联系，做换货处理；</Text>
              <Text style={styles.aboutBgText2}><Text style={styles.aboutBgTextEmpty}>         </Text>2、如退货，则立即收回VIP权益，已发放的奖励将一并收回。</Text>
            </View>
          </View>
        </View>
        */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  iconWrap: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 21,
    marginTop: 5,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  iconWrap1: {
    marginTop: 10,
  },
  fitImg: {
    width: '100%',
    height: 190,
    marginTop: 14,
    resizeMode: 'center',
  },
  iconTitleWrap: {
    width: '100%',
    height: 16,
    alignItems: 'center',
    position: 'relative',
  },
  iconTitleBg: {
    width: 286,
    height: 16,
  },
  iconTitleText: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 16,
    color: '#424242',
    position: 'absolute',
    top: -4,
    left: 0,
    width: '100%',
    textAlign: 'center',
  },
  iconTitle2: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 12,
    height: 17,
    lineHeight: 17,
    color: '#c1a16a',
    width: '100%',
    textAlign: 'center',
    marginTop: 15,
  },
  aboutWrap: {
    marginTop: 10,
    backgroundColor: '#FFF',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 21,
    paddingBottom: 50,
  },
  aboutTextWrap: {
    position: 'relative',
    width: '100%',
    marginTop: 20,
  },
  aboutBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 200,
    resizeMode: 'stretch',
  },
  aboutBgContent: {
    paddingLeft: 34,
    paddingRight: 28,
    paddingTop: 16,
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
    lineHeight: 26,
    color: '#424242',
  },
  aboutBgBox: {
    paddingLeft: 34,
    paddingRight: 28,
    paddingTop: 16,
    paddingBottom: 28,
  },
  aboutBgText1: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 15,
    lineHeight: 28,
    color: '#424242',
  },
  aboutBgText2: {
    paddingRight: 16,
    fontFamily: 'PingFangSC-Medium',
    fontSize: 14,
    lineHeight: 20,
    color: '#424242',
  },
  aboutBgTextEmpty: {
    width: 28,
    height: 14,
  },
});
