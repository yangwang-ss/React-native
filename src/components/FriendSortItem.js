import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, FlatList,
} from 'react-native';
import { BoxShadow } from 'react-native-shadow';

const shadowOpt = {
  width: 188,
  height: 200,
  color: '#000',
  border: 6,
  radius: 4,
  opacity: 0.04,
  x: 0,
  y: 0,
  style: {
    position: 'absolute',
    top: 219,
    right: 8,
    zIndex: 500,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 4,
  },
};

export default class FriendSortItem extends React.Component {
  state = {
    list: [],
  }

  _keyExtractor = (item, index) => `${index}`;

  checkItem(item) {}

  renderProList(item) {
    const params = item.item;
    return (
      <TouchableOpacity style={[styles.listItem, styles.checked]} onPress={() => this.checkItem(params)}>
        <Text style={styles.listItemText}>{params.name}</Text>
        <Text style={styles.listItemText}>
          {params.num}
人
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <BoxShadow setting={shadowOpt}>
        <View style={styles.listWrap}>
          <View style={styles.angle} />
          <FlatList
            data={this.state.list}
            keyExtractor={this._keyExtractor}
            renderItem={item => this.renderProList(item)}
          />
        </View>
      </BoxShadow>
    );
  }
}

const styles = StyleSheet.create({
  listWrap: {
    width: 188,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  listItem: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 24,
    borderBottomColor: '#EFEFEF',
    borderBottomWidth: 0.5,
  },
  listItemText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 44,
  },
  angle: {
    width: 0,
    height: 0,
    borderWidth: 8,
    borderColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: '#fff',
    position: 'absolute',
    top: -16,
    right: 44,
  },
  checkedItem: {
    backgroundColor: '#F6F6F6',
  },
  modla: {
    position: 'absolute',
    top: 44,
    right: 8,
    zIndex: 500,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 4,
  },
});
