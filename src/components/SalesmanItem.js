import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Layout from '../constants/Layout';
import VipIcon from './VipIcon';

const styles = StyleSheet.create({
  itemsWrap: {
    width: '100%',
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#fff',
  },
  shopOwnerName: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shopOwnerIcon: {
    width: 49,
    height: 16,
    marginLeft: 4,
  },
  showOwnerItem: {
    width: '100%',
    flexDirection: 'row',
    borderBottomColor: '#efefef',
    borderBottomWidth: 0.5,
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 6,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 8,
  },
  infoList: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'PingFangSC-Medium',
    marginRight: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    fontFamily: 'PingFangSC-Regular',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'PingFangSC-Regular',
  },
  text: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'PingFangSC-Medium',
  },
  salesManImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 2,
  },
  mesgLeft: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
  },
});

export default class SalesmanItem extends React.Component {
  handelSalesman = item => {
    const { handelSalesman } = this.props;
    handelSalesman(item);
  };

  render() {
    const { item, isLine, type } = this.props;
    return (
      <TouchableOpacity style={styles.itemsWrap} activeOpacity={Layout.activeOpacity} onPress={() => this.handelSalesman(item)}>
        <View style={[styles.showOwnerItem, isLine && styles.noBorder]}>
          <Image style={styles.itemImage} source={{ uri: type === 1 ? item.headImg : item.headImgUrl }} />
          <View style={styles.itemInfo}>
            <View style={styles.shopOwnerName}>
              <Text style={styles.name}>{item.nickname.length > 11 ? item.nickname.substr(0, 11) : item.nickname}</Text>
              <VipIcon roleId={item.roleId} levelName={item.levelName} />
            </View>
            <View style={styles.infoList}>{type === 1 ? <Text style={styles.time}>邀请时间：{item.inviteTime}</Text> : <Text style={styles.time}>直升时间：{item.upTime}</Text>}</View>
            {type === 1 && (
              <View style={styles.infoList}>
                <Text style={styles.infoText}>好友数量：</Text>
                <Text style={styles.text}>{item.friendNum}</Text>
              </View>
            )}
            {type === 2 && (
              <View>
                <View style={styles.infoList}>
                  <Text style={styles.infoText}>发展店长人数：</Text>
                  <Text style={styles.text}>{item.storeNum}</Text>
                </View>
                <View style={styles.infoList}>
                  <Text style={styles.infoText}>店长预估收益：</Text>
                  <Text style={styles.text}>￥{item.storeIncome || '0'}</Text>
                </View>
              </View>
            )}
            <View style={styles.infoList}>
              <Text style={styles.infoText}>最近登录时间：</Text>
              <Text style={styles.infoText}>{item.lastLoginTime}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
