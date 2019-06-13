import React from 'react';
import {
  StyleSheet,
  Text, View, Image,
  RefreshControl,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import Layout from '../../constants/Layout';
import ProductItem from '../../components/PrdDoubleItem';
import LoadingText from '../../components/LoadingText';
import SortTab from '../../components/SortTab';
import CustomTabBar from '../../components/CustomTabBar';
import { getParentCategory, getPrdByCategoryId } from '../../services/api';

export default class CategorySecond extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title || '类目',
  });

  state = {
    refreshing: false,
    hasCoupon: true,
    canSwitch: true,
    curPage: 1,
    pageSize: 10,
    sortTab: 0,
    sortType: '',
    sortParams: '',
    loadingState: 'loading',
    cid: '',
    categoryId: '',
    categoryDataList: [],
    activeCategory: [],
    tabs: [],
  };

  componentDidMount() {
    this.init();
  }

  /**
   * 初始化
   */
  init = () => {
    const cid = this.props.navigation.getParam('id', '');
    const title = this.props.navigation.getParam('title', '');
    this.setState({ cid }, () => {
      this.getTopTabs();
    });
  };

  /**
   * 事件绑定
   */
  tabChange = (info) => {
    const item = info.ref.props;
    this.setState({
      sortType: '',
      sortTab: 0,
      sortParams: '',
      curPage: 1,
      categoryId: item.tabId,
      activeCategory: [],
      categoryDataList: [],
    }, () => {
      this.getActiveCategory(item.tabId);
      this.getPrdByCategoryId();
    });
  };

  categoryJump = (item) => {
    const { id, name } = item;
    this.props.navigation.navigate('Category', { title: name, cid: id });
  };

  jumpDetail = (item) => {
    console.log('jumpDetail====1', item);
    this.props.navigation.navigate('Detail', { pid: item.id });
  };

  // 下拉刷新
  onHeaderRefresh = () => {
    console.log('onHeaderRefresh==触发');
    this.setState({
      refreshing: true,
      curPage: 1,
      sortType: '',
      categoryDataList: [],
    }, () => {
      this.getPrdByCategoryId();
    });
  };

  // 上拉加载
  onFooterLoad = () => {
    console.log('onFooterLoad==触发');
    this.getPrdByCategoryId();
  };

  changeSort = (item, sortType, sortParams) => {
    this.setState({
      curPage: 1,
      categoryDataList: [],
      sortType,
      sortTab: item.sortIndex,
      sortParams,
    }, () => {
      this.getPrdByCategoryId();
    });
  };

  changeTagQuan = () => {
    let { hasCoupon, canSwitch } = this.state;
    if (canSwitch) {
      hasCoupon = !hasCoupon;
      this.setState({
        canSwitch: false,
        hasCoupon,
        curPage: 1,
        categoryDataList: [],
      }, () => {
        this.getPrdByCategoryId();
      });
    }
  }

  /**
   * 接口请求
   */
  // 顶部tab
  async getTopTabs() {
    const { cid } = this.state;
    const res = await getParentCategory(cid);
    if (res && res.length) {
      const tabs = res;
      tabs.forEach((elem, i) => {
        if (i != 0) { elem.active = false; }
      });
      this.setState({ tabs, categoryId: tabs[0].id }, () => {
        this.getPrdByCategoryId();
      });
      this.getActiveCategory(tabs[0].id);
    }
  }

  // 父级类目商品
  async getPrdByCategoryId() {
    let loadingState = 'loading';
    this.setState({ loadingState });
    const {
      pageSize, sortParams, categoryId, hasCoupon,
    } = this.state;
    const { deviceId: deviceValue, deviceType } = Layout.device;
    let { curPage } = this.state;
    const params = {
      categoryId,
      sort: sortParams,
      page: curPage,
      pageSize,
      deviceValue,
      deviceType,
      hasCoupon,
    };
    const res = await getPrdByCategoryId(params);
    if (res && res.length) {
      curPage++;
      this.setState({
        canSwitch: true,
        refreshing: false,
        categoryDataList: [...this.state.categoryDataList, ...res],
        loadingState: '',
        curPage,
      });
    } else {
      if (this.state.categoryDataList.length) {
        loadingState = 'noMoreData';
      } else {
        loadingState = 'empty';
      }
      this.setState({
        canSwitch: true,
        refreshing: false,
        loadingState,
      });
    }
  }

  // 活动类目
  async getActiveCategory(id) {
    const res = await getParentCategory(id);
    console.log('getActiveCategory===', res);
    if (res && res.length) {
      this.setState({
        activeCategory: res,
      });
    }
  }

  /**
   * 元素渲染
   */
  renderItem = (info) => {
    if (info.index % 2 == 0) {
      info.item.needMR = true;
    } else {
      info.item.needMR = false;
    }
    return (<ProductItem item={info.item} index={info.index} jumpDetail={this.jumpDetail} />);
  };

  tabList = () => {
    const { tabs } = this.state;
    return tabs.map((item, i) => (
      <Text tabLabel={item.name} tabId={item.id} number={item.id} key={i} />
    ));
  };

  activeCategoryList = () => {
    const { activeCategory } = this.state;
    return activeCategory.map((item, i) => (
      <TouchableOpacity key={i} style={styles.categoryItem} onPress={() => this.categoryJump(item)} activeOpacity={Layout.activeOpacity}>
        <Image style={styles.categoryImg} source={{ uri: item.icon }} roundAsCircle imageStyle={{ borderRadius: 30 }} />
        <Text style={styles.categoryText}>{item.name}</Text>
      </TouchableOpacity>
    ));
  };

  render() {
    const {
      sortType, sortTab, refreshing, activeCategory,
      loadingState, categoryDataList, tabs, hasCoupon,
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        {
          tabs.length > 1 && (
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#e63cb3', '#f03066']}
              style={styles.linearBox}
            >
              <ScrollableTabView
                tabBarActiveTextColor="#fff"
                tabBarInactiveTextColor="#333"
                tabBarTextStyle={[styles.topTabtextStyle]}
                tabBarUnderlineStyle={styles.topTabLineStyle}
                onChangeTab={this.tabChange}
                tabBarUnderlineStyle="transparent"
                renderTabBar={() => <CustomTabBar />}
              >
                { this.tabList() }
              </ScrollableTabView>
            </LinearGradient>
          )
        }
        <View>
          {
            activeCategory.length > 0 && (
              <View style={styles.category}>
                {this.activeCategoryList()}
              </View>
            )
          }
          <SortTab sortType={sortType} sortTab={sortTab} changeSort={this.changeSort} hasCoupon={hasCoupon} changeTagQuan={this.changeTagQuan} />
          <View style={[styles.categoryPrdWrap, categoryDataList.length ? { height: Layout.window.height - 140 } : '']}>
            <FlatList
              numColumns={2}
              style={{ width: '100%' }}
              data={categoryDataList}
              keyExtractor={(item, index) => (item + index).toString()}
              renderItem={this.renderItem}
              style={styles.cateFlatList}
              refreshControl={(
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.onHeaderRefresh}
                  title="加载中..."
                />
)}
              onEndReachedThreshold={0.1}
              onEndReached={this.onFooterLoad}
            />
          </View>
          <LoadingText loading={loadingState} bgColor="#f4f4f4" />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  linearBox: {
    height: 50,
    zIndex: 1,
    elevation: 1,
    width: '100%',
  },
  sortTabsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  sortTab: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    padding: 10,
    alignSelf: 'stretch',
  },
  sortTypeTab: {
    fontFamily: 'PingFangSC-Medium',
    color: '#EA4457',
  },
  categoryPrdWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingLeft: 16,
    paddingRight: 16,
  },
  cateFlatList: {
    flex: 1,
  },
  topTabtextStyle: {
    color: '#fff',
    fontFamily: 'PingFangSC-Medium',
  },
  topTabLineStyle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
  },
  category: {
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  categoryItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    height: 80,
    marginBottom: 10,
  },
  categoryImg: {
    flex: 1,
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
    backgroundColor: '#9DD6EB',
  },
  categoryText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
