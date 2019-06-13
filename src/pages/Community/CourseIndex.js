import React, { Component } from 'react';
import {
  StyleSheet, Text, FlatList, View, StatusBar, RefreshControl, TouchableOpacity,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import LoadingText from '@components/LoadingText';
import Layout from '../../constants/Layout';
import { getCourseVideoList } from '../../services/api';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f6f6',
    flex: 1,
    paddingTop: 20,
  },
  shareIcon: {
    width: 24,
    height: 24,
  },
  tabBox: {
    paddingTop: 12,
    paddingRight: 30,
    paddingLeft: 30,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  tabList: {
    width: '30%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  tabIcon: {
    borderWidth: 1,
    borderColor: '#FC4277',
    width: 16,
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
    marginBottom: 8,
    lineHeight: 26,
    fontFamily: 'PingFangSC-Medium',
  },
  listBox: {
    paddingTop: 20,
  },
  moveList: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 20,
  },
  moveTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  moveItem: {
    position: 'relative',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
});

export default class CourseIndex extends Component {
  static navigationOptions = {
    title: '新手教程',
  };

  state = {
    menus: [{
      name: '新手教程',
      active: true,
      type: 0,
    }, {
      name: '版本更新',
      active: false,
      type: 1,
    }, {
      name: '米粒小技巧',
      active: false,
      type: 3,
    }],
    loadingState: '',
    tabType: 0,
    tagId: 6,
    curPage: 1,
    dataList: [],
    player: [],
    canLoadMore: false,
  };

  componentDidMount() {
    const tagId = this.props.navigation.getParam('tagId', '');
    this.setState({
      tagId,
    }, () => this.getCourseList());
  }

  menuChange = (item, index) => {
    const { menus } = this.state;
    const menusArr = menus;
    menusArr.map((item) => {
      item.active = false;
    });
    menusArr[index].active = true;
    this.setState({
      curPage: 1,
      tabType: item.type,
      menus: menusArr,
      dataList: [],
    }, () => this.getCourseList());
  };

  onPlayPress = (index) => {
    this.state.player.map((item, i) => {
      if (i !== index) {
        item.pause();
      }
    });
  }

  onFooterLoad() {
    const { canLoadMore } = this.state;
    console.log('上拉加载===onFooterLoad', this.state.curPage);
    if (!canLoadMore) return;
    this.getCourseList();
  }

  // 下拉刷新
  onHeaderRefresh = () => {
    console.log('onHeaderRefresh==触发');
    this.setState({
      curPage: 1,
      dataList: [],
    }, () => {
      this.getCourseList();
    });
  };

  async getCourseList() {
    let {
      curPage, tabType, tagId,
    } = this.state;
    let loadingState = 'loading';
    this.setState({ loadingState });
    const params = {
      page: curPage,
      tagId,
    };
    const res = await getCourseVideoList(params);
    if (res && res.length) {
      curPage++;
      this.setState({
        dataList: [...this.state.dataList, ...res],
        loadingState: '',
        curPage,
        canLoadMore: true,
      });
    } else {
      if (this.state.dataList.length) {
        loadingState = 'noMoreData';
      } else {
        loadingState = 'empty';
      }
      this.setState({
        loadingState,
      });
    }
  }

  courseList = (info) => {
    const { item } = info;
    return (
      <View style={styles.moveList} key={info.index}>
        <Text style={styles.moveTitle}>
          {`${info.index + 1}.${item.title}`}
        </Text>
        <TouchableOpacity style={styles.moveItem}>
          <VideoPlayer
            endWithThumbnail
            thumbnail={{ uri: item.backgroundUrl || item.imgUrl }}
            video={{ uri: item.contentUrl }}
            videoWidth={Layout.window.width - 24}
            videoHeight={190}
            resizeMode="cover"
            pauseOnPress
            onPlayPress={() => this.onPlayPress(info.index)}
            onStart={() => this.onPlayPress(info.index)}
            ref={r => this.state.player[info.index] = r}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderMenus = () => {
    const { menus } = this.state;
    const arr = [];
    menus.map((item, index) => {
      arr.push(
        <View key={index} style={styles.tabList}>
          <Text
            onPress={() => this.menuChange(item, index)}
            style={[styles.tabs, item.active ? styles.tabActive : '']}
          >
            {item.name}
          </Text>
          {
            item.active && <View style={styles.tabIcon} />
          }
        </View>,
      );
    });
    return arr;
  };

  loadingText = () => {
    const { loadingState, dataList } = this.state;
    if (dataList.length) {
      return (
        <LoadingText loading={loadingState} />
      );
    }
    return null;
  };

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const { dataList } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        {/*
        <View style={styles.tabBox}>
          {this.renderMenus()}
        </View>
        */}
        <FlatList
          data={dataList}
          keyExtractor={this._keyExtractor}
          renderItem={this.courseList}
          onEndReachedThreshold={0.1}
          onEndReached={this.onFooterLoad.bind(this)}
          ListFooterComponent={() => this.loadingText()}
          refreshControl={(
            <RefreshControl
              refreshing={false}
              onRefresh={this.onHeaderRefresh}
              title="加载中..."
            />
          )}
        />
      </View>
    );
  }
}
