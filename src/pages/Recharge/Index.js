import React from 'react';
import {
  StyleSheet,
  Text, View, Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Layout from '../../constants/Layout';
import RechargeItem from '../../components/RechargeItem';
import LoadingText from '../../components/LoadingText';
import { getPrdByCategoryId } from '../../services/api';

export default class RechargeIndex extends React.Component {
  static navigationOptions = {
    title: '充值中心',
  };

  state = {
    type: 0,
    typeText: '移动',
    num: '10元',
    province: '北京',
    showPick: false,
    numList: [
      {
        num: '10元',
        checked: true,
      },
      {
        num: '20元',
        checked: false,
      },
      {
        num: '30元',
        checked: false,
      },
      {
        num: '50元',
        checked: false,
      },
      {
        num: '100元',
        checked: false,
      },
      {
        num: '200元',
        checked: false,
      },
      {
        num: '300元',
        checked: false,
      },
      {
        num: '500元',
        checked: false,
      },
      {
        num: '',
        checked: false,
      },
    ],
    provinceList: [
      '北京', '天津', '上海', '浙江省', '江苏省', '河北省', '山西省', '黑龙江省', '吉林省', '辽宁省',
      '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省', '陕西省',
      '四川省', '贵州省', '云南省', '重庆', '甘肃省', '青海省', '西藏自治区', '广西壮族自治区', '内蒙古自治区', '宁夏回族自治区', '新疆维吾尔自治区',
      '香港特别行政区', '澳门特别行政区', '台湾省',
    ],
  };


  /**
   * 事件绑定
   */
  jumpPage = (item) => {
    let str = '';
    const { province, typeText, num } = this.state;

    if (province.lastIndexOf('省')) {
      str = province.substring(0, province.lastIndexOf('省'));
    }

    console.log('4444444', `${typeText} ${num} ${str || province}`);
    this.props.navigation.navigate('RechargeList', { value: `${typeText} ${num} ${str || province}` });
  };

  pressType(id) {
    const arr = ['移动', '联通', '电信'];
    this.setState({
      type: id,
      typeText: arr[id],
    });
  }

  pressNum(index) {
    const arr = this.state.numList;
    arr.map((item) => {
      item.checked = false;
    });
    arr[index].checked = true;
    this.setState({
      numList: arr,
      num: arr[index].num,
    });
  }

  openPick() {
    this.setState({
      showPick: true,
    });
  }

  selectProvince(item) {
    console.log('555555', item);
    this.setState({
      province: item,
      showPick: false,
    });
  }


  componentDidMount() {
    // this.init();
  }

  renderList() {
    const { numList } = this.state;
    const arr = [];
    numList.map((item, index) => {
      arr.push(
        item.num
          ? (
            <TouchableOpacity key={index} style={[styles.numItem, item.checked ? styles.checked : '']} activeOpacity={0.85} onPress={() => this.pressNum(index)}>
              <Text style={[styles.numItemText, item.checked ? styles.textRed : '']}>{item.num}</Text>
            </TouchableOpacity>
          )
          : <TouchableOpacity key={index} style={[styles.numItem, styles.numItemEmpty]} />,
      );
    });
    return arr;
  }

  renderProvince(info) {
    return (
      <TouchableOpacity key={info.index} style={styles.pList} activeOpacity={0.85} onPress={() => this.selectProvince(info.item)}>
        <Text style={styles.pListText}>{info.item}</Text>
      </TouchableOpacity>
    );
  }

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const {
      type, num, provinceList, province, showPick,
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.headType}>
          <TouchableOpacity style={[styles.headItem, type == 0 ? styles.checked : '']} activeOpacity={0.85} onPress={() => this.pressType(0)}>
            <Text style={[styles.headItemText, type == 0 ? styles.textRed : '']}>移动</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headItem, styles.headSpe, type == 1 ? styles.checked : '']} activeOpacity={0.85} onPress={() => this.pressType(1)}>
            <Text style={[styles.headItemText, type == 1 ? styles.textRed : '']}>联通</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headItem, type == 2 ? styles.checked : '']} activeOpacity={0.85} onPress={() => this.pressType(2)}>
            <Text style={[styles.headItemText, type == 2 ? styles.textRed : '']}>电信</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.numWrap}>
          <Text style={styles.title}>充话费</Text>
          <View style={styles.contentWrap}>
            {this.renderList()}
          </View>
        </View>

        <TouchableOpacity style={styles.selectAddress} activeOpacity={0.85} onPress={() => this.openPick()}>
          <Text style={styles.selectInfo}>选择省份</Text>
          <View style={styles.selectRight}>
            <Text style={styles.selectInfo}>{province}</Text>
            <Image style={styles.iconRight} resizeMode="contain" source={require('../../../assets/icon-right-gray.png')} />
          </View>
        </TouchableOpacity>
        {
          showPick
            ? (
              <TouchableOpacity style={styles.bgWrap} onPress={() => this.setState({ showPick: false })}>
                <FlatList
                  style={styles.seleContent}
                  data={provinceList}
                  keyExtractor={this._keyExtractor}
                  renderItem={(item, index) => this.renderProvince(item)}
                />
              </TouchableOpacity>
            )
            : null
        }
        <View style={styles.btnWrap}>
          <TouchableOpacity style={styles.btns} activeOpacity={0.85} onPress={() => this.jumpPage()}>
            <Text style={styles.btnWrapText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  headType: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headItem: {
    width: 88,
    height: 36,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headSpe: {
    marginLeft: 16,
    marginRight: 16,
  },
  headItemText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#999',
  },
  textRed: {
    color: '#FC4277',
  },
  checked: {
    borderColor: '#FC4277',
    backgroundColor: ' rgba(252,66,119,0.10)',
  },
  numWrap: {
    marginTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 2,
    backgroundColor: '#fff',
  },
  contentWrap: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    paddingTop: 14,
    paddingBottom: 14,
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333',
  },
  numItem: {
    width: 108,
    height: 50,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numItemText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#333',
  },
  numItemEmpty: {
    borderWidth: 0,
  },
  selectAddress: {
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#fff',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  selectInfo: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
  },
  selectRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconRight: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  bgWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  seleContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
  },
  pList: {
    width: '100%',
    height: 45,
    borderBottomColor: '#DDD',
    borderBottomWidth: 0.5,
    paddingLeft: 16,
    paddingRight: 16,
  },
  pListText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    lineHeight: 45,
    color: '#999',
  },
  btnWrap: {
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 25,
  },
  btns: {
    width: '100%',
    height: 48,
    backgroundColor: '#FC4277',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWrapText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#fff',
  },

});
