import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ProductDouble from './PrdDoubleItem';
import ProductSingle from './PrdList';
import Layout from '../constants/Layout';

export default class PrdDoubleList extends React.Component {
  /**
   * 双排列表渲染
   */
  singleItem = (info) => {
    if (info.index % 2 == 0) {
      info.item.needMR = true;
    } else {
      info.item.needMR = false;
    }
    return (
      <ProductDouble item={info.item} index={info.index} jumpDetail={this.jumpDetail} />
    );
  };

  /**
   * 单排列表渲染
   */
  doubleItem = (elem) => {
    const { item, index } = elem;
    return (
      <ProductSingle item={item} index={index + 1} jumpDetail={this.jumpDetail} />
    );
  };

  /**
   * 事件绑定
   */
  jumpDetail = (item) => {
    const { jumpDetail } = this.props;
    jumpDetail(item);
    console.log('jumpDetail===2', item);
  };

  onFooterLoad = () => {
    const { onFooterLoad } = this.props;
    onFooterLoad();
  };

  render() {
    const { isDouble } = this.props;
    let view = null;
    if (isDouble) {
      view = (
        <FlatList
          {...this.props}
          contentContainerStyle={{ justifyContent: 'space-between', flexWrap: 'wrap' }}
          style={styles.listWrap}
          keyboardShouldPersistTaps="handled"
          data={this.props.list}
          keyExtractor={(item, index) => (item.id).toString()}
          onEndReachedThreshold={0.2}
          onEndReached={this.onFooterLoad}
          renderItem={this.singleItem}
        />
      );
    } else {
      view = (
        <FlatList
          style={styles.listWrap2}
          data={this.props.list}
          keyExtractor={(item, index) => (item + index).toString()}
          renderItem={this.doubleItem}
          onEndReachedThreshold={0.1}
          onEndReached={() => this.onFooterLoad()}
        />
      );
    }
    return view;
  }
}

const styles = StyleSheet.create({
  listWrap: {
    backgroundColor: '#f4f4f4',
    width: Layout.window.width,
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
  },
  listWrap2: {
    backgroundColor: '#f4f4f4',
  },
});
