import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, Image, StatusBar } from 'react-native';
import DayListItem from '@components/DayListItem';
import LoadingText from '@components/LoadingText';
import { rankingList } from '../../services/api';
export default class TodaysList extends PureComponent{
  static navigationOptions = {
    title: '好友购买',
  };

  state = {
    list: [],
    menus: [
      {
        name: '今日榜单',
        type: 1,
      },
      {
        name: '近三天榜单',
        type: 2,
      },
    ],
    isEmpty: false,
    type: 1,
    loadingState: '',
  };

  componentDidMount() {
    this.getStoreOrderList();
  }

  async getStoreOrderList() {
    const { type } = this.state;
    let loadingState = 'loading';
    this.setState({
      loadingState,
      isEmpty: false,
    });
    const res = await rankingList(type);
    if (res && res.list && res.list.length) {
      this.canLoadMore = true;
      this.setState({
        list: [...res.list],
        loadingState: '',
        isEmpty: false,
      });
    } else {
      if (this.state.list.length > 0) {
        loadingState = 'noMoreData';
        this.setState({
          isEmpty: false,
        });
      } else {
        this.setState({
          isEmpty: true,
        });
        loadingState = '';
      }
      this.setState({
        loadingState,
      });
    }
  }

  loadingText = () => {
    const { loadingState } = this.state;
    return (
      <LoadingText loading={loadingState} />
    );
  };

  renderMenus = () => {
    const { menus, type } = this.state;
    return menus.map((item, index) => {
      return (
        <View key={index} style={styles.tabWrap}>
          <Text onPress={() => this.menuChange(item)} style={[styles.tabs, item.type === type && styles.tabActive]}>
            {item.name}
          </Text>
          {item.type === type && <View style={styles.tabIcon} />}
        </View>
      );
    });
  };

  menuChange = (item) => {
    this.setState(
      {
        list: [],
        type: item.type,
      },
      () => {
        this.getStoreOrderList();
      }
    );
  };

  emptyComponent = () => {
    return (
      <View style={styles.emptyWrap}>
        <Image style={styles.emptyImg} resizeMode="center" source={{ uri: 'http://family-img.vxiaoke360.com/no-order2.png' }} />
        <Text style={styles.emptyInfo}>暂无数据</Text>
      </View>
    );
  };

  orderItem = (info) => {
    return (
      <DayListItem
        info={info.item}
        navigation={this.props.navigation}
      />
    );
  };

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const { list, isEmpty } = this.state;
    return(
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
        <View>
          <ScrollView contentContainerStyle={styles.scrollView} horizontal>
            {this.renderMenus()}
          </ScrollView>
        </View>
        <FlatList
          style={styles.flatWrap}
          data={list}
          keyExtractor={this._keyExtractor}
          renderItem={this.orderItem}
          ListFooterComponent={() => this.loadingText()}
        />
        {
          isEmpty && (
            this.emptyComponent()
          )
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  flatWrap: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  scrollView: {
    marginBottom: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: '100%',
  },
  tabWrap: {
    width: '50%',
    height: 42,
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
  emptyWrap: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyImg: {
    width: 150,
    height: 150,
    marginTop: '40%',
  },
  emptyInfo: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    width: '100%',
    textAlign: 'center',
  },
});
