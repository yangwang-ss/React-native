import React from 'react';
import LoadingText from '@components/LoadingText';
import { View, Text, StyleSheet, Image, FlatList, RefreshControl } from 'react-native';

export default class CheckPendingItem extends React.Component {
  onFooterLoad = () => {
    const { onFooterLoad } = this.props;
    onFooterLoad();
  };

  onHeaderRefresh = () => {
    const { onHeaderRefresh } = this.props;
    onHeaderRefresh();
  };

  renderList(item) {
    return (
      <View style={[styles.flexContainer, styles.infoContainer]}>
        <Text style={[styles.textInfo, styles.listWidth1]}>
          {item.nickName.length > 0 ? item.nickName.substr(0, 10) : item.nickName}
        </Text>
        <Text style={[styles.textInfo, styles.listWidth1]}>{item.mobile}</Text>
        <Text style={[styles.textInfo, styles.listWidth2, item.statusCode === 0 && styles.statusColor]}>{item.status}</Text>
      </View>
    );
  }

  emptyComponent = () => {
    return (
      <View style={styles.noDataWrap}>
        <Image style={styles.noDataImg} source={{uri: 'http://family-img.vxiaoke360.com/search-empty.png'}} />
        <Text style={styles.noDataTip}>暂无数据</Text>
      </View>
    )
  };

  loadingText = () => {
    const { loadingState, userLists } = this.props;
    if (userLists.length > 0) {
      return (
        <LoadingText loading={loadingState} />
      );
    }
    return null;
  };

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const { userLists, isEmpty } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.flexContainer}>
          <Text style={[styles.textInfo, styles.titleText, styles.listWidth1]}>姓名</Text>
          <Text style={[styles.textInfo, styles.titleText, styles.listWidth1]}>联系电话</Text>
          <Text style={[styles.textInfo, styles.titleText, styles.listWidth2]}>状态</Text>
        </View>
        {
          userLists.length > 0 && (
            <FlatList
              style={styles.flatWrap}
              data={userLists}
              keyExtractor={this._keyExtractor}
              renderItem={({ item }) => this.renderList(item)}
              onEndReachedThreshold={0.1}
              onEndReached={this.onFooterLoad}
              ListFooterComponent={() => this.loadingText()}
              refreshControl={<RefreshControl refreshing={false} onRefresh={this.onHeaderRefresh} title="加载中..." />}
            />
          )
        }
        {isEmpty && this.emptyComponent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatWrap: {
    flex: 1,
  },
  flexContainer: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 14,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    paddingTop: 11,
    paddingBottom: 11,
  },
  listWidth1: {
    width: '40%',
    marginRight: 10,
  },
  listWidth2: {
    flex: 1,
  },
  textInfo: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
  },
  titleText:{
    fontFamily: 'PingFangSC-Medium',
  },
  statusColor: {
    color: '#fc4277',
  },
  noDataWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  noDataImg: {
    marginTop: 100,
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  noDataTip: {
    fontFamily: 'PingFangSC-Regular',
    color: '#999',
    fontSize: 14,
    width: '100%',
    textAlign: 'center',
  },
});
