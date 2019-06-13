import React, { Component } from 'react';
import Toast from 'react-native-root-toast';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, StatusBar, RefreshControl } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { BoxShadow } from 'react-native-shadow';
import Layout from '../../constants/Layout';
import CollectList from '../../components/CollectList';
import { collectList, deleteBatchCollectProduct } from '../../services/api';

const shadowOpt = {
  width: Layout.window.width,
  height: 1,
  color: '#ccc',
  border: 1,
  radius: 4,
  opacity: 0.08,
  x: -0,
  y: 8,
  style: {
    marginBottom: 2,
    marginLeft: 0,
    marginRight: 0,
    position: 'absolute',
    left: 0,
    top: 0,
  },
};
export default class Mycollect extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '我的收藏',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: (
      <TouchableOpacity onPress={navigation.state.params.editeCollect}>
        {Array.isArray(navigation.state.params.pLists) ? (
          navigation.state.params.pLists.length > 0 ? (
            <View style={{ paddingRight: 16 }}>
              <Text style={{ fontSize: 16, color: '#333', fontFamily: 'PingFangSC-Regular' }}>{navigation.state.params.isEdites ? '取消' : '编辑'}</Text>
            </View>
          ) : null
        ) : null}
      </TouchableOpacity>
    ),
  });

  state = {
    pList: [],
    idList: [],
    currentPage: 1,
    loadMoreText: '',
    showEmpty: false,
    selectedAll: false,
    isEdite: false,
  };

  init() {
    this.getList(1);
  }

  blur() {
    this.setState({
      pList: [],
    });
  }

  // 下拉刷新
  onHeaderRefresh = () => {
    this.setState({ pList: [], showEmpty: false }, () => this.getList(1));
    this.canLoadMore = false;
  };

  // 上拉加载
  onFooterLoad = () => {
    const { currentPage } = this.state;
    if (this.canLoadMore) {
      this.canLoadMore = false;
      this.getList(currentPage);
    }
  };

  jumpDetail = item => {
    this.props.navigation.navigate('Detail', {
      pid: item,
    });
  };

  /**
   * 接口请求
   */
  async getList(page) {
    let loadMoreText = '';
    this.setState({ loadMoreText: '加载中...' });
    const res = await collectList(page);
    if (res && res.length) {
      if (res.length > 5) {
        page++;
        this.canLoadMore = true;
      } else {
        this.canLoadMore = false;
      }
      this.setState(
        {
          showEmpty: false,
          pList: [...this.state.pList, ...res],
          currentPage: page,
          loadMoreText: res.length > 5 ? '加载中...' : '-我是有底线的-',
        },
        () => {
          this.props.navigation.setParams({ editeCollect: this.editeCollect, pLists: this.state.pList }), this.ifSelected();
        }
      );
    } else {
      const list = this.state.pList.length;
      if (list) {
        if (list > 5) {
          loadMoreText = '-我是有底线的-';
        } else {
          loadMoreText = '';
        }
      } else {
        loadMoreText = '';
      }
      this.setState({
        loadMoreText,
        showEmpty: true,
      });
    }
  }

  // 实现滑动全选
  ifSelected = () => {
    const { selectedAll } = this.state;
    const arr = [];
    if (selectedAll) {
      const { pList } = this.state;
      const newData = pList.map(item => {
        item.selected = true;
        arr.push(item.id);
        return item;
      });
      this.setState(
        {
          pList: newData,
          idList: arr,
        },
        () => {
          console.log('idList', this.state.idList);
        }
      );
    }
  };

  loadingText = () => {
    const { loadMoreText } = this.state;

    return <Text style={styles.loadingText}>{loadMoreText}</Text>;
  };

  updateData = id => {
    const { pList } = this.state;
    const newData = pList.map(item => {
      if (item.id === id) {
        item.selected = !item.selected;
      }
      return item;
    });
    this.setState({
      pList: newData,
    });
    this.getIdList();
  };

  getIdList = () => {
    const { pList } = this.state;
    const arr = [];
    pList.map((item, index) => {
      if (item.selected) {
        arr.push(item.id);
      } else {
        arr.splice(index, 1);
      }
      return arr;
    });
    if (arr.length === pList.length) {
      this.setState({ selectedAll: true });
    } else {
      this.setState({ selectedAll: false });
    }
    this.setState({ idList: arr }, () => {
      console.log('idList', this.state.idList);
    });
  };

  renderList(item) {
    const { isEdite } = this.state;
    return <CollectList updateData={this.updateData} isEdite={isEdite} product={item} jumpDetail={this.jumpDetail} />;
  }

  editeCollect = () => {
    const { isEdite, pList } = this.state;
    this.setState({ isEdite: !isEdite, pList }, () => {
      this.props.navigation.setParams({ isEdites: this.state.isEdite, pLists: this.state.pList }), isEdites();
    });
    const isEdites = () => {
      // if (this.state.isEdite === false) {
      //   this.setState({ selectedAll: false }, this.selectAll());
      // }
      this.setState({ selectedAll: false }, this.selectAll());
    };
  };

  selectAll = () => {
    const { selectedAll } = this.state;
    this.setState({ selectedAll: !selectedAll }, () => {
      selected();
    });
    const selected = () => {
      let arr = [];
      if (this.state.selectedAll) {
        const { pList } = this.state;
        const newData = pList.map(item => {
          item.selected = true;
          arr.push(item.id);
          return item;
        });
        this.setState({
          pList: newData,
          idList: arr,
        });
      } else {
        console.log("else");
        const { pList } = this.state;
        const newData = pList.map(item => {
          item.selected = false;
          arr = [];
          return item;
        });
        this.setState({
          pList: newData,
          idList: arr,
        });
      }
    };
  };

  // 取消收藏
  cancelCollectProduct = () => {
    const { idList } = this.state;
    if (idList.length === 0) {
      Toast.show('请先勾选取消项', {
        duration: 2000,
        shadow: true,
        animation: true,
        hideOnPress: true,
        position: Toast.positions.CENTER,
      });
      return;
    }
    // this.state.pList = [];//先清空数据
    this.deleteCollect();
  };

  async deleteCollect() {
    const { idList, pList } = this.state;
    // 此处是实现列表删除不刷新
    for (let i = 0; i < pList.length; i++) {
      for (let j = 0; j < idList.length; j++) {
        if (pList[i].id === idList[j]) {
          pList.splice(i, 1);
        }
      }
    }
    await deleteBatchCollectProduct(idList);
    if (pList.length === 0) {
      await this.getList(1);
    }

    // 取消成功后状态初始化
    this.setState({ isEdite: false, selectedAll: false }, () => {
      this.props.navigation.setParams({ isEdites: this.state.isEdite, pLists: this.state.pList });
    });
  }

  onPressGoBack = () => {
    this.props.navigation.goBack();
  };

  _keyExtractor = (item, index) => `${index}`;

  emptyComponent() {
    const { showEmpty } = this.state;
    if (showEmpty) {
      return (
        <View style={styles.emptyWrap}>
          <Image style={styles.emptyImg} resizeMode="center" source={{ uri: 'http://family-img.vxiaoke360.com/no-collect2.png' }} />
          <Text style={styles.emptyInfo}>暂无收藏喔，快去浏览商品吧~</Text>
        </View>
      );
    }
    return null;
  }

  render() {
    const { isEdite, selectedAll, pList } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.orderWrap}>
          <FlatList
            keyboardShouldPersistTaps="always"
            style={styles.flatWrap}
            data={this.state.pList}
            keyExtractor={this._keyExtractor}
            renderItem={(item) => this.renderList(item)}
            onEndReachedThreshold={0.1}
            onEndReached={this.onFooterLoad}
            ListFooterComponent={() => this.loadingText()}
            ListEmptyComponent={() => this.emptyComponent()}
            refreshControl={<RefreshControl refreshing={false} onRefresh={this.onHeaderRefresh} title="加载中..." />}
          />
        </View>
        {isEdite && pList.length > 0 ? (
          <View style={styles.fixBtnWrap}>
            <BoxShadow setting={shadowOpt} />
            <View style={styles.bottomCollectBar}>
              <TouchableOpacity onPress={this.selectAll}>
                <View style={styles.flexRow}>
                  <Image style={styles.choiceImg} source={selectedAll ? require('../../../assets/personal/choiced.png') : require('../../../assets/personal/noChoice.png')} />
                  <Text style={{ marginLeft: 4 }}>全选</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={Layout.activeOpacity} onPress={this.cancelCollectProduct}>
                <View>
                  <LinearGradient style={styles.cancelCollect} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.48 }} colors={['#FF7BA1', '#FC4277']}>
                    <Text style={styles.collectBtn}>取消收藏</Text>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        <NavigationEvents onDidBlur={() => this.blur()} onDidFocus={() => this.init()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rightBtn: {
    paddingRight: 16,
  },
  rightBtnText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
  },
  orderWrap: {
    flex: 1,
  },
  flatWrap: {
    flex: 1,
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },

  editeText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
  },
  loadingText: {
    width: '100%',
    lineHeight: 30,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
    marginTop: 30,
    marginBottom: 30,
  },
  headerWrap: {
    height: 36,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#FFE9EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInfo: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#EA4457',
  },
  headerInfo1: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
  },
  emptyWrap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImg: {
    width: 150,
    height: 150,
    marginTop: 100,
  },
  emptyInfo: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  fixBtnWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 9,
    width: '100%',
    paddingTop: 9,
    backgroundColor: '#fff',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  bottomCollectBar: {
    height: 48,
    paddingLeft: 24,
    paddingRight: 16,
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collectBtn: {
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
    color: '#fff',
  },
  cancelCollect: {
    width: 72,
    height: 30,
    borderRadius: 24.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceImg: {
    width: 24,
    height: 24,
  },
});
