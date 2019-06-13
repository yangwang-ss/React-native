import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ProductItem from './PrdDoubleItem';
import Layout from '../constants/Layout';

export default class PrdDoubleList extends React.Component {
  renderItem = (info) => {
    if (info.index % 2 == 0) {
      info.item.needMR = true;
    } else {
      info.item.needMR = false;
    }
    return (
      <ProductItem item={info.item} index={info.index} jumpDetail={this.jumpDetail} />
    );
  };

  jumpDetail = (item) => {
    const { jumpDetail } = this.props;
    jumpDetail(item);
  };

  onFooterLoad = () => {
    const { onFooterLoad } = this.props;
    onFooterLoad();
  };

  render() {
    return (
      <FlatList
        {...this.props}
        contentContainerStyle={{ justifyContent: 'space-between' }}
        style={styles.listWrap}
        keyboardShouldPersistTaps="handled"
        numColumns={2}
        data={this.props.list}
        keyExtractor={(item, index) => (item + index).toString()}
        onEndReachedThreshold={0.2}
        onEndReached={this.onFooterLoad}
        renderItem={this.renderItem}
      />
    );
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
});
