import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Switch from 'react-native-switch-pro';
import RNAlibcSdk from 'react-native-alibc-sdk';
import Toast from 'react-native-root-toast';
import { refreshUserInfo, appErrorLog } from '../../services/api';
import store from '../../store/configureStore';
import fixedBtn from '../../actions/fixedBtn';
import { ids } from '../../utils/ids';

export default class Information extends Component {
  static navigationOptions = {
    title: '个人信息',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  };

  state = {
    userInfo: {},
    isAuth: false,
  };

  async componentDidMount() {
    this.refreshUserInfo();
    RNAlibcSdk.isLogin((err, isLogin) => {
      this.setState({
        isAuth: isLogin,
      });
    });
  }

  async getTaoBaoNick() {
    const { taobaoUserId, tbOAuthUrl } =
      (await storage
        .load({
          key: 'userInfo',
        })
        .catch(e => e)) || {};
    if (!taobaoUserId) {
      this.props.navigation.navigate('WebView', {
        src: tbOAuthUrl,
        refresh: () => {
          this.init();
        },
      });
    }
  }

  // 业务逻辑
  refreshUserInfo = async () => {
    console.log('usderinfo====');
    const res = await refreshUserInfo();
    if (res) {
      if (res.roleId != 0) {
        this.setState({
          vipType: 1,
        });
      }
      const checkId = ids.filter(id => id === parseInt(res.userId));

      this.setState({ userInfo: res, isShowCutIcon: checkId.length > 0 });
    }
  };

  logOut = async () => {
    store.dispatch(fixedBtn({ isShow: false }));
    await storage.remove({
      key: 'token',
    });
    await storage.remove({
      key: 'shareImgs',
    });
    await storage.remove({
      key: 'tbAuth',
    });
    await storage.remove({
      key: 'userInfo',
    });
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'MainPage' })],
    });
    this.props.navigation.dispatch(resetAction);
  };

  _keyExtractor = (item, index) => `${index}`;

  changeTagQuan = () => {
    const { isAuth } = this.state;
    if (!isAuth) {
      RNAlibcSdk.login(err => {
        if (!err) {
          this.setState({
            isAuth: true,
          });
          Toast.show('授权成功！');
        } else {
          this.setState({
            isAuth: false,
          });
          if (err.code === 1004) {
            Toast.show('授权已取消！');
          } else {
            appErrorLog(err);
            Toast.show('授权失败，请稍后重试！');
          }
        }
      });
    } else {
      RNAlibcSdk.logout(err => {
        Toast.show('授权已取消！');
        this.setState({
          isAuth: false,
        });
      });
    }
  };

  render() {
    const { userInfo, isAuth, customIconStatus, isShowCutIcon } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.wrap}>
          <Text style={styles.wrapText}>头像</Text>
          <Image style={styles.wrapImg} source={{ uri: userInfo.headimgurl }} />
        </View>
        <View style={styles.wrap}>
          <Text style={styles.wrapText}>名字</Text>
          <Text style={styles.wrapText}>{userInfo.nickname}</Text>
        </View>
        <View style={styles.wrap}>
          <Text style={styles.wrapText}>性别</Text>
          <Text style={styles.wrapText}>{userInfo.sexName}</Text>
        </View>
        {!isReview && (
          <View style={styles.wrap}>
            <Text style={styles.wrapText}>手机号</Text>
            <Text style={styles.wrapText}>{userInfo.mobile}</Text>
          </View>
        )}
        <View style={styles.wrap}>
          <Text style={styles.wrapText}>微信号</Text>
          <Text style={styles.wrapText}>{userInfo.weixinNum || '暂无'}</Text>
        </View>
        {/* <View style={[styles.wrap, styles.noBorder]}>
          <Text style={styles.wrapText}>淘宝昵称</Text>
          {
            userInfo.taobaoUserId ? <Text style={styles.wrapText}>{userInfo.taobaoUserNick}</Text>
             : <Text style={styles.wrapText} onPress={()=> this.getTaoBaoNick}>暂未授权</Text>
          }

        </View> */}
        <View style={[styles.wrap, styles.noBorder]}>
          <Text style={styles.wrapText}>淘宝授权</Text>
          <Switch
            width={42}
            height={26}
            backgroundActive="#ff4d8a"
            value={isAuth}
            onAsyncPress={e => {
              this.changeTagQuan(e);
            }}
          />
        </View>
        <TouchableOpacity onPress={() => this.logOut()}>
          <Text style={styles.outBtn}>退出登录</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  wrap: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 16,
    height: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: '#efefef',
    alignItems: 'center',
  },
  wrapText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  wrapImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  outBtn: {
    width: '100%',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#EA4457',
    backgroundColor: '#fff',
    marginTop: 24,
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
  },
});
