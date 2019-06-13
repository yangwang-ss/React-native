import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Switch from 'react-native-switch-pro';

export default class SortTab extends React.Component {
  state = {
    sortList: [
      {
        name: '综合',
        sortIndex: 0,
        params: '',
      },
      {
        name: '价格',
        sortIndex: 1,
        params: 'price',
      },
      {
        name: '销量',
        sortIndex: 2,
        params: 'total_sales',
      },
    ],
  };

  changeSort = (item, type, tab) => {
    const { changeSort } = this.props;
    let sortType = '';
    let sortParams = '';
    if (item.sortIndex !== 0) {
      if (tab === item.sortIndex) {
        if (type !== 'des') {
          sortType = 'des';
          sortParams = `${item.params}_des`;
        } else {
          sortType = 'asc';
          sortParams = `${item.params}_asc`;
        }
      } else if (item.params === 'total_sales') {
        sortType = 'des';
        sortParams = `${item.params}_des`;
      } else {
        sortType = 'asc';
        sortParams = `${item.params}_asc`;
      }
    }
    changeSort(item, sortType, sortParams);
  };

  changeTagQuan = () => {
    const { changeTagQuan } = this.props;
    changeTagQuan();
  };

  renderSortTab = () => {
    const { sortType, sortTab } = this.props;
    const { sortList } = this.state;
    const arr = [];
    sortList.map((item, i) => {
      arr.push(
        <TouchableOpacity key={i} onPress={() => this.changeSort(item, sortType, sortTab)} style={styles.sortBox}>
          <Text style={[styles.sortText, sortTab === item.sortIndex && styles.sortAct]}>{item.name}</Text>
          {item.sortIndex !== 0 && (
            <View style={styles.arrowBox}>
              <View style={[styles.arrowUp, sortTab === item.sortIndex && sortType === 'asc' && styles.arrowUpAct]} />
              <View style={[styles.arrowDown, sortTab === item.sortIndex && sortType === 'des' && styles.arrowDownAct]} />
            </View>
          )}
        </TouchableOpacity>
      );
    });
    return arr;
  };

  render() {
    const { hasCoupon } = this.props;

    return (
      <View>
        <View style={styles.sortWrap}>{this.renderSortTab()}</View>
        <View style={styles.quanTagWrap}>
          <View style={styles.quanTagInfo}>
            <Image style={styles.quanTagImg} source={require('../../assets/search-icon-coupon.png')} />
            <Text style={styles.quanTagText}>仅显示优惠券商品</Text>
          </View>
          <Switch
            width={42}
            height={24}
            backgroundActive="#DDDDDD"
            backgroundInactive="#f4f4f4"
            value={hasCoupon}
            onSyncPress={() => {
              this.changeTagQuan();
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sortWrap: {
    flexDirection: 'row',
    paddingLeft: 32,
    paddingRight: 32,
    height: 35,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortText: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
  },
  sortAct: {
    color: '#EE3383',
    fontFamily: 'PingFangSC-Medium',
  },
  arrowBox: {
    marginLeft: 10,
    marginTop: -1,
  },
  sortBox: {
    flexDirection: 'row',
  },
  arrowUp: {
    marginBottom: 2.8,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 4,
    borderTopColor: '#fff',
    borderBottomColor: '#888',
    borderLeftColor: '#fff',
    borderRightColor: '#fff',
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 4,
    borderTopColor: '#888',
    borderBottomColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#fff',
  },
  arrowUpAct: {
    borderBottomColor: '#EA4457',
  },
  arrowDownAct: {
    borderTopColor: '#EA4457',
  },
  quanTagWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    height: 35,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  quanTagInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  quanTagImg: {
    width: 16,
    height: 12,
    marginRight: 13,
  },
  quanTagText: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'PingFangSC-Regular',
  },
});
