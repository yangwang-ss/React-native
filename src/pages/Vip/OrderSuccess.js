import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, Clipboard, TouchableOpacity, StatusBar, TextInput, Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-root-toast';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { NavigationEvents } from 'react-navigation';
import Layout from '../../constants/Layout';
import {
  orderConfirmData,
  vipOrderConfirm,
  getWechatCode,
} from '../../services/api';

export default class OrderConfirm extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '确认订单',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerLeft: <View style={styles.headerLeft}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          paddingRight: 11, height: 40, width: 40, justifyContent: 'center',
        }}
        onPress={() => {
          navigation.navigate('VipIndex');
        }}
      >
        <EvilIcons name="chevron-left" size={40} color="#666" />
      </TouchableOpacity>
    </View>,
    headerRight: React.createElement(View, null, null),
  });

  state = {
    copyText: '',
  }

  /**
   * 事件绑定
   */
  onPressCopyText = async () => {
    Clipboard.setString(this.state.copyText);
    const str = await Clipboard.getString();
    if (str) {
      storage.save({
        key: 'searchText',
        data: { searchText: str },
      });
      Toast.show('复制成功');
    }
    console.log('onPressCopyText===', str);
  }

  onPressBackHome = () => {
    this.props.navigation.navigate('Home');
  }

  onPressVipIndex = () => {
    this.props.navigation.navigate('VipIndex');
  }


  /**
   * 接口请求
   */
  async getWechatCode() {
    const { pid } = this.state;
    const res = await getWechatCode(pid);
    console.log('getWechatCode===', res);
    if (res) {
      this.setState({
        copyText: res,
      });
    }
  }


  /**
   * 初始化
   */
  init = () => {
    const pid = this.props.navigation.getParam('pid', '');
    console.log('pid===', pid);
    this.setState({ pid }, () => {
      this.getWechatCode();
    });
  }

  componentDidMount() {
    this.init();
  }

  render() {
    const {
      paySuccess, addressInfo, orderPrdInfo,
      isSelected, copyText,
    } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        {
          <View style={styles.paySuccessWrap}>
            <View style={styles.paySuccessTop}>
              <Image style={styles.paySuccessIcon} source={require('../../../assets/vip/order-icon-success.png')} />
              <Text style={styles.paySuccessTitle}>支付成功</Text>
              <View style={styles.btnJumpWrap}>
                <TouchableOpacity style={styles.btnBackHome} activeOpacity={Layout.activeOpacity} onPress={this.onPressBackHome}>
                  <Text style={styles.btnBackHomeText}>返回首页</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnCheckOrder} activeOpacity={Layout.activeOpacity} onPress={this.onPressVipIndex}>
                  <Text style={styles.btnCheckOrderText}>查看权益</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.addWechat}>
              <View style={styles.addWechatTitleWrap}>
                <Image style={styles.titleIconLeft} source={require('../../../assets/vip/order-line-left.png')} />
                <Text style={styles.addWechatTitle}>添加我的专属客服</Text>
                <Image style={styles.titleIconRight} source={require('../../../assets/vip/order-line-right.png')} />
              </View>
              <Text style={styles.addWechatText1}>免费获得更多专享活动</Text>
              <Image style={styles.iconWechat} source={require('../../../assets/icon-weChat.png')} />
              <Text style={styles.addWechatText2}>微信号</Text>
              <Text style={styles.addWechatText3}>{copyText}</Text>
              <TouchableOpacity style={styles.btnCopyWechat} activeOpacity={Layout.activeOpacity} onPress={this.onPressCopyText}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={['#DAB77B', '#ECD3A0']}
                  style={styles.btnCopy}
                >
                  <Text style={styles.btnCopyWechatText}>复制微信号</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.addWechatText4}>打开微信-粘贴微信号-添加好友</Text>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
    overflow: 'hidden',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paySuccessWrap: {
    flex: 1,
    backgroundColor: '#fff',
  },
  paySuccessTop: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 8,
    borderBottomColor: '#f4f4f4',
  },
  paySuccessIcon: {
    width: 60,
    height: 60,
    marginTop: 50,
    marginBottom: 14,
  },
  paySuccessTitle: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 18,
    color: '#C1A16A',
  },
  addWechat: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addWechatTitleWrap: {
    marginTop: 24,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIconLeft: {
    width: 60,
    height: 15,
    resizeMode: 'contain',
  },
  titleIconRight: {
    width: 60,
    height: 15,
    resizeMode: 'contain',
  },
  addWechatTitle: {
    marginLeft: 12,
    marginRight: 12,
    fontFamily: 'PingFangSC-Medium',
    fontSize: 16,
    color: '#333',
  },
  addWechatText1: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
  },
  addWechatText2: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addWechatText3: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#151515',
  },
  addWechatText4: {
    marginTop: 40,
    width: Layout.window.width,
    textAlign: 'center',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
  },
  iconWechat: {
    marginTop: 24,
    marginBottom: 8,
    width: 48,
    height: 48,
  },
  btnCopyWechat: {
    marginTop: 20,
    width: 200,
    height: 48,
    backgroundColor: '#ECD3A0',
    borderRadius: 24,
  },
  btnCopy: {
    borderRadius: 24,
  },
  btnCopyWechatText: {
    textAlign: 'center',
    lineHeight: 48,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#8B572A',
  },
  btnJumpWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  btnBackHome: {
    width: 80,
    height: 30,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
  },
  btnBackHomeText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#666',
  },
  btnCheckOrder: {
    width: 80,
    height: 30,
    borderWidth: 0.5,
    borderColor: '#C1A16A',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCheckOrderText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#C1A16A',
  },
  remark: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingRight: 16,
    // paddingTop: 6,
    // paddingBottom: 6
  },
  remarkLabel: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  markInput: {
    width: '86%',
    height: 22,
    padding: 0,
    color: '#999',
    fontSize: 14,
    lineHeight: 22,
  },
});
