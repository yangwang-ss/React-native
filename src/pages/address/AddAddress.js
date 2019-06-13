/* eslint-disable react/no-string-refs */
/* eslint-disable no-use-before-define */
import React, { Component } from 'react';
import { Platform, StyleSheet, FlatList, Text, View, Image, TextInput, TouchableOpacity, Keyboard, InteractionManager } from 'react-native';
import Toast from 'react-native-root-toast';
import { SafeAreaView } from 'react-navigation';
import Layout from '../../constants/Layout';
import { addressData } from '../../services/api';

export default class OrderConfirm extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.distribution === 0 ? '添加取货人' : '添加地址',
  });

  state = {
    pickShow: false,
    province: { name: '' },
    city: { name: '' },
    area: { name: '' },
    originAddress: [],
    AddressDataList: [],
    addressInfo: {
      addressId: '',
      userName: '',
      phoneNum: '',
      province: { name: '' },
      city: { name: '' },
      area: { name: '' },
      addressDetaill: '',
    },
    distribution: '',
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.init();
    });
  }

  /**
   * 列表渲染
   */
  regionItem = info => {
    const { item, index } = info;
    return (
      <TouchableOpacity
        key={index}
        style={styles.btnSelectRegion}
        activeOpacity={Layout.activeOpacity}
        onPress={() => {
          this.onPressSelectRegion(item);
        }}
      >
        <Text style={styles.btnSelectRegionText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  /**
   * 事件绑定
   */
  onPressSelectAddress = () => {
    this.onPressHideInput();
    this.setState({
      pickShow: true,
    });
  };

  canDo = true;

  onPressSaveAddress = async () => {
    if (this.canDo) {
      this.canDo = false;
      setTimeout(() => {
        this.canDo = true;
      }, 2000);
      const { addressInfo, province, city, area, distribution } = this.state;
      const { navigation } = this.props;
      addressInfo.regionText = `${province.name} ${city.name} ${area.name}`;
      if (!addressInfo.userName) {
        Toast.show('请填写收货人！');
        return false;
      }
      if (!addressInfo.phoneNum) {
        Toast.show('请填写手机号码！');
        return false;
      }
      const reg = /^1\d{10}$/;
      if (!reg.test(addressInfo.phoneNum)) {
        Toast.show('请输入正确的手机号', { position: 0 });
        return false;
      }
      if (distribution === 1) {
        if (!addressInfo.province.name) {
          Toast.show('请选择收货地区！');
          return false;
        }
        if (!addressInfo.addressDetaill) {
          Toast.show('请填写详细地址！');
          return false;
        }
      }
      storage.save({
        id: distribution,
        key: 'addressInfo',
        data: addressInfo,
      });
      navigation.goBack();
    }
  };

  onPressHideMask = () => {
    const { province, city, area } = this.state;
    console.log('onPressHideMask====', province, city, area);
    const hasArea = area && area.list && area.list.length;
    if (hasArea && area.name == '请选择') {
      Toast.show('请选择所在地区！');
      return;
    }
    if (province.name != '请选择' && city.name != '请选择') {
      this.setAddressId();
      this.setState({
        pickShow: false,
      });
    } else {
      Toast.show('请选择完整省市区！');
    }
  };

  onPressSelectRegion = item => {
    const { id, name, children, grade } = item;
    let { province, city, area, addressInfo } = this.state;
    const setRegionArr = () => {
      switch (grade) {
        case 0:
          province = { id, name, grade };
          if (children && children.length) {
            city = { name: '请选择', list: children };
            area = { name: '' };
          }
          break;
        case 1:
          city = {
            ...city,
            id,
            name,
            grade,
          };
          if (children && children.length) {
            area = { name: '请选择', list: children };
          } else {
            area = { name: '', list: children };
          }
          break;
        case 2:
          area = {
            ...area,
            id,
            name,
            grade,
          };
          break;
        default:
          break;
      }
      addressInfo = {
        ...addressInfo,
        province,
        city,
        area,
      };
      this.setState(
        {
          province,
          city,
          area,
          addressInfo,
        },
        () => {
          if (grade === 1 || grade === 0) {
            if (!(children && children.length)) {
              this.setAddressId();
              this.setState({
                pickShow: false,
              });
            }
          } else if (grade === 2) {
            this.setAddressId();
            this.setState({
              pickShow: false,
            });
          }
        }
      );
    };
    if (children && children.length) {
      setRegionArr();
      this.setState({
        AddressDataList: children,
      });
    } else {
      setRegionArr();
    }
  };

  onPressRegionBack = item => {
    const { id, grade, list } = item;
    let { province, city, area } = this.state;
    setRegionList = array => {
      if (array && array.length) {
        this.setState({
          AddressDataList: array,
        });
      }
    };
    switch (grade) {
      case 0:
        setRegionList(this.state.originAddress);
        province = { id, name: '请选择', grade };
        city = { name: '', list: city.list };
        area = { name: '' };
        break;
      case 1:
        city = {
          ...city,
          id,
          name: '请选择',
          grade,
        };
        area = { name: '', list: area.list };
      case 2:
        setRegionList(list);
        break;
    }
    this.setState({ province, city, area });
  };

  onPressHideInput = () => {
    this.refs.textInput1.blur();
    this.refs.textInput2.blur();
    if (this.refs.textInput3) {
      this.refs.textInput3.blur();
    }
  };

  /**
   * 功能函数
   */
  setAddressInfo = (type, data) => {
    const { addressInfo } = this.state;
    const info = {};
    info[type] = data;
    this.setState({
      addressInfo: { ...addressInfo, ...info },
    });
  };

  setAddressId = () => {
    const { addressInfo, province, city, area } = this.state;
    this.setState({
      addressInfo: {
        ...addressInfo,
        addressId: {
          provinceId: province.id,
          cityId: city.id || '',
          areaId: area.id || '',
        },
      },
    });
  };

  /**
   * 接口请求
   */
  async addressData() {
    const { orderId } = this.state;
    const res = await addressData(orderId);
    console.log('addressData===', res);
    if (res && res.length) {
      this.setState({ originAddress: res, AddressDataList: res });
    }
  }

  /**
   * 初始化
   */
  init = async () => {
    const distribution = this.props.navigation.getParam('distribution');
    const addressInfo =
      (await storage
        .load({
          id: distribution,
          key: 'addressInfo',
        })
        .catch(e => e)) || {};
    if (addressInfo && addressInfo.userName) {
      this.setState({
        addressInfo,
        province: addressInfo.province,
        city: addressInfo.city,
        area: addressInfo.area,
      });
    }
    this.setState({
      distribution,
    });
    this.addressData();
  };

  render() {
    const { addressInfo, AddressDataList, province, city, area, pickShow, distribution } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.addressWrap} activeOpacity={1} onPress={this.onPressHideInput}>
          <View style={styles.inputWrap}>
            <Text style={styles.title}>{distribution === 0 ? '取货人' : '收货人'}</Text>
            <TextInput
              style={styles.inputItem}
              underlineColorAndroid="transparent"
              onChangeText={userName => this.setAddressInfo('userName', userName)}
              defaultValue={addressInfo.userName}
              placeholder={distribution === 0 ? '取货人' : '收货人'}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              maxLength={10}
              ref="textInput1"
              placeholderTextColor="#999"
              autoFocus={!addressInfo.userName}
            />
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.title}>联系方式</Text>
            <TextInput
              style={styles.inputItem}
              defaultValue={addressInfo.phoneNum}
              underlineColorAndroid="transparent"
              onChangeText={phoneNum => this.setAddressInfo('phoneNum', phoneNum)}
              placeholder="手机号码"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              ref="textInput2"
              maxLength={11}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
          {distribution === 1 && (
            <TouchableOpacity style={styles.btnRegionWrap} activeOpacity={Layout.activeOpacity} onPress={this.onPressSelectAddress}>
              <Text style={styles.title}>收货地址</Text>
              {province.name ? (
                <View style={styles.btnRegion}>
                  <View style={styles.btnRegionText}>
                    <Text style={styles.regionTextActive}>{province.name}</Text>
                    <Text style={styles.regionTextActive}>{city.name}</Text>
                    <Text style={styles.regionTextActive}>{area.name}</Text>
                  </View>
                  <Image style={styles.iconArrow} source={require('../../../assets/vip/icon-arrow.png')} />
                </View>
              ) : (
                <View style={styles.btnRegion}>
                  <Text style={styles.regionText}>所在地区</Text>
                  <Image style={styles.iconArrow} source={require('../../../assets/vip/icon-arrow.png')} />
                </View>
              )}
            </TouchableOpacity>
          )}
          {distribution === 1 && (
            <View style={[styles.inputWrap, { height: 80 }]}>
              <Text style={styles.title}>详细地址 </Text>
              <TextInput
                style={[styles.inputItem, styles.fixedAndroid, { lineHeight: 24 }]}
                underlineColorAndroid="transparent"
                onChangeText={addressDetaill => this.setAddressInfo('addressDetaill', addressDetaill)}
                placeholder="如道路、门牌号、小区、楼栋号、单元、室等"
                placeholderTextColor="#999"
                multiline
                ref="textInput3"
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                numberOfLines={2}
                maxLength={140}
                defaultValue={addressInfo.addressDetaill}
              />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.btnSaveAddressWrap}>
          <TouchableOpacity style={styles.btnSaveAddress} activeOpacity={Layout.activeOpacity} onPress={this.onPressSaveAddress}>
            <Text style={styles.btnSaveAddressText}>保存</Text>
          </TouchableOpacity>
        </View>
        {pickShow && (
          <View style={styles.addressRegion}>
            <View style={styles.selectRegion}>
              {province.name ? (
                <View style={styles.regionArrTextWrap}>
                  <TouchableOpacity
                    style={styles.btnSelectregionArrText}
                    activeOpacity={Layout.activeOpacity}
                    onPress={() => {
                      this.onPressRegionBack(province);
                    }}
                  >
                    <Text style={styles.regionArrText}>{province.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnSelectregionArrText}
                    activeOpacity={Layout.activeOpacity}
                    onPress={() => {
                      this.onPressRegionBack(city);
                    }}
                  >
                    <Text style={styles.regionArrText}>{city.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnSelectregionArrText}
                    activeOpacity={Layout.activeOpacity}
                    onPress={() => {
                      this.onPressRegionBack(area);
                    }}
                  >
                    <Text style={styles.regionArrText}>{area.name}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.regionDefault}>
                  <Text style={styles.regionDefaultText}>选择省市区</Text>
                </View>
              )}
            </View>
            <FlatList style={styles.originAddressWrap} data={AddressDataList} keyExtractor={(item, index) => (item + index).toString()} renderItem={this.regionItem} />
          </View>
        )}
        {pickShow ? <Text style={styles.mask} onPress={this.onPressHideMask} /> : <Text />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  addressWrap: {
    backgroundColor: '#fff',
  },
  inputWrap: {
    paddingLeft: 16,
    paddingBottom: 12,
    paddingTop: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: '#333',
    width: 70,
    marginRight: 14,
  },
  inputItem: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    padding: 0,
    flex: 1,
  },
  fixedAndroidd: {
    ...Platform.select({
      ios: {
        height: 64,
      },
      android: {
        height: 64,
        textAlignVertical: 'top',
      },
    }),
  },
  btnRegionWrap: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    paddingLeft: 16,
    paddingBottom: 12,
    paddingTop: 12,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnRegionText: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  btnRegion: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regionText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#999',
  },
  regionTextActive: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  iconArrow: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  btnSaveAddressWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  btnSaveAddress: {
    width: 343,
    height: 48,
    backgroundColor: '#FC4277',
    borderRadius: 24,
  },
  btnSaveAddressText: {
    textAlign: 'center',
    lineHeight: 48,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#fff',
  },
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Layout.window.width,
    height: Layout.window.height,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  addressRegion: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 9,
    width: Layout.window.width,
    height: Layout.window.height - 310,
    backgroundColor: '#fff',
  },
  selectRegion: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 3,
    width: Layout.window.width,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#333',
  },
  btnSelectAddress: {
    width: 60,
    height: 30,
    borderColor: '#ea4457',
    borderWidth: 0.5,
    borderRadius: 24,
  },
  btnSelectAddressText: {
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#ea4457',
  },
  btnSelectregionArrText: {
    paddingBottom: 5,
    borderBottomColor: '#ea4457',
    borderBottomWidth: 2,
    marginRight: 10,
  },
  regionArrTextWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  regionArrText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#ea4457',
    textAlign: 'center',
  },
  btnSelectRegion: {
    borderBottomColor: '#eee',
    borderBottomWidth: 0.5,
  },
  btnSelectRegionText: {
    padding: 12,
    paddingLeft: 16,
    color: '#333',
  },
  originAddressWrap: {
    flex: 1,
    marginTop: 60,
  },
  regionDefault: {
    paddingBottom: 5,
    borderBottomColor: '#333',
    borderBottomWidth: 2,
  },
  regionDefaultText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
  },
});
