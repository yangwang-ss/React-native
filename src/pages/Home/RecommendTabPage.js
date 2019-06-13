import React from 'react';
import { View, StyleSheet, Image, Platform, TouchableOpacity, Text, FlatList, RefreshControl, InteractionManager } from 'react-native';
import FastImage from 'react-native-fast-image';
import SwiperV from '@nart/react-native-swiper';
import Layout from '@constants/Layout';
import RNAlibcSdk from 'react-native-alibc-sdk';
import Products from '@components/PrdList';
import BannerComponent from './BannerComponent';
import ActiveCategoryComponent from './ActiveCategoryComponent';
import { getBanners, getActiveCategory, getNotice, getAdImgs, getIndexProducts } from '@api';
import styles from './indexStyle';

export default class Index extends React.Component {
  state = {
    banners: [],
    activeCategory: [],
    prefecture: [],
    noticeList: [],
    adImgs: {},
    dataList: [],
    showFoot: '',
    refreshing: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getBanners();
      this.getActiveCategory(1);
      this.getNotice();
      this.getActiveCategory(2);
      this.getIndexProducts();
    });
  }

  // 推荐banner
  async getBanners() {
    const res = await getBanners();
    console.log('getBanners===', res);
    if (res && res.length) {
      this.setState({
        banners: res,
      });
    }
  }

  // 推荐活动类目
  async getActiveCategory(position) {
    console.log('position===', position);
    const res = await getActiveCategory(position || 1);
    if (res && res.length) {
      if (position === 1) {
        this.setState({
          activeCategory: res,
        });
      } else {
        this.setState({
          prefecture: res,
        });
      }
    }
  }

  // 公告
  async getNotice() {
    const res = await getNotice();
    if (res && res.length) {
      this.setState({
        noticeList: res,
      });
    }
  }

  // 广告位
  async getAdImgs() {
    const res = await getAdImgs();
    console.log('getAdImgs===', res);
    if (res && res.length) {
      const { adImgs } = this.state;
      res.map(item => {
        if (item.position === 3) {
          adImgs.indexAd = item;
        } else if (item.position === 4) {
          adImgs.indexModalAd = item;
        }
      });
      this.setState({
        adImgs,
      });
    }
  }

  noticeList = () => {
    const { noticeList } = this.state;
    return noticeList.map((item, i) => (
      <TouchableOpacity key={i} style={styles.mlshNotice} onPress={() => this.noticeJump(item)} activeOpacity={Layout.activeOpacity}>
        <Text style={styles.mlshNoticeText} numberOfLines={1}>
          {item.notice}
        </Text>
      </TouchableOpacity>
    ));
  };

  prefectureRender = () => {
    const { prefecture } = this.state;
    return prefecture.map((item, i) => (
      <TouchableOpacity key={i} style={styles.prefectureItem} onPress={() => this.bannerJump(item, 'prefecture')} activeOpacity={Layout.activeOpacity}>
        <FastImage style={[styles.prefectureImg]} resizeMode={FastImage.resizeMode.cover} source={{ uri: item.imageUrl }} />
      </TouchableOpacity>
    ));
  };

  bannerJump = (item, str) => {
    const { navigation } = this.props;
    console.log('bannerJump===', str, item);
    // 类型0，单纯图片，1 h5地址(自己写的h5地址)，2 商品类目列表商品界面，3, 9.9包邮，4 淘宝地址(跳出app去淘宝)，5 淘抢购（废弃）,  6 淘宝地址（app内 嵌入淘宝页面）7，话费充值 8,商品详情
    const { type, id, title, value, params } = item;
    AnalyticsUtil.eventWithAttributes(`${str}_click`, { title });
    if (str === 'indexAd') {
      this.setState({
        isModalAd: false,
      });
      storage.save({
        key: 'isIndexAdModal',
        data: false,
      });
    }
    switch (type) {
      case 1:
        navigation.navigate('WebView', { title, id, src: value });
        break;
      case 2:
        if (str === 'category') {
          navigation.navigate('CategorySecond', {
            title,
            id: value,
          });
        } else {
          navigation.navigate(value, { title, id, ...params });
        }
        break;
      case 3:
        navigation.navigate('Nine', { title });
        break;
      case 4:
        RNAlibcSdk.show(
          {
            type: 'url',
            payload: value,
            openType: 'native',
          },
          (err, info) => {
            if (!err) console.log(info);
            else console.log(err);
          }
        );
        break;
      case 6:
        navigation.navigate('TWebView', { title, id, src: value });
        break;
      case 7:
        navigation.navigate('ReachargeIndex', { title });
        break;
      case 8:
        navigation.navigate('Detail', { pid: value });
        break;
      default:
        break;
    }
  };

  _renderHeader = () => {
    const { banners, activeCategory, noticeList, adImgs, prefecture } = this.state;
    const { isReview } = global;
    return (
      <View>
        {banners.length > 0 && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              paddingTop: 0,
            }}
          >
            <Image source={require('@assets/img-arc.png')} style={{ width: '100%', height: 40 }} />
            <View
              style={{
                width: '100%',
                height: 100,
                backgroundColor: '#fff',
              }}
            />
          </View>
        )}
        <View style={styles.bannerWrap}>
          <BannerComponent banners={banners} bannerJump={(item, str) => this.bannerJump(item, str)} />
        </View>
        <View style={styles.category}>
          <ActiveCategoryComponent activeCategory={activeCategory} bannerJump={(item, str) => this.bannerJump(item, str)} categoryJump={(item, index) => this.categoryJump(item, index)} />
        </View>
        {!isReview && noticeList.length > 0 && (
          <View style={styles.mlshNoticeWrap}>
            <FastImage style={styles.mlshNoticeImg} resizeMode={FastImage.resizeMode.contain} source={require('@assets/bg-notice.png')} />
            <SwiperV
              containerStyle={styles.noticeWrap}
              horizontal={false}
              autoplay
              loop
              index={0}
              scrollEnabled={false}
              showsPagination={false}
              autoplayTimeout={Platform.OS === 'ios' ? 2.5 : 6}
              removeClippedSubviews={false}
            >
              {this.noticeList()}
            </SwiperV>
          </View>
        )}
        {adImgs.indexAd && adImgs.indexAd.imageUrl && !isReview && (
          <TouchableOpacity style={styles.adJump} onPress={() => this.bannerJump(adImgs.indexAd, 'indexAd')} activeOpacity={Layout.activeOpacity}>
            <FastImage style={styles.adImg} resizeMode={FastImage.resizeMode.cover} source={{ uri: adImgs.indexAd.imageUrl }} />
          </TouchableOpacity>
        )}
        {prefecture.length > 0 && (
          <View style={styles.prefectureWrap}>
            <View style={styles.prefectureContent}>{this.prefectureRender()}</View>
          </View>
        )}
      </View>
    );
  };

  _keyExtractor = (item, index) => `${item.id}${index}`;

  _renderItem = ({ item, index }) => {
    return <Products key={index} item={item} index={index} jumpDetail={this.jumpDetail} />;
  };

  // 推荐商品
  isLoaded = true;

  curPage = 1;

  getIndexProducts = async () => {
    if (!this.isLoaded) {
      return;
    }
    this.isLoaded = false;
    const { dataList } = this.state;
    const params = {
      page: this.curPage,
    };
    const res = await getIndexProducts(params);
    if (res && res.length) {
      this.curPage += 1;
      this.setState(
        {
          dataList: [...dataList, ...res],
          showFoot: 2,
          refreshing: false,
        },
        () => {
          this.isLoaded = true;
        }
      );
    } else if (this.curPage === 1) {
      this.setState({
        showFoot: 3,
        refreshing: false,
      });
    } else {
      this.setState({
        showFoot: 1,
        refreshing: false,
      });
    }
  };

  _renderFooter = () => {
    const { showFoot } = this.state;
    if (!showFoot) {
      return null;
    }
    if (showFoot === 1) {
      return (
        <View style={styles.footer}>
          <Text>-我是有底线的-</Text>
        </View>
      );
    }
    if (showFoot === 2) {
      return (
        <View style={styles.footer}>
          <Text>加载中...</Text>
        </View>
      );
    }
    if (showFoot === 3) {
      return (
        <View style={styles.footer}>
          <Text>空空如也~</Text>
        </View>
      );
    }
  };

  onFooterLoad = () => {
    this.getIndexProducts();
  };

  jumpDetail = item => {
    const { navigation } = this.props;
    AnalyticsUtil.eventWithAttributes('enter_Detail', {
      id: item.id,
      title: item.title,
    });
    navigation.navigate('Detail', { pid: item.id });
  };

  onHeaderRefresh = () => {
    this.curPage = 1;
    this.setState(
      {
        refreshing: true,
        dataList: [],
      },
      () => {
        this.props.init();
        this.getIndexProducts();
      }
    );
  };

  noticeJump = item => {
    const { type, value, title, pid } = item;
    AnalyticsUtil.eventWithAttributes('notice_click', item);
    const { navigation } = this.props;
    switch (type) {
      case 1:
        navigation.navigate('WebView', { title, src: value });
        break;
      case 2:
        navigation.navigate(value, { title, pid });
        break;
      case 3:
        navigation.navigate('TWebView', { title, src: value });
        break;
      default:
        break;
    }
  };

  render() {
    const { dataList, refreshing } = this.state;
    return (
      <FlatList
        style={{ flex: 1 }}
        onEndReachedThreshold={0.1}
        onEndReached={() => this.onFooterLoad()}
        ListHeaderComponent={this._renderHeader}
        data={dataList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onHeaderRefresh} title="加载中..." />}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListFooterComponent={this._renderFooter}
      />
    );
  }
}
