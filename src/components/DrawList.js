import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default class DrawList extends React.Component {
  render() {
    const { detail } = this.props;
    const { item } = detail;
    return (
      <View>
        {item.headimgType == 1 && (
          <View style={styles.listWrap}>
            <View style={styles.listLeft}>
              <Image style={styles.listImg} source={require('../../assets/drawDetail-icon-team.png')} />
              <View style={styles.listTypeWrap}>
                <Text style={styles.listType}>{item.typeStr}</Text>
                <Text style={styles.listTime}>{item.ctimeStr}</Text>
              </View>
            </View>
            <Text style={styles.listPrice}>+{item.moneyStr}</Text>
          </View>
        )}

        {item.headimgType == 2 && (
          <View style={styles.listWrap}>
            <View style={styles.listLeft}>
              <Image style={styles.listImg} source={require('../../assets/drawDetail-icon-get.png')} />
              <View style={styles.listTypeWrap}>
                <Text style={styles.listType}>{item.typeStr}</Text>
                <Text style={styles.listTime}>{item.ctimeStr}</Text>
              </View>
            </View>
            <Text style={[styles.listPrice, styles.listPrice2]}>{item.moneyStr}</Text>
          </View>
        )}

        {item.headimgType == 3 && (
          <View style={styles.listWrap}>
            <View style={[styles.listLeft, styles.listLeft2]}>
              <Image style={styles.listImg} source={require('../../assets/drawDetail-icon-type3.png')} />
              <View style={[styles.listTypeWrap, styles.listTypeWrap2]}>
                <Text style={styles.listType}>{item.typeStr}</Text>
                <Text style={styles.listOrder}>
                  [订单]
                  {item.orderId}
                </Text>
                <Text style={styles.listTime}>{item.ctimeStr}</Text>
              </View>
            </View>
            <Text style={styles.listPrice}>+{item.moneyStr}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listWrap: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: '#efefef',
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  listTypeWrap: {
    marginLeft: 12,
  },
  listType: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333',
  },
  listLeft2: {
    alignItems: 'flex-start',
  },
  listTime: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  listPrice: {
    fontFamily: 'DINA',
    fontSize: 18,
    color: '#FC4277',
  },
  listPrice2: {
    color: '#333',
  },
  listOrder: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#3333',
  },
});
