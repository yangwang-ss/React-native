import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity,
} from 'react-native';
import Layout from '../constants/Layout';

export default class SchoolItem extends Component {
  jumpArticleDetail(item, index) {
    const { jumpArticleDetail } = this.props;
    jumpArticleDetail(item, index);
  }

  render() {
    const { info, isLine, index } = this.props;
    return (
      <View style={styles.padding12}>
        <TouchableOpacity style={[styles.itemContainer, isLine ? styles.noBorder : '']} activeOpacity={0.85} onPress={() => this.jumpArticleDetail(info, index)}>
          <Image style={styles.itemImg} source={{ uri: info.imgUrl }} />
          <View style={styles.itemRight}>
            <View style={{ overflow: 'hidden', height: Layout.scaleSize(46) }}>
              <Text numberOfLines={3} style={styles.itemTitle}>{info.title}</Text>
            </View>
            <View style={styles.timeWrap}>
              <Text style={styles.itemTime}>{info.time}</Text>
              <Text style={styles.itemRead}>
阅读
                <Text style={{ color: '#333' }}>{info.readNum}</Text>
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  padding12: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  itemContainer: {
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#EFEFEF',
    borderBottomWidth: 0.5,
  },
  noBorder: {
    borderBottomColor: 'transparent',
  },
  itemImg: {
    width: 112,
    height: 84,
    backgroundColor: '#000',
  },
  itemRight: {
    width: Layout.scaleSize(227),
    height: 84,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: Layout.scaleSize(15),
    color: '#333',
    lineHeight: Layout.scaleSize(22),
    fontFamily: 'PingFangSC-Medium',
    height: 80,
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTime: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
  },
  itemRead: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
  },
});
