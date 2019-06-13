import React from 'react';
import {
  StyleSheet,
  Text, View, Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Layout from '../../constants/Layout';
import Products from '../../components/PrdCommissionItem';
import LoadingText from '../../components/LoadingText';
import {
  getVipType,
  getCommissionPrdList,
} from '../../services/api';

export default class CommissionIndex extends React.Component {
  static navigationOptions = {
    title: '精选推荐',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  }

  state = {
    refreshing: false,
    showTopRules: false,
    isVip: false,
    curPage: 1,
    loadingState: '',
    vipImg: '',
    dataList: [],
  }

  /**
   * 初始化
   */
  init = () => {
    this.getCommissionPrdList();
    this.getVipType();
  }

  componentDidMount() {
    this.init();
  }

  /**
   * 列表渲染
   */

  e = () => this.state.dataList.map((item, i) => (<Products key={i} item={item} index={i} jumpDetail={this.jumpDetail} />))


  /**
   * 事件绑定
   */
  onPressShowRules = () => {
    this.setState({
      showTopRules: true,
    });
  }

  onPressCloseRules = () => {
    this.setState({
      showTopRules: false,
    });
  }

  onPressJumpVip = () => {
    this.props.navigation.navigate('VipIndex');
  }

  jumpDetail = (item) => {
    console.log('jumpDetail====1', item);
    this.props.navigation.navigate('CommissionDetail', { pid: item.id });
  }

  _onContentSizeChange(w, h) {
    this.setState({
      contentHeight: h,
    });
  }

  // 下拉刷新
  onHeaderRefresh = () => {
    console.log('onHeaderRefresh==触发');
    this.setState({
      refreshing: true,
      curPage: 1,
      dataList: [],
    },
    () => {
      this.getCommissionPrdList();
    });
  }

  _onScroll(event) {
    if (!this.isLoaded) return;

    if (event.nativeEvent.contentOffset.y + Layout.window.height >= this.state.contentHeight) {
      this.getCommissionPrdList();
    }
  }


  /**
   * 接口请求
   */
  isLoaded = true

  async getCommissionPrdList() {
    this.isLoaded = false;
    let loadingState = 'loading';
    this.setState({ loadingState });
    let { curPage } = this.state;
    const res = await getCommissionPrdList(curPage);
    console.log('getCommissionPrdList===', res);
    if (loadingState === 'empty') return;
    if (res && res.length) {
      curPage++;
      this.setState({
        refreshing: false,
        dataList: [...this.state.dataList, ...res],
        loadingState: '',
        curPage,
      }, () => {
        this.isLoaded = true;
      });
    } else {
      if (this.state.dataList.length) {
        loadingState = 'noMoreData';
      } else {
        loadingState = 'empty';
      }
      this.setState({
        refreshing: false,
        loadingState,
      });
      this.isLoaded = true;
    }
  }

  // 是否是vip
  async getVipType() {
    const res = await getVipType();
    console.log('getVipType===', res);
    if (res && res.isVip && (res.isVip == 0)) {
      // 不是vip
      this.setState({
        vipImg: (res && res.imageUrl) || '',
        isVip: false,
      });
    } else {
      this.setState({ isVip: true });
    }
  }

  render() {
    const {
      refreshing, loadingState, showTopRules, vipImg,
    } = this.state;
    const { isReview } = global;

    return (
      <View style={styles.container}>
        <StatusBar translucent={false} barStyle="dark-content" backgroundColor="#fff" />
        {
            showTopRules
            && (
            <View style={styles.rulesWrap}>
              <View style={styles.rulesContent}>
                <Text style={styles.rulesTitle}>高佣专区规则</Text>
                <Text style={styles.rulesText}>1、高佣商品推荐是米粒生活为会员提供的专享福利，分享高佣商品，可赚高额佣金。</Text>
                <Text style={styles.rulesText}>2、参与规则：购买任意高佣商品（没有退货），即可享受高佣商品分享奖励，且赠送米粒生活VIP权益。</Text>
                <Text style={styles.rulesText}>3、好友购买高佣商品，确认收货7天后，奖金到账余额，可提现至微信，无手续费。</Text>
                <TouchableOpacity style={styles.btnKnowWrap} onPress={() => this.onPressCloseRules()} activeOpacity={Layout.activeOpacity}>
                  <Text style={styles.btnKnow}>知道了</Text>
                </TouchableOpacity>
              </View>
            </View>
            )
          }
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ zIndex: 0, position: 'relative' }}
          onContentSizeChange={(w, h) => this._onContentSizeChange(w, h)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={this.onHeaderRefresh} />
            }
          onScroll={e => this._onScroll(e)}
        >
          <ImageBackground resizeMode="contain" source={require('../../../assets/commission-bg-1.png')} style={{ flex: 1 }}>
            <View style={styles.bgImgWrap}>
              {
                  !isReview
                  && (
                  <TouchableOpacity style={styles.btnRulesWrap} onPress={() => this.onPressShowRules()} activeOpacity={Layout.activeOpacity}>
                    <Image style={styles.btnRulesImg} source={require('../../../assets/commission-btn-rules.png')} />
                  </TouchableOpacity>
                  )
                }
              <FastImage resizeMode={FastImage.resizeMode.cover} style={styles.bgImg} source={isReview ? require('../../../assets/commission-bg-top2.png') : require('../../../assets/commission-bg-top.png')} />
            </View>
            {
                (vipImg != '' && !isReview)
                && (
                <TouchableOpacity style={styles.vipImgWrap} onPress={() => this.onPressJumpVip()} activeOpacity={Layout.activeOpacity}>
                  <Image style={styles.vipImg} source={{ uri: vipImg }} />
                </TouchableOpacity>
                )
              }
            <View style={styles.prdWrap}>
              <View style={styles.prdTitleWrap}>
                <Image style={styles.prdTitleIcon} source={isReview ? require('../../../assets/commission-img-title2.png') : require('../../../assets/commission-img-title.png')} />
              </View>
              <View style={styles.productsWrap}>
                {this.e()}
              </View>
            </View>
            <LoadingText loading={loadingState} textColor="#FFC991" bgColor="#282B3E" />
          </ImageBackground>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#282B3E',
    flex: 1,
  },
  bgImgWrap: {
    position: 'relative',
    width: '100%',
    marginBottom: 16,
  },
  bgImg: {
    width: '100%',
    height: 190,
  },
  vipImgWrap: {
    width: '100%',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 10,
  },
  vipImg: {
    width: '100%',
    height: 60,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  prdWrap: {
    position: 'relative',
    flex: 1,
  },
  prdTitleWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  prdTitleIcon: {
    width: '100%',
    height: 70,
    resizeMode: 'contain',
  },
  productsWrap: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  btnRulesWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 90,
    height: 40,
    zIndex: 26,
  },
  btnRulesImg: {
    width: '100%',
    resizeMode: 'contain',
  },
  rulesWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 9,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  rulesContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 270,
    zIndex: 9,
    marginLeft: -135,
    marginTop: -126,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  rulesTitle: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333',
    marginTop: 24,
    marginBottom: 14,
  },
  rulesText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
  },
  btnKnowWrap: {
    width: '100%',
    height: 48,
    marginTop: 5,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
  },
  btnKnow: {
    textAlign: 'center',
    lineHeight: 48,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#EA4457',
  },
});
