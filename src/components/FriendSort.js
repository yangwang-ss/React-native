import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
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
    top: 44,
    right: 8,
    zIndex: 500,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 4,
  },
};

export default class FriendSort extends React.Component {
  state = {
    sortList: [
      {
        name: '加入时间',
        sortIndex: 0,
        params: 'invitation_date',
      },
      {
        name: '好友数量',
        sortIndex: 1,
        params: 'member_amount',
      },
      {
        name: '好友等级',
        sortIndex: 2,
        params: 'roleId',
        checked: false,
      },
    ],
    roleId: '',
    sortType: 'descs',
    sortParams: 'invitation_date',
  };

  changeSort = (item, type, tab) => {
    const { changeSort, touchItem } = this.props;
    const arr = this.state.sortList;
    const { roleId } = this.state;
    // arr[2].name = '好友等级'
    // arr[2].checked = false
    let sortType = '';
    let sortParams = '';
    if (item.sortIndex !== 2) {
      if (tab === item.sortIndex) {
        if (type !== 'descs') {
          sortType = 'descs';
          sortParams = `${item.params}`;
        } else {
          sortType = 'ascs';
          sortParams = `${item.params}`;
        }
      } else {
        sortType = 'descs';
        sortParams = `${item.params}`;
      }
      this.changeTouchItem(true);
      this.setState({
        sortType,
        sortParams: `${item.params}`,
        // sortList: arr
      });
      if (arr[2].name != '好友等级') {
        changeSort(item, sortType, sortParams, 'vipType', roleId);
      } else {
        changeSort(item, sortType, sortParams);
      }
    } else {
      this.changeTouchItem(!touchItem);
      // const tab = this.state.sortList[2]
      // changeSort(tab, 'roleId', '');
    }
  };

  changeTouchItem = boo => {
    const { changeTouchItem } = this.props;
    changeTouchItem(boo);
  };

  checkItem(item) {
    const { sortType, sortParams } = this.state;
    const { changeSort } = this.props;
    const tab = this.state.sortList[2];
    const arr = this.state.sortList;
    arr[2].name = item.name;
    arr[2].checked = item.name != '好友等级';
    this.changeTouchItem(true);
    this.setState({
      sortList: arr,
      roleId: `${item.roleId}`,
    });
    // if (item.name != '好友等级') {
    //   changeSort(item, sortType, sortParams, 'vipType', `${item.roleId}`);
    // }
    changeSort(tab, 'roleId', `${item.roleId}`);
  }

  renderProList(item) {
    const params = item.item;
    return (
      <TouchableOpacity style={[styles.listItem, styles.checked]} onPress={() => this.checkItem(params)}>
        <Text style={styles.listItemText}>{params.name}</Text>
        <Text style={styles.listItemText}>{params.num}人</Text>
      </TouchableOpacity>
    );
  }

  renderSortTab = () => {
    const { sortType, sortTab } = this.props;
    const { sortList } = this.state;
    const arr = [];
    sortList.map((item, i) => {
      arr.push(
        <TouchableOpacity key={i} onPress={() => this.changeSort(item, sortType, sortTab)} style={styles.sortBox}>
          <Text style={[styles.sortText, sortTab === item.sortIndex || item.checked ? styles.sortAct : '']}>{item.name}</Text>
          {item.sortIndex !== 2 ? (
            <View style={styles.arrowBox}>
              <View style={[styles.arrowUp, sortTab === item.sortIndex && sortType == 'ascs' && styles.arrowUpAct]} />
              <View style={[styles.arrowDown, sortTab === item.sortIndex && sortType == 'descs' && styles.arrowDownAct]} />
            </View>
          ) : (
            <Image style={styles.iconSpe} source={require('../../assets/friend-selec.png')} />
          )}
        </TouchableOpacity>
      );
    });
    return arr;
  };

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const { roleList, touchItem } = this.props;
    return (
      <View>
        <View style={styles.sortWrap}>{this.renderSortTab()}</View>
        {!touchItem ? (
          <BoxShadow setting={shadowOpt}>
            <View style={styles.listWrap}>
              <View style={styles.angle} />
              <FlatList key="own" data={roleList} keyExtractor={this._keyExtractor} renderItem={item => this.renderProList(item)} />
            </View>
          </BoxShadow>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sortWrap: {
    flexDirection: 'row',
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    position: 'relative',
  },
  sortText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'PingFangSC-Regular',
  },
  sortAct: {
    color: '#EA4457',
    fontFamily: 'PingFangSC-Medium',
  },
  arrowBox: {
    marginLeft: 4,
    marginTop: 3,
  },
  sortBox: {
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
  },
  arrowUp: {
    marginBottom: 2.8,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 3,
    borderTopColor: '#fff',
    borderBottomColor: '#888',
    borderLeftColor: '#fff',
    borderRightColor: '#fff',
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 3,
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
  iconSpe: {
    width: 10.2,
    height: 11,
    alignSelf: 'center',
  },
  listWrap: {
    width: 188,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 4,
    position: 'relative',
  },
  listItem: {
    width: '100%',
    height: 40,
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
    fontSize: 12,
    color: '#666',
    lineHeight: 40,
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
