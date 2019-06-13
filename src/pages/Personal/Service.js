import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Clipboard, Platform, PermissionsAndroid,
} from 'react-native';
import Toast from 'react-native-root-toast';
import store from '../../store/configureStore';
import common from '../../actions/common';
import saveFile from '../../utils/saveFile';

export default class Service extends Component {
  static navigationOptions = {
    title: '专属客服',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  }

  state = {
    vipType: 0,
    canDo: true,
  }

  componentDidMount() {
    const vipType = this.props.navigation.getParam('vipType', '');
    console.log('=======', vipType);
    this.setState({
      vipType,
    });
  }

  openGodModel() {
    Toast.show(this.num);
    if (this.num === 10) {
      store.dispatch(common(true));
      this.num = 1;
    }
    this.num += 1;
  }

  // 保存图片
  DownloadImage=async (uri) => {
    const { canDo } = this.state;
    if (canDo) {
      this.setState({
        canDo: false,
      });
      const res = await saveFile({ fileType: 'url', file: uri, location: 'album' });
      if (res) {
        Toast.show('图片保存成功');
        this.setState({
          showFullPic: false,
          canDo: true,
        });
      } else {
        Toast.show('请开启手机权限');
        this.setState({
          showFullPic: false,
          canDo: true,
        });
      }
    }
  }

  copy(text) {
    Clipboard.setString(text);
    storage.save({
      key: 'searchText',
      data: { searchText: text },
    });
    this.showToast('复制成功');
  }

  showToast(str) {
    Toast.show(str, {
      duration: 2000,
      position: 0,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        {
          this.state.vipType == 0
            ? this.renderNormal()
            : this.renderVip()
        }
      </View>
    );
  }

  renderNormal() {
    return (
      <View>
        <Text style={styles.text1}>
关注公众号
          <Text style={styles.text2}>“米粒生活Family”，</Text>
获取更多优惠信息!
        </Text>
        <View style={styles.copyWrap}>
          <View style={styles.copyTypeWrap}>
            <Text style={styles.copyType}>方式一</Text>
          </View>
          <View>
            <Text style={styles.copyInfo}>复制名称-打开微信搜索-粘贴-关注公众号。</Text>
            <View style={styles.copyName}>
              <Text style={styles.copyInfo}>公众号名称：米粒生活Family</Text>
              <TouchableOpacity style={styles.copyBtnWrap} onPress={() => this.copy('米粒生活Family')}>
                <Text style={styles.copyBtn}>复制</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.copyWrap}>
          <View style={styles.copyTypeWrap}>
            <Text style={styles.copyType}>方式二</Text>
          </View>
          <Text style={styles.copyInfo}>保存图片-打开微信扫一扫-关注公众号。</Text>
        </View>

        <View style={styles.qrCode}>
          <Image style={styles.img} source={{ uri: 'http://family-img.vxiaoke360.com/qr-code-common.png' }} />
          <TouchableOpacity style={styles.saveBtn} onPress={() => this.DownloadImage('http://family-img.vxiaoke360.com/qr-code-common.png')}>
            <Text style={styles.saveText}>点击保存图片</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderVip() {
    return (
      <View>
        <Text style={styles.text1}>添加我的专属客服，免费获得更多专享活动！</Text>
        <View style={styles.copyWrap}>
          <View style={styles.copyTypeWrap}>
            <Text style={styles.copyType}>方式一</Text>
          </View>
          <View>
            <Text style={styles.copyInfo}>复制名称-打开微信搜索-粘贴-添加好友。</Text>
            <View style={styles.copyName}>
              <Text style={styles.copyInfo}>专属客服微信号：18157153034</Text>
              <TouchableOpacity style={styles.copyBtnWrap} onPress={() => this.copy('18157153034')}>
                <Text style={styles.copyBtn}>复制</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.copyWrap}>
          <View style={styles.copyTypeWrap}>
            <Text style={styles.copyType}>方式二</Text>
          </View>
          <Text style={styles.copyInfo}>保存图片-打开微信扫一扫-关注公众号。</Text>
        </View>

        <View style={styles.qrCode}>
          <Image style={styles.img} source={{ uri: 'http://family-img.vxiaoke360.com/qrcode-personal.png' }} />
          <TouchableOpacity style={styles.saveBtn} onPress={() => this.DownloadImage('http://family-img.vxiaoke360.com/qrcode-personal.png')}>
            <Text style={styles.saveText}>点击保存图片</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 22,
    paddingTop: 24,
  },
  text1: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  text2: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#FC4277',
    lineHeight: 22,
  },
  copyWrap: {
    flexDirection: 'row',
    marginTop: 16,
  },
  copyTypeWrap: {
    height: 22,
    paddingLeft: 6,
    paddingRight: 6,
    backgroundColor: 'rgba(252,66,119,0.10)',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 11,
  },
  copyType: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FC4277',
    lineHeight: 20,
  },
  copyInfo: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
  },
  copyName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyBtnWrap: {
    height: 22,
    borderColor: '#FC4277',
    borderWidth: 0.5,
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 11,
    marginLeft: 12,
  },
  copyBtn: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FC4277',
    lineHeight: 20,
  },
  qrCode: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  img: {
    width: 138,
    height: 138,
    borderWidth: 7,
    borderColor: '#F6F6F6',
  },
  saveBtn: {
    height: 48,
    paddingLeft: 48,
    paddingRight: 48,
    backgroundColor: '#FC4277',
    alignItems: 'center',
    borderRadius: 24,
    marginTop: 16,
  },
  saveText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
    color: '#fff',
    lineHeight: 48,
  },
});
