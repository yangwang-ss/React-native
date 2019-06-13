import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, RefreshControl, InteractionManager } from 'react-native';
import { getParentCategory, getPrdByCategoryId, getPrdByGuessLike } from '@api';
import SortTab from '@components/SortTab';
import Layout from '@constants/Layout';
import CategoryItem from '@components/PrdDoubleItem';
import styles from './indexStyle';

export default class Index extends React.Component {
  state = {
    parentCategory: [],
    sortTab: 0,
    sortType: '',
    hasCoupon: true,
    categoryDataList: [],
    showFoot: '',
    sortParams: '',
    refreshing: false,
  };

  isLoaded = true;

  curCategoryPage = 1;

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const { id } = this.props;
      this.curTabId = id;
      if (this.curTabId !== 'guessLike') {
        this.getParentCategory(this.curTabId);
      }
      this.getData();
    });
  }

  getData = () => {
    if (this.curTabId === 'guessLike') {
      this.getPrdByGuessLike();
    } else {
      this.getPrdByCategoryId();
    }
  };

  // 父级类目
  async getParentCategory(parentId) {
    const res = await getParentCategory(parentId);
    console.log('getParentCategory===', res);
    if (res && res.length) {
      this.setState({
        parentCategory: res,
      });
    }
  }

  // 父级类目商品
  async getPrdByCategoryId() {
    if (!this.isLoaded) {
      return;
    }
    this.isLoaded = false;
    const { hasCoupon, sortParams } = this.state;
    const { deviceId: deviceValue, deviceType } = Layout.device;
    const params = {
      categoryId: this.curTabId,
      sort: sortParams,
      page: this.curCategoryPage,
      deviceValue,
      deviceType,
      hasCoupon,
    };
    const res = await getPrdByCategoryId(params);
    console.log('getPrdByCategoryId===', res);
    this.listHandle(res);
  }

  // 猜你喜欢商品
  async getPrdByGuessLike() {
    if (!this.isLoaded) {
      return;
    }
    this.isLoaded = false;
    const params = {
      page: this.curCategoryPage,
    };
    const res = await getPrdByGuessLike(params);
    console.log('getPrdByGuessLike===', res);
    this.listHandle(res);
  }

  changeTagQuan = () => {
    let { hasCoupon } = this.state;
    hasCoupon = !hasCoupon;
    this.curCategoryPage = 1;
    this.setState(
      {
        hasCoupon,
      },
      () => {
        this.getPrdByCategoryId();
      }
    );
  };

  listHandle = res => {
    const { categoryDataList } = this.state;
    let netData = [...categoryDataList];
    if (this.curCategoryPage === 1) {
      netData = [];
    }
    if (res && res.length) {
      this.curCategoryPage += 1;
      this.setState(
        {
          categoryDataList: [...netData, ...res],
          showFoot: 2,
          refreshing: false,
        },
        () => {
          this.isLoaded = true;
        }
      );
    } else if (this.curCategoryPage === 1) {
      this.setState({
        showFoot: 3,
        categoryDataList: [],
        refreshing: false,
      });
    } else {
      this.setState({
        showFoot: 1,
        refreshing: false,
      });
    }
  };

  parentCategoryList = () => {
    const { parentCategory } = this.state;
    return this.setCategory(parentCategory, 'tabCategory');
  };

  setCategory = (category, type) => {
    const array = [...category];
    const result = [];
    let itemNum = 4;
    if (type == 'activity') {
      itemNum = 5;
    }
    for (let i = 0, len = array.length; i < len; i += itemNum) {
      result.push(array.slice(i, i + itemNum));
    }
    return result.map((elem, index) => {
      if (elem.length < itemNum) {
        for (let index = 0; index <= itemNum - elem.length; index++) {
          elem.push({});
        }
      }
      return (
        <View key={index} style={styles.categoryFour}>
          {elem.map((item, i) => {
            const { name, title } = item;
            let emptyItem = '';
            let categoryItem = '';
            if (name || title) {
              if (type == 'activity') {
                categoryItem = (
                  <TouchableOpacity style={[styles.activityItem]} onPress={() => this.bannerJump(item, 'category')} activeOpacity={Layout.activeOpacity}>
                    <Image style={styles.activityImg} source={{ uri: item.imageUrl }} roundAsCircle imageStyle={{ borderRadius: 30 }} />
                    <Text style={styles.activityText}>{item.title}</Text>
                  </TouchableOpacity>
                );
              } else {
                categoryItem = (
                  <TouchableOpacity style={styles.categoryItem} onPress={() => this.categoryJump(item, i)} activeOpacity={Layout.activeOpacity}>
                    <Image style={styles.categoryImg} source={{ uri: item.icon }} roundAsCircle imageStyle={{ borderRadius: 30 }} />
                    <Text style={styles.categoryText}>{item.name || ''}</Text>
                  </TouchableOpacity>
                );
              }
            } else if (type === 'activity') {
              emptyItem = (
                <View style={styles.activityItem}>
                  <View style={styles.activityImg} />
                  <Text style={styles.activityText}>{item.title || ''}</Text>
                </View>
              );
            } else {
              emptyItem = (
                <View style={styles.categoryItem}>
                  <Text style={styles.categoryImgText} />
                  <Text style={styles.categoryText}>{item.name || ''}</Text>
                </View>
              );
            }
            return <View key={i}>{name || title ? categoryItem : emptyItem}</View>;
          })}
        </View>
      );
    });
  };

  changeSort = (item, sortType, sortParams) => {
    this.curCategoryPage = 1;
    this.setState(
      {
        sortType,
        sortTab: item.sortIndex,
        sortParams,
      },
      () => {
        this.getPrdByCategoryId();
      }
    );
  };

  categoryItem = () => {
    const { categoryDataList } = this.state;
    return categoryDataList.map((item, i) => {
      if (i % 2 == 0) {
        item.needMR = true;
      } else {
        item.needMR = false;
      }
      return <CategoryItem key={i} item={item} index={i} jumpDetail={this.jumpDetail} />;
    });
  };

  categoryJump = (item, index) => {
    const { id, name, params } = item;
    const { navigation } = this.props;
    AnalyticsUtil.eventWithAttributes('category_click', { name, index });
    navigation.navigate('Category', {
      title: name,
      cid: id,
      ...params,
    });
  };

  jumpDetail = item => {
    const { navigation } = this.props;
    AnalyticsUtil.eventWithAttributes('enter_Detail', {
      id: item.id,
      title: item.title,
    });
    navigation.navigate('Detail', { pid: item.id });
  };

  _renderHeader = () => {
    const { parentCategory, sortType, sortTab, hasCoupon } = this.state;
    return (
      <View style={{ flex: 1, marginLeft: -16, marginRight: -16 }}>
        {parentCategory.length > 0 && this.curTabId !== 'guessLike' && (
          <View>
            <View style={styles.parentCategoryWrap}>
              <View style={styles.parentCategoryContent}>{this.parentCategoryList()}</View>
            </View>
            <View style={styles.sortTabsWrap}>
              <SortTab sortType={sortType} sortTab={sortTab} changeSort={this.changeSort} hasCoupon={hasCoupon} changeTagQuan={this.changeTagQuan} />
            </View>
          </View>
        )}
      </View>
    );
  };

  _renderItem = ({ item, index }) => {
    if (index % 2 === 0) {
      item.needMR = true;
    } else {
      item.needMR = false;
    }
    return <CategoryItem key={index} item={item} index={index} jumpDetail={this.jumpDetail} />;
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
    this.getData();
  };

  onHeaderRefresh = () => {
    this.curCategoryPage = 1;
    this.setState(
      {
        refreshing: true,
        showFoot: '',
      },
      () => {
        if (this.curTabId !== 'guessLike') {
          this.getParentCategory(this.curTabId);
        }
        this.getData();
        this.props.init();
      }
    );
  };

  _keyExtractor = (item, index) => `${item.id}${index}`;

  render() {
    const { parentCategory, categoryDataList, refreshing } = this.state;
    return (
      <FlatList
        style={{ flex: 1, backgroundColor: '#f4f4f4' }}
        ListHeaderComponent={this._renderHeader}
        numColumns={2}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onHeaderRefresh} title="加载中..." />}
        onEndReachedThreshold={0.1}
        onEndReached={() => this.onFooterLoad()}
        contentContainerStyle={[{ backgroundColor: '#f4f4f4', paddingLeft: 16, paddingRight: 16, paddingTop: 8 }, this.curTabId !== 'guessLike' && parentCategory.length > 0 && { paddingTop: 0 }]}
        data={categoryDataList}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListFooterComponent={this._renderFooter}
      />
    );
  }
}
