import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, FlatList, AsyncStorage, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationEvents } from 'react-navigation';
import { getHotwords, getAssociationalWords } from '../../services/api';
import Layout from '../../constants/Layout';

export default class SearchIndex extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    isShowClear: false,
    historyList: [],
    hotList: [],
    searchValue: '',
    searchList: [],
    isSearchValue: false,
  };

  init = () => {
    this.getHistorySearch();
    this.getHotSearch();
    this.initData();
  };

  initData = () => {
    this.setState({
      searchValue: '',
      isSearchValue: false,
      isShowClear: false,
    });
  };

  _keyExtractor = (item, index) => `${index}`;

  backSearch = () => {
    this.props.navigation.goBack();
  };

  onChangeText = value => {
    this.setState({
      searchValue: value,
    });
    if (value.trim().length) {
      this.setState({ isShowClear: true });
      this.getSearchTextList(value);
    } else {
      this.setState({
        searchList: [],
        isSearchValue: false,
        isShowClear: false,
      });
    }
  };

  clearSearch = () => {
    this.setState({
      searchValue: '',
      searchList: [],
      isSearchValue: false,
    });
  };

  onSubmitEditing = () => {
    const { searchValue } = this.state;
    this.jumpSearchDetail(searchValue);
  };

  hotSearch = item => {
    switch (item.type) {
      case 0:
        this.jumpSearchDetail(item.value);
        break;
      case 1:
        if (item.param) {
          this.setState({
            searchValue: item.value,
            searchList: [],
            isSearchValue: false,
          });
          Linking.openURL(item.param);
        } else {
          this.jumpSearchDetail(item.value);
        }
        break;
      case 2:
        if (item.path) {
          this.setState({
            searchValue: item.value,
            searchList: [],
            isSearchValue: false,
          });
          this.props.navigation.navigate(item.path, item.param);
        } else {
          this.jumpSearchDetail(item.value);
        }
        break;
    }
  };

  jumpSearchDetail = value => {
    this.setState({
      searchValue: value,
      searchList: [],
      isSearchValue: false,
    });
    this.props.navigation.navigate('SearchProduct', { value });
  };

  // 获取缓存搜索
  getHistorySearch = () => {
    let wordsArr = [];
    AsyncStorage.getItem('historySearch').then(result => {
      wordsArr = JSON.parse(result);
      this.setState({
        historyList: wordsArr || [],
      });
    });
  };

  // 清除历史搜索
  clearHistory = () => {
    AsyncStorage.removeItem('historySearch');
    this.setState({
      historyList: [],
    });
  };

  /**
   * 接口请求
   */
  // 获取热词列表
  async getHotSearch(params) {
    const res = await getHotwords(params);
    if (res) {
      this.setState({
        hotList: res,
      });
    }
  }

  // 获取搜索联想词列表
  async getSearchTextList(params) {
    const res = await getAssociationalWords(params);
    if (res && res.length) {
      this.setState({
        searchList: res,
        isSearchValue: true,
      });
    } else {
      this.setState({
        isSearchValue: false,
      });
    }
  }

  /**
   * 元素渲染
   */
  renderHistorySearchItem = list => {
    const arr = [];
    if (list && list.length) {
      list.map((item, index) => {
        arr.push(
          <TouchableOpacity onPress={() => this.jumpSearchDetail(item)} key={index} style={styles.searchItemList}>
            <Text style={styles.searchItemText}>{item}</Text>
          </TouchableOpacity>
        );
      });
    }
    return arr;
  };

  renderHotSearchItem = list => {
    const arr = [];
    if (list && list.length) {
      list.map((item, index) => {
        arr.push(
          <TouchableOpacity onPress={() => this.hotSearch(item)} key={index} style={styles.searchItemList}>
            <Text style={[styles.searchItemText, item.isActive && styles.searchItemAct]}>{item.value}</Text>
          </TouchableOpacity>
        );
      });
    }
    return arr;
  };

  renderSearchListItem = info => {
    const { item } = info;
    return (
      <TouchableOpacity style={styles.tipItem} onPress={() => this.jumpSearchDetail(item)}>
        <Text style={styles.tipText}>{item}</Text>
        <Image source={require('../../../assets/icon-search-arrow.png')} style={styles.tipIcon} />
      </TouchableOpacity>
    );
  };

  render() {
    const { hotList, searchList, isSearchValue, searchValue, isShowClear } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.searchArea}>
          <LinearGradient style={styles.topLinearGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FF43A6', '#FF4177']} />
          <View style={styles.searchWrap}>
            <View style={styles.searchBox}>
              <Image style={styles.searchIcon} source={require('../../../assets/icon-search2.png')} />
              <TextInput
                style={styles.searchInput}
                placeholder="请输入要搜索的商品名称"
                onChangeText={this.onChangeText}
                returnKeyType="search"
                onSubmitEditing={this.onSubmitEditing}
                value={searchValue}
              />
              {isShowClear ? (
                <TouchableOpacity style={styles.cancelInner} onPress={this.clearSearch}>
                  <Ionicons style={styles.cancelIcon} name="ios-close" size={22} color="#999" />
                </TouchableOpacity>
              ) : null}
            </View>
            <Text onPress={this.backSearch} style={styles.cancel}>
              取消
            </Text>
          </View>
        </View>
        {isSearchValue && (
          <View style={styles.searchTipList}>
            <FlatList data={searchList} keyboardShouldPersistTaps="handled" keyExtractor={this._keyExtractor} renderItem={this.renderSearchListItem} />
          </View>
        )}
        <View style={styles.searchListBox}>
          <View style={styles.searchTitlle}>
            <Text style={styles.searchTitlleText}>三步轻松获取优惠券/返现</Text>
          </View>
          <View style={styles.searchStepWrap}>
            <View style={styles.stepIconWrap}>
              <Image style={styles.stepIcon} source={require('@assets/icon-searchIcon1.png')} />
              <Image style={styles.stepArrow} source={require('@assets/icon-search-step.png')} />
              <Image style={styles.stepIcon} source={require('@assets/icon-searchIcon2.png')} />
              <Image style={styles.stepArrow} source={require('@assets/icon-search-step.png')} />
              <Image style={styles.stepIcon} source={require('@assets/icon-searchIcon3.png')} />
            </View>
            <View style={styles.stepTextWrap}>
              <Text style={styles.stepText}>1.在淘宝复制商品链接</Text>
              <Text style={styles.stepText}>2.在米粒粘贴搜索商品</Text>
              <Text style={styles.stepText}>3.进入商品详情立即领券购买</Text>
            </View>
          </View>
        </View>
        {this.state.historyList.length > 0 && (
          <View style={styles.searchListBox}>
            <View style={styles.searchTitlle}>
              <Text style={styles.searchTitlleText}>历史搜索</Text>
              <TouchableOpacity onPress={this.clearHistory}>
                <Image style={styles.deleteText} source={require('../../../assets/icon-delete.png')} />
              </TouchableOpacity>
            </View>
            <View style={styles.searchTextList}>{this.state.historyList && this.renderHistorySearchItem(this.state.historyList)}</View>
          </View>
        )}
        <View style={styles.searchListBox}>
          <View style={styles.searchTitlle}>
            <Text style={styles.searchTitlleText}>热门搜索</Text>
          </View>
          <View style={styles.searchTextList}>{hotList && this.renderHotSearchItem(hotList)}</View>
        </View>
        <NavigationEvents onDidFocus={() => this.init()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  topLinearGradient: {
    width: Layout.window.width,
    height: 78,
  },
  searchTipList: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 78,
    left: 0,
    backgroundColor: '#fff',
    zIndex: 999,
  },
  tipItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingRight: 24,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tipText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
  },
  tipIcon: {
    width: 13,
    height: 13,
    marginTop: 4,
  },
  backIcon: {
    marginTop: 4,
    paddingLeft: 20,
    paddingRight: 20,
  },
  searchArea: {
    height: 78,
    position: 'relative',
    width: '100%',
  },
  searchWrap: {
    height: 32,
    width: '100%',
    position: 'absolute',
    top: 40,
    left: 0,
    flexDirection: 'row',
    paddingRight: 16,
    paddingLeft: 12,
  },
  searchBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 32,
    paddingRight: 12,
    paddingLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cancel: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 32,
    marginLeft: 9,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginTop: 1,
    padding: 0,
  },
  searchListBox: {
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  searchTitlle: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchTitlleText: {
    fontFamily: 'PingFangSC-Medium',
    color: '#333',
    fontSize: 14,
  },
  deleteText: {
    width: 16,
    height: 16,
  },
  searchTextList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '105%',
  },
  searchItemList: {
    backgroundColor: '#F6F6F6',
    borderRadius: 14,
    marginBottom: 8,
    marginRight: 12,
    paddingRight: 12,
    paddingLeft: 12,
  },
  searchItemText: {
    lineHeight: 24,
    fontSize: 12,
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
  },
  searchItemAct: {
    color: '#EA4457',
  },
  cancelInner: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    width: 18,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelIcon: {
    marginTop: -2,
  },
  searchStepWrap: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  stepIconWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    paddingLeft: 20,
  },
  stepIcon: {
    width: 36,
    height: 36,
  },
  stepArrow: {
    width: 65,
    height: 3,
  },
  stepTextWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  stepText: {
    fontSize: 11,
    fontFamily: 'PingFangSC-Regular',
    color: '#333',
    textAlign: 'center',
    width: 78,
  },
});
