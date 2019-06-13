/* eslint-disable no-param-reassign */
import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, FlatList, InteractionManager } from 'react-native';
import { memberManageContactsList } from '@api';
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import _ from 'lodash';
import { BoxShadow } from 'react-native-shadow';
import Layout from '@constants/Layout';
import { setPhones } from '../../actions/phoneList';
import store from '../../store/configureStore';

const styles = StyleSheet.create({
  containerWrap: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  notSelect: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor: '#999',
    borderWidth: 1,
  },
  selected: {
    width: 16,
    height: 16,
  },
  rightArrow: {
    width: 16,
    height: 16,
    marginLeft: 16.5,
  },
  item: {
    backgroundColor: '#fff',
    height: 56,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  con: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e4e4e4',
    height: '100%',
    paddingRight: 17,
  },
  text1: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 11,
    borderRadius: 20,
  },
  footerWrap: {
    position: 'absolute',
    bottom: 0,
    height: 64,
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingLeft: 17,
    paddingRight: 17,
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    width: 113,
    height: 40,
    backgroundColor: '#FA4B97',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text2: {
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
  },
  text3: {
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
  },
});

type props = {
  phoneList: Array,
  navigation: Object,
};
class UserList extends React.Component<props> {
  static navigationOptions = () => ({
    title: '请选择发送用户',
  });

  state = {
    list: [],
    num: 0,
  };

  curPage = 0;

  constructor(props) {
    super(props);
    this.navigation = props.navigation;
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getMemberManageContactsList();
    });
  }

  getMemberManageContactsList = () => {
    this.type = this.navigation.getParam('type', '');
    this.total = this.navigation.getParam('total', '');
    const { phoneList } = this.props;
    const { list } = this.state;
    this.phoneListByType = phoneList[this.type];
    this.curPage += 1;
    memberManageContactsList({ type: this.type, curPage: this.curPage }).then(({ list: nextList }) => {
      list.forEach(item => {
        const data = this.phoneListByType.filter(item2 => item.mobile === item2.phone);
        if (data.length === 1) {
          item.selected = data[0].selected;
        } else {
          item.selected = false;
        }
      });

      this.setState({
        list: [...list, ...nextList],
        num: list.filter(item => item.selected).length,
      });
    });
  };

  selectPhones = [];

  onSelect = index => {
    const { list } = this.state;
    const { phoneList } = this.props;
    const newList = [...list];
    const phones = [];
    Object.keys(phoneList).forEach(key => {
      const itemList = phoneList[key];
      if (itemList.length > 0) {
        itemList.forEach(item => {
          if (item.selected) {
            phones.push(item.phone);
          }
        });
      }
    });
    if (_.uniq(phones).length > this.total && !newList[index].selected) {
      Toast.show('选择已达到上限！');
      return;
    }
    newList[index].selected = !newList[index].selected;

    let flag = false;
    const newData = this.phoneListByType.map(item => {
      if (item.phone === newList[index].mobile) {
        flag = true;
        item.selected = newList[index].selected;
      }
      return item;
    });
    if (!flag) {
      this.selectPhones.push({
        phone: newList[index].mobile,
        selected: newList[index].selected,
      });
    }
    store.dispatch(setPhones([...newData, ...this.selectPhones], this.type));
    this.setState({
      num: newList.filter(item => item.selected).length,
      list: newList,
    });
  };

  render() {
    const { list, num } = this.state;
    const shadowOpt = {
      width: Layout.window.width,
      height: 64,
      color: '#000',
      border: 12,
      radius: 4,
      opacity: 0.04,
      x: -0,
      y: -2,
      style: {
        marginBottom: 2,
        marginLeft: 0,
        marginRight: 0,
      },
    };
    return (
      <View style={styles.containerWrap}>
        <FlatList
          data={list}
          onEndReachedThreshold={0.1}
          onEndReached={this.getMemberManageContactsList}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => (
            <View style={styles.item} keyExtractor={index}>
              <TouchableOpacity style={{ paddingLeft: 17, paddingRight: 16 }} onPress={() => this.onSelect(index)}>
                {item.selected ? <Image style={styles.selected} source={require('@assets/ConfirmOrder/selected.png')} /> : <View style={styles.notSelect} />}
              </TouchableOpacity>
              <View style={styles.con}>
                <Image style={styles.avatar} source={{ uri: item.headImg }} />
                <Text style={styles.text1}>{item.nickname}</Text>
              </View>
            </View>
          )}
        />
        <BoxShadow setting={shadowOpt}>
          <View style={styles.footerWrap}>
            <Text style={styles.text2}>已选择：{num}人</Text>
            <TouchableOpacity style={styles.btn} onPress={() => this.navigation.goBack()}>
              <Text style={styles.text3}>确定</Text>
            </TouchableOpacity>
          </View>
        </BoxShadow>
      </View>
    );
  }
}

export default connect(state => ({
  phoneList: state.phoneList,
}))(UserList);
