import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import LoadingText from '@components/LoadingText';

const styles = StyleSheet.create({
  ownerContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    flex: 1,
  },
  ownerWrap: {
    height: '100%',
    flex: 1,
  },
  itemsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  itemWidth1: {
    width: '26%',
  },
  itemWidth2: {
    width: '48%',
  },
});

export default class ServiceProviderItem extends React.Component {
  loadingText = () => {
    const { loadingState } = this.props;
    return <LoadingText loading={loadingState} />;
  };

  onFooterLoad = () => {
    const { onFooterLoad } = this.props;
    onFooterLoad();
  };

  onHeaderRefresh = () => {
    const { onHeaderRefresh } = this.props;
    onHeaderRefresh();
  };

  listComponent = ({ item }) => {
    return (
      <View style={styles.itemsWrap}>
        <Text style={[styles.itemText, styles.itemWidth1]}>{item.nickname && item.nickname.length > 11 ? `${item.nickname.substr(0, 11)}...` : item.nickname}</Text>
        <Text style={[styles.itemText, styles.itemWidth2]}>{item.mobile}</Text>
        <Text style={[styles.itemText, styles.itemWidth1]}>{item.roleName}</Text>
      </View>
    );
  };

  render() {
    const { list } = this.props;
    return (
      <View style={styles.ownerContainer}>
        <FlatList
          style={styles.ownerWrap}
          data={list}
          onEndReachedThreshold={0.1}
          keyExtractor={this._keyExtractor}
          renderItem={this.listComponent}
          onEndReached={this.onFooterLoad}
          ListFooterComponent={() => this.loadingText()}
          refreshControl={<RefreshControl refreshing={false} onRefresh={this.onHeaderRefresh} title="加载中..." />}
        />
      </View>
    );
  }
}
