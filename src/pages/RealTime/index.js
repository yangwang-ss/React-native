import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import { memberManageContacts, memberManageContactsAll, sendMobileSize } from '@api';
import SendSMS from 'react-native-sms';
import _ from 'lodash';
import { NavigationEvents } from 'react-navigation';

import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import { setPhones, clearPhones } from '../../actions/phoneList';
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
    height: 48,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  con: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e4e4e4',
    height: '100%',
    paddingRight: 17,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text1: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333',
  },
  text2: {
    fontFamily: 'PingFangSC-Regular',
  },
  footerWrap: {
    position: 'absolute',
    bottom: 20,
    height: 40,
    flexDirection: 'row',
    paddingLeft: 17,
    paddingRight: 17,
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    paddingLeft: 10,
    paddingRight: 10,
    height: '100%',
    backgroundColor: '#FA4B97',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text4: {
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
};
class Index extends React.Component<props> {
  static navigationOptions = () => ({
    title: '请选择发送用户',
  });

  // 1 复购 2首购 3 未购 4 今日登录
  typeMap = {
    1: 'repeatUsers',
    4: 'todayLoginUsers',
    2: 'firstUsers',
    3: 'noBuyUsers',
  };

  constructor(props) {
    super(props);
    // 事件防抖 避免多次点击多次跳转
    this.sendSMS = _.debounce(this.sendSMS, 200);
  }

  state = {
    todayLoginUsers: {
      num: 0,
      apiRequested: false,
    },
    repeatUsers: {
      num: 0,
      apiRequested: false,
    },
    firstUsers: {
      num: 0,
      apiRequested: false,
    },
    noBuyUsers: {
      num: 0,
      apiRequested: false,
    },
    total: 0,
    selectedNum: 0,
  };

  componentDidMount() {
    store.dispatch(clearPhones());
    memberManageContacts().then(res => {
      const { todayLoginUsers: todayLoginUsersNum, repeatUsers: repeatUsersNum, firstUsers: firstUsersNum, noBuyUsers: noBuyUsersNum } = res;
      const { todayLoginUsers, repeatUsers, firstUsers, noBuyUsers } = this.state;

      this.setState({
        todayLoginUsers: {
          ...todayLoginUsers,
          num: todayLoginUsersNum,
        },
        repeatUsers: {
          ...repeatUsers,
          num: repeatUsersNum,
        },
        firstUsers: {
          ...firstUsers,
          num: firstUsersNum,
        },
        noBuyUsers: {
          ...noBuyUsers,
          num: noBuyUsersNum,
        },
      });
    });

    sendMobileSize().then(({ size: total }) => {
      this.setState({
        total,
      });
    });
  }

  onSelect = async (type, name) => {
    this.type = type;
    const data = this.state[name];
    if (data.num > 0) {
      if (!data.apiRequested) {
        await this.getMemberManageContactsAll(type);
        const obj = {};
        obj[this.typeMap[type]] = {
          ...data,
          apiRequested: true,
        };
        this.setState({
          ...obj,
        });
      } else {
        this.updateState();
      }
      this.calculateNum();
    }
  };

  updateState = () => {
    const { phoneList } = this.props;
    const phoneListByType = phoneList[this.type];
    if (phoneListByType.filter(item => item.selected).length > 0) {
      phoneListByType.forEach(item => {
        item.selected = false;
      });
    } else {
      phoneListByType.forEach(item => {
        item.selected = true;
      });
    }
    store.dispatch(setPhones(phoneListByType, this.type));
  };

  calculateNum = () => {
    const { phoneList } = this.props;
    const selectedPhones = [];
    for (const type in phoneList) {
      selectedPhones.push(...phoneList[type].filter(item => item.selected));
    }
    this.setState({
      selectedNum: _.uniqBy(selectedPhones, 'phone').length,
    });
  };

  toUserList = type => {
    const { total } = this.state;
    this.props.navigation.push('RealTimeUserList', {
      type,
      total,
    });
  };

  sendSMS = () => {
    const { phoneList } = this.props;
    const { total } = this.state;
    const phones = [];
    Object.keys(phoneList).forEach(key => {
      const itemList = phoneList[key];
      if (itemList.length > 0) {
        itemList.forEach(item => {
          if (phones.length < total && item.selected) {
            phones.push(item.phone);
          }
        });
      }
    });
    if (phones.length < 1) {
      Toast.show('至少选择一个手机号！');
      return;
    }
    SendSMS.send(
      {
        body: '',
        recipients: phones,
        successTypes: ['sent', 'queued'],
        allowAndroidSendWithoutReadPermission: true,
      },
      (completed, cancelled, error) => {
        console.log(`SMS Callback: completed: ${completed} cancelled: ${cancelled}error: ${error}`);
      }
    );
  };

  getMemberManageContactsAll = type => {
    return new Promise(resolve => {
      memberManageContactsAll(type).then(async ({ list }) => {
        const data = this.state[this.typeMap[type]];
        const obj = {};
        obj[this.typeMap[type]] = { ...data, phoneList: list };
        this.setState({
          ...obj,
        });
        const { phoneList } = this.props;
        await store.dispatch(
          setPhones(
            list.map(phone => {
              return {
                phone,
                selected: phoneList[type].length < 1,
              };
            }),
            type
          )
        );
        resolve(true);
      });
    });
  };

  render() {
    const { todayLoginUsers, repeatUsers, firstUsers, noBuyUsers, total, selectedNum } = this.state;
    const { phoneList } = this.props;
    return (
      <View style={styles.containerWrap}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.item}>
          <TouchableOpacity style={{ paddingLeft: 17, paddingRight: 16 }} onPress={() => this.onSelect(4, 'todayLoginUsers')}>
            {phoneList[4].filter(item => item.selected).length > 0 ? <Image style={styles.selected} source={require('@assets/ConfirmOrder/selected.png')} /> : <View style={styles.notSelect} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.con} onPress={() => this.toUserList(4)}>
            <Text style={styles.text1}>今日登录用户</Text>
            <View style={styles.itemRight}>
              <Text style={[styles.text1, styles.text2]}>{todayLoginUsers.num}</Text>
              <Image style={styles.rightArrow} source={require('@assets/icon-right-arrow2.png')} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <TouchableOpacity style={{ paddingLeft: 17, paddingRight: 16 }} onPress={() => this.onSelect(1, 'repeatUsers')}>
            {phoneList[1].filter(item => item.selected).length > 0 ? <Image style={styles.selected} source={require('@assets/ConfirmOrder/selected.png')} /> : <View style={styles.notSelect} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.con} onPress={() => this.toUserList(1)}>
            <Text style={styles.text1}>复购用户</Text>
            <View style={styles.itemRight}>
              <Text style={[styles.text1, styles.text2]}>{repeatUsers.num}</Text>
              <Image style={styles.rightArrow} source={require('@assets/icon-right-arrow2.png')} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <TouchableOpacity style={{ paddingLeft: 17, paddingRight: 16 }} onPress={() => this.onSelect(2, 'firstUsers')}>
            {phoneList[2].filter(item => item.selected).length > 0 ? <Image style={styles.selected} source={require('@assets/ConfirmOrder/selected.png')} /> : <View style={styles.notSelect} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.con} onPress={() => this.toUserList(2)}>
            <Text style={styles.text1}>首购用户</Text>
            <View style={styles.itemRight}>
              <Text style={[styles.text1, styles.text2]}>{firstUsers.num}</Text>
              <Image style={styles.rightArrow} source={require('@assets/icon-right-arrow2.png')} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <TouchableOpacity style={{ paddingLeft: 17, paddingRight: 16 }} onPress={() => this.onSelect(3, 'noBuyUsers')}>
            {phoneList[3].filter(item => item.selected).length > 0 ? <Image style={styles.selected} source={require('@assets/ConfirmOrder/selected.png')} /> : <View style={styles.notSelect} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.con} onPress={() => this.toUserList(3)}>
            <Text style={styles.text1}>未购买用户</Text>
            <View style={styles.itemRight}>
              <Text style={[styles.text1, styles.text2]}>{noBuyUsers.num}</Text>
              <Image style={styles.rightArrow} source={require('@assets/icon-right-arrow2.png')} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.footerWrap}>
          <Text style={styles.text4}>已选择：{selectedNum > total ? total : selectedNum}人</Text>
          <TouchableOpacity style={styles.btn} onPress={this.sendSMS}>
            <Text style={styles.text3}>
              确定（{selectedNum > total ? total : selectedNum}/{total}）
            </Text>
          </TouchableOpacity>
        </View>
        <NavigationEvents onDidFocus={() => this.calculateNum()} />
      </View>
    );
  }
}
export default connect(state => ({
  phoneList: state.phoneList,
}))(Index);
