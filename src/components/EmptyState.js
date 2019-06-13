import React from 'react';
import {
  StyleSheet, Text, View, Image,
} from 'react-native';

export default class EmptyState extends React.Component {
  render() {
    const { source } = this.props;
    return (
      <View style={{ width: '100%', flex: 1 }}>
        {
        source == 'detail' ? (
          <View style={[styles.noOrder, styles.noOrder2]}>
            <Image style={styles.noOrderImg} resizeMode="center" source={{ uri: 'http://family-img.vxiaoke360.com/no-friend2.png' }} />
            <Text style={styles.noOrderText}>商品已抢光~</Text>
          </View>
        ) : (
          <View style={styles.noOrder}>
            <Image style={styles.noOrderImg} resizeMode="center" source={{ uri: 'http://family-img.vxiaoke360.com/no-order2.png' }} />
            <Text style={styles.noOrderText}>空空如也~</Text>
          </View>
        )
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  noOrder: {
    flex: 1,
    alignItems: 'center',
  },
  noOrder2: {
    justifyContent: 'center',
  },
  noOrderImg: {
    width: 150,
    height: 150,
  },
  noOrderText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
  },
});
