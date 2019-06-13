import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Layout from '../constants/Layout';
import ProductItem from './PrdList';

export default class PrdColumnList extends React.Component {
  productItem = (elem) => {
    const { item, index } = elem;
    const { list } = this.props;
    return (
      <ProductItem item={item} index={index + 1} jumpDetail={this.jumpDetail} showTitle={index == 0} titleText={list.length ? '全网热推' : '精选商品'} />
    );
  };

  jumpDetail = (item) => {
    const { jumpDetail } = this.props;
    jumpDetail(item);
  };

  headerComponent() {
    const { speList } = this.props;
    if (speList) {
      const arr = [];
      speList.map((item, index) => {
        arr.push(
          <ProductItem item={item} index={index + 1} jumpDetail={this.jumpDetail} showTitle={index == 0} titleText="精选商品" key={index} />,
        );
      });
      return arr;
    }
    return null;
  }

  render() {
    const { speList, list } = this.props;
    if (list.length) {
      return (
        <FlatList
          style={styles.listWrap}
          data={list}
          keyExtractor={(item, index) => (item + index).toString()}
          renderItem={this.productItem}
          onEndReachedThreshold={0.1}
          onEndReached={() => this.props.onFooterLoad()}
          ListFooterComponent={() => this.props.loadingText()}
          ListHeaderComponent={() => this.headerComponent()}
        />
      );
    }
    return (
      <FlatList
        style={styles.listWrap}
        data={speList}
        keyExtractor={(item, index) => (item + index).toString()}
        renderItem={this.productItem}
        onEndReachedThreshold={0.1}
        onEndReached={() => this.props.onFooterLoad()}
        ListFooterComponent={() => this.props.loadingText()}
      />
    );
  }
}

const styles = StyleSheet.create({
  listWrap: {
    width: Layout.window.width,
    backgroundColor: '#f4f4f4',
  },
});
