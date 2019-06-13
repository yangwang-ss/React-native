import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, FlatList, ScrollView, RefreshControl, StatusBar, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';
import { NavigationEvents } from 'react-navigation';
import CommunityItem from '../../components/CommunityItem';
import ShareBox from '../../components/ShareBox';
import SchoolItem from '../../components/SchoolItem';
import SaveImg from '../../components/SaveImg';
import Layout from '../../constants/Layout';
import LoadingText from '../../components/LoadingText';
import { getCommunity, socialShareImg, getcommunityTag, getcommunityTab3List } from '../../services/api';

export default class CommunityIndex extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const tabBarVisible = state.params ? !state.params.fullscreen : true;
    return {
      tabBarVisible,
    };
  };

  state = {
    menus: [
      {
        name: '商品推荐',
        type: 0,
      },
      {
        name: '每日免单',
        type: 4,
      },
      {
        name: '宣传素材',
        type: 1,
      },
      {
        name: '商学院',
        type: 3,
      },
    ],
    sourceTab: [{
      name: '全部',
      type: -1,
    }, {
      name: '拉新素材',
      type: 0,
    }, {
      name: '拓店素材',
      type: 1,
    }, {
      name: '米粒小课堂',
      type: 2,
    }],
    dataSource: [],
    loadingState: '',
    params: {
      type: 0,
      currentPage: 1,
      search: '',
      twoType: -1,
    },
    showShareBox: false,
    shareImageUrl: '',
    shareTitle: '米粒生活',
    shareText: '',
    tagList: [],
    // 图片保存state
    imgSwiperIndex: 0,
    canOpenImg: true,
    showFullPic: false,
    fullPicInfo: [],
  };

  componentDidMount() {
    const { params } = this.state;
    this.getCommunityList(params);
  }

  componentWillUnmount() {
    Toast.hide(this.loadingToast);
  }

  init() {
    this.setState({
      showFullPic: false,
      showShareBox: false,
    });
  }

  menuChange = (item) => {
    const datas = {
      ...this.state.params,
      currentPage: 1,
      type: item.type,
      twoType: -1,
    };

    this.setState({
      dataSource: [],
      params: datas,
    });
    if (item.type == 3) {
      AnalyticsUtil.event('community_click_tab3_school');
      this.getCommunityTag();
    } else if (item.type == 1) {
      AnalyticsUtil.event('community_click_tab2_article');
    } else {
      AnalyticsUtil.event('community_click_tab1_goods');
    }
    this.getCommunityList(datas);
  };

  sourceChange = (item) => {
    const { params } = this.state;
    const datas = {
      currentPage: 1,
      twoType: item.type,
      type: params.type,
    };
    this.setState({
      dataSource: [],
      params: datas,
    });
    this.getCommunityList(datas);
  };

  // 下拉刷新
  onHeaderRefresh = () => {
    const datas = {
      ...this.state.params,
      currentPage: 1,
    };
    console.log('下拉刷新===onHeaderRefresh', datas);
    this.canLoadMore = false;
    this.setState(
      {
        params: datas,
        dataSource: [],
      },
      () => {
        this.getCommunityList(datas);
      }
    );
  };

  // 上拉加载
  onFooterLoad = () => {
    const { params } = this.state;
    console.log('上拉加载===onFooterLoad', params);
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getCommunityList(params);
    }
  };

  // 分享
  onPressShare = (item, index) => {
    console.log('dclick====', index);
    this.setState({
      shareText: item.content,
    });
    if (item.id) {
      this.getPrdShareImg(item.id, index);
    } else {
      this.setState({
        shareImageUrl: item.imgs[0],
      });
    }
  };

  closeShare = () => {
    this.setState({
      showShareBox: false,
    });
  };

  onPressClosefullPic = () => {
    this.props.navigation.setParams({ fullscreen: false });
    this.setState({
      showFullPic: false,
    });
  };

  pressImg = (imgs, index) => {
    const { canOpenImg } = this.state;
    if (canOpenImg) {
      this.props.navigation.setParams({ fullscreen: true });
      this.setState(
        {
          fullPicInfo: imgs,
          imgSwiperIndex: index || 0,
          canOpenImg: false,
        },
        () => {
          if (imgs.length > 0 && imgs[0] !== '') {
            const imgArr = [];
            const screenWidth = Layout.window.width;
            this.loadingToast = Toast.show('图片加载中..', {
              duration: 0,
              position: 0,
            });
            imgs.map(item => {
              Image.getSize(item, (width, height) => {
                const imgH = Math.floor((screenWidth / width) * height);
                imgArr.push({
                  height: imgH,
                  src: item,
                });
                if (imgArr.length === imgs.length) {
                  Toast.hide(this.loadingToast);
                  this.setState({
                    showFullPic: true,
                    fullPicInfo: imgArr,
                    canOpenImg: true,
                  });
                }
              });
            });
          }
        }
      );
    }
  };

  onIndexChanged = imgSwiperIndex => {
    this.setState({
      imgSwiperIndex,
    });
  };

  jumpDetail = item => {
    if (item.productId && item.isLoot != 1) {
      this.props.navigation.navigate('Detail', { pid: item.productId, src: 1 });
    }
  };

  jumpArticleDetail = (item, index) => {
    const arr = this.state.dataSource;
    arr[index].readNum += 1;
    this.props.navigation.navigate('WebView', {
      title: '商学院',
      showShare: true,
      mainTitle: item.title,
      subTitle: '',
      thumbImage: item.imgUrl,
      src: item.contentUrl,
      aid: item.id,
    });
    this.setState({
      dataSource: arr,
    });
  };

  onChangeText = val => {
    this.setState({
      params: {
        ...this.state.params,
        search: val,
      },
    });
  };

  clickNavTab(item) {
    if (item.type == 2) {
      this.props.navigation.navigate('SchoolTabDetail', { title: item.name, tagId: item.id });
    } else {
      this.props.navigation.navigate('CourseIndex', { tagId: item.id });
    }
  }

  onSubmitEditing = () => {
    const { search } = this.state.params;
    const datas = {
      type: 3,
      currentPage: 1,
      search,
    };
    this.setState({
      dataSource: [],
    }, () => {
      this.getCommunityList(datas);
    });
    Keyboard.dismiss();
  };

  clearSearch = () => {
    const datas = {
      type: 3,
      currentPage: 1,
      search: '',
    };
    this.setState({
      params: datas,
      dataSource: [],
    }, () => {
      this.getCommunityList(datas);
    });
  };

  /**
   * 接口请求
   */
  async getCommunityList(params) {
    const resParams = params;
    let loadingState = 'loading';
    this.setState({ loadingState });

    if (params.type !== 1) {
      delete resParams.twoType;
    }
    if (params.type !== 3) {
      delete resParams.search;
    }

    let { currentPage } = params;
    let res = [];
    if (params.type !== 3) {
      res = await getCommunity(resParams);
    } else {
      // 商学院
      res = await getcommunityTab3List(resParams);
    }
    if (res && (res.length || (res.records && res.records.length))) {
      currentPage++;
      if (params.type !== 3) {
        this.canLoadMore = true;
        this.setState({
          dataSource: [...this.state.dataSource, ...res.records],
          params: {
            ...params,
            currentPage,
            search: '',
          },
          loadingState: '',
        });
      } else {
        this.canLoadMore = true;
        this.setState({
          dataSource: [...this.state.dataSource, ...res],
          params: {
            ...params,
            currentPage,
          },
          loadingState: '',
        });
      }
    } else {
      if (this.state.dataSource.length > 0) {
        loadingState = 'noMoreData';
      } else {
        loadingState = 'empty';
      }
      this.setState({
        loadingState,
      });
    }
  }

  async getCommunityTag() {
    const res = await getcommunityTag();
    if (res && res.length) {
      this.setState({
        tagList: res,
      });
    }
  }

  async getPrdShareImg(id, index) {
    const toast = Toast.show('分享图片生成中...', {
      duration: 0,
      position: 0,
    });
    const res = await socialShareImg(id);
    if (res && res.img) {
      const dataSource1 = this.state.dataSource;
      dataSource1[index].shareTime += 1;
      this.setState(
        {
          showShareBox: true,
          shareImageUrl: res.img,
          dataSource: dataSource1,
        },
        () => {
          Toast.hide(toast);
        }
      );
    } else {
      setTimeout(() => {
        Toast.hide(toast);
      }, 300);
    }
  }

  loadingText = () => {
    const { loadingState } = this.state;
    return <LoadingText loading={loadingState} />;
  };

  communityItem = info => {
    const isLine = info.index === this.state.dataSource.length - 1;
    const { params } = this.state;
    if (params.type === 3) {
      return <SchoolItem index={info.index} info={info.item} isLine={isLine} jumpArticleDetail={this.jumpArticleDetail} />;
    }
    return <CommunityItem index={info.index} info={info.item} isLine={isLine} jumpDetail={this.jumpDetail} pressImg={this.pressImg} onPressShare={this.onPressShare} />;
  };

  renderNavList() {
    const navItem = this.state.tagList;
    const arr = [];
    navItem.map((item, index) => {
      arr.push(
        <TouchableOpacity style={styles.navWrapItem} onPress={() => this.clickNavTab(item)} key={index}>
          <Image style={styles.navItemBg} source={{ uri: item.imgUrl }} />
          <Text style={styles.navItemText}>{item.name}</Text>
        </TouchableOpacity>
      );
    });
    return arr;
  }

  _keyExtractor = (item, index) => `${index}`;

  renderMenus = () => {
    const { menus, params } = this.state;
    return menus.map((item, index) => {
      return (
        <View key={index} style={styles.tabWrap}>
          <Text onPress={() => this.menuChange(item)} style={[styles.tabs, item.type === params.type && styles.tabActive]}>
            {item.name}
          </Text>
          {item.type === params.type && <View style={styles.tabIcon} />}
        </View>
      )
    });
  };

  renderSourceTab = () => {
    const { sourceTab, params } = this.state;
    return sourceTab.map((item, index) => {
      return (
        <View key={index} style={[styles.sourceTabItem, index === 0 && styles.noMargin, item.type === params.twoType && styles.sourceActive]}>
          <Text onPress={() => this.sourceChange(item)} style={[styles.sourceTab, item.type === params.twoType && styles.sourceTabActive]}>
            {item.name}
          </Text>
        </View>
      )
    });
  };

  onBackButtonPressAndroid = () => {
    this._goBackPage();
    return true;
  };

  _goBackPage = () => {
    if (this.state.showFullPic || this.state.showShareBox) {
      this.setState({
        showFullPic: false,
        showShareBox: false,
      });
      this.props.navigation.setParams({ fullscreen: false });
    } else {
      // 否則返回到上一個頁面
      this.props.navigation.goBack();
    }
  };

  render() {
    const { dataSource, showShareBox, shareImageUrl, shareTitle, shareText, showFullPic, fullPicInfo, imgSwiperIndex, tagList, params } = this.state;

    return (
      <AndroidBackHandler onBackPress={() => this.onBackButtonPressAndroid()} style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
        <View style={styles.container}>
          <View>
            <ScrollView contentContainerStyle={styles.scrollView} horizontal>
              {this.renderMenus()}
            </ScrollView>
          </View>
          {params.type === 3 && (
            <View style={styles.tabLabelWrap}>
              <View style={styles.inputWrap}>
                <Image style={styles.searchIcon} source={require('../../../assets/icon-search2.png')} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="请输入您要搜索的内容..."
                  placeholderTextColor="#999"
                  onChangeText={this.onChangeText}
                  returnKeyType="search"
                  onSubmitEditing={this.onSubmitEditing}
                  underlineColorAndroid="transparent"
                  value={params.search}
                />
                <TouchableOpacity style={styles.cancelInner} onPress={this.clearSearch}>
                  <Ionicons style={styles.cancelIcon} name="ios-close" size={22} color="#999" />
                </TouchableOpacity>
              </View>
              {
                tagList.length > 0 && (
                  <View style={styles.navWrap}>{this.renderNavList()}</View>
                )
              }
            </View>
          )}
          {params.type === 1 && (
            <View style={styles.sourceTabWrap}>{this.renderSourceTab()}</View>
          )}
          <FlatList
            data={dataSource}
            keyExtractor={this._keyExtractor}
            renderItem={this.communityItem}
            onEndReachedThreshold={0.1}
            onEndReached={this.onFooterLoad}
            ListFooterComponent={() => this.loadingText()}
            refreshControl={<RefreshControl refreshing={false} onRefresh={this.onHeaderRefresh} title="加载中..." />}
          />
          <ShareBox closeShare={this.closeShare} showShareBox={showShareBox} shareImageUrl={shareImageUrl} shareTitle={shareTitle} shareText={shareText} />
          {showFullPic && (
            <SaveImg
              fileType="url"
              screenHeight={Layout.window.height}
              imgSwiperIndex={imgSwiperIndex}
              fullPicInfo={fullPicInfo}
              onIndexChanged={this.onIndexChanged}
              onPressClosefullPic={this.onPressClosefullPic}
            />
          )}
        </View>
        <NavigationEvents onDidFocus={() => this.init()} />
      </AndroidBackHandler>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Layout.window.width,
    backgroundColor: '#fff',
    flex: 1,
  },
  scrollView: {
    paddingTop: 40,
    paddingRight: 12,
    paddingLeft: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: '100%',
  },
  tabWrap: {
    width: '22%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  tabIcon: {
    borderWidth: 1,
    borderColor: '#ea4457',
    width: 15,
  },
  tabs: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PingFangSC-Regular',
    marginBottom: 10,
    lineHeight: 24,
  },
  tabActive: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 26,
  },
  refreshWrap: {
    backgroundColor: '#fff',
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
  tabLabelWrap: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 8,
    borderBottomColor: '#f4f4f4',
    paddingBottom: 4,
  },
  inputWrap: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 19,
    height: 18,
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    height: 18,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  cancelInner: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    width: 20,
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelIcon: {
    marginTop: -2,
  },
  navWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  navWrapItem: {
    width: '30%',
    height: 41,
    position: 'relative',
    borderRadius: 4,
    marginBottom: 8,
  },
  navItemBg: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  navItemText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 15,
    color: '#fff',
    lineHeight: 41,
    textAlign: 'center',
  },
  sourceTabWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 8,
    borderBottomColor: '#f4f4f4',
  },
  sourceTabItem: {
    backgroundColor: '#F6F6F6',
    borderRadius: 4,
    marginLeft: 12,
    flex: 1,
  },
  noMargin: {
    marginLeft: 0,
  },
  sourceTab: {
    fontFamily: 'PingFangSC-Regular',
    color: '#666',
    fontSize: 12,
    lineHeight: 26,
    textAlign: 'center',
    width: '100%',
  },
  sourceActive: {
    backgroundColor: '#FC4277',
  },
  sourceTabActive: {
    color: '#fff',
  },
});
