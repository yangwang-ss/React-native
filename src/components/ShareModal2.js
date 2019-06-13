import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Clipboard } from 'react-native';
import Toast from 'react-native-root-toast';
import { BoxShadow } from 'react-native-shadow';
import Layout from '../constants/Layout';
import saveFile from '../utils/saveFile';
import { saveProShareCount } from '../services/api';

let loadingToast = '';
const shadowOpt = {
  width: Layout.window.width,
  height: 192,
  color: '#999',
  border: 8,
  radius: 0,
  opacity: 0.1,
  x: 8,
  y: 0,
  style: { marginLeft: 0, marginRight: 0 },
};
export default class ShareModal extends React.Component {
  canDo = true;

  saveShareCount = () => {
    const { shareParams } = this.props;
    if (shareParams.sharePage === 'ProductDetail') {
      saveProShareCount(shareParams.pid);
    }
  };

  shareWechat = () => {
    if (this.canDo) {
      this.canDo = false;
      setTimeout(() => {
        this.canDo = true;
      }, 2000);
      loadingToast = Toast.show('加载中...', {
        duration: 0,
        position: 0,
        hideOnPress: true,
      });
      const { shareImageUrl, shareTitle = '', shareText = '', shareTkl = '' } = this.props;
      const { WeChat } = global;
      WeChat.isWXAppInstalled()
        .then(isInstalled => {
          if (isInstalled) {
            setTimeout(() => {
              Toast.hide(loadingToast);
            }, 700);
            const isUrl = shareImageUrl.indexOf('://') > -1;
            if (shareTkl) {
              Clipboard.setString(shareTkl);
              storage.save({
                key: 'searchText',
                data: { searchText: shareTkl },
              });
            }
            WeChat.shareToSession({
              type: 'imageUrl',
              title: shareTitle,
              description: shareText,
              imageUrl: shareImageUrl,
            });
          } else {
            Toast.show('你还没有安装微信，请安装微信之后再试！');
          }
        })
        .catch(() => {
          setTimeout(() => {
            Toast.hide(loadingToast);
          }, 1000);
        });
    }
  };

  shareFriends = () => {
    if (this.canDo) {
      this.canDo = false;
      setTimeout(() => {
        this.canDo = true;
      }, 2000);
      loadingToast = Toast.show('加载中...', {
        duration: 0,
        position: 0,
        hideOnPress: true,
      });
      const { shareImageUrl, shareTitle, shareText, shareTkl } = this.props;
      const { WeChat } = global;
      WeChat.isWXAppInstalled()
        .then(isInstalled => {
          if (isInstalled) {
            setTimeout(() => {
              Toast.hide(loadingToast);
            }, 700);
            if (shareTkl) {
              Clipboard.setString(shareTkl);
              storage.save({
                key: 'searchText',
                data: { searchText: shareTkl },
              });
            }
            WeChat.shareToTimeline({
              type: 'imageUrl',
              title: shareTitle,
              description: shareText,
              imageUrl: shareImageUrl,
            });
          } else {
            Toast.show('你还没有安装微信，请安装微信之后再试！');
          }
        })
        .catch(() => {
          setTimeout(() => {
            Toast.hide(loadingToast);
          }, 800);
        });
    }
  };

  shareWithTkl = () => {
    if (this.canDo) {
      this.canDo = false;
      setTimeout(() => {
        this.canDo = true;
      }, 1800);
      loadingToast = Toast.show('加载中', {
        duration: 0,
        position: 0,
        hideOnPress: true,
      });
      AnalyticsUtil.event('product_detail_share_tkl');
      const { shareTkl } = this.props;
      const { WeChat } = global;
      WeChat.isWXAppInstalled()
        .then(async isInstalled => {
          Toast.hide(loadingToast);
          if (isInstalled) {
            Clipboard.setString(shareTkl);
            storage.save({
              key: 'searchText',
              data: { searchText: shareTkl },
            });
            Toast.show('已复制分享文案');
            setTimeout(() => {
              WeChat.openWXApp();
            }, 900);
          } else {
            Toast.show('你还没有安装微信，请安装微信之后再试！');
          }
        })
        .catch(() => {
          setTimeout(() => {
            Toast.hide(loadingToast);
          }, 800);
        });
    }
  };

  closeShare = () => {
    const { closeShare } = this.props;
    closeShare();
  };

  showToast(str) {
    Toast.show(str, {
      duration: 1200,
      position: 0,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  }

  render() {
    const { showShareModal, closeShare } = this.props;
    return (
      <View style={styles.webShare}>
        <TouchableOpacity style={{ flex: 1 }} onPress={closeShare} />
        <BoxShadow setting={shadowOpt}>
          <View style={styles.content}>
            <View style={styles.contentInsider}>
              <View style={styles.titleWrap}>
                <View style={styles.line} />
                <Text style={styles.title}>创建分享</Text>
                <View style={styles.line} />
              </View>
              <View style={styles.shareBoxContent}>
                <TouchableOpacity style={styles.shareBtnWrap} activeOpacity={Layout.activeOpacity} onPress={this.shareWechat}>
                  <Image style={styles.iconShare} source={require('../../assets/detail/icon-wechat.png')} />
                  <Text style={styles.shareText}>微信好友</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.shareBtnWrap]} activeOpacity={Layout.activeOpacity} onPress={this.shareFriends}>
                  <Image style={styles.iconShare} source={require('../../assets/detail/icon-friends.png')} />
                  <Text style={styles.shareText}>朋友圈</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareBtnWrap} activeOpacity={Layout.activeOpacity} onPress={this.shareWithTkl}>
                  <Image style={styles.iconShare} source={require('../../assets/icon-copy-text.png')} />
                  <Text style={styles.shareText}>复制文案</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.botWrap} activeOpacity={Layout.activeOpacity} onPress={this.closeShare}>
              <Text style={styles.shareBot}>取消</Text>
            </TouchableOpacity>
            <View style={styles.bottomTextWrap}>
              <Text style={styles.bottomText}>转发时已自动复制文案，可直接粘贴</Text>
            </View>
          </View>
        </BoxShadow>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  webShare: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    elevation: 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'column',
  },
  content: {
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 14,
    paddingBottom: 16,
    height: 192,
  },
  contentInsider: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: 32,
    height: 0.5,
    backgroundColor: '#ddd',
  },
  title: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#999',
    marginLeft: 10,
    marginRight: 10,
  },
  shareBoxContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },
  shareBtnWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  botWrap: {
    height: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconShare: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  shareText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
  },
  bottomTextWrap: {
    height: 28,
    backgroundColor: 'rgba(252,66,119,0.1)',
    alignItems: 'center',
  },
  bottomText: {
    height: 28,
    lineHeight: 28,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FC4277',
    textAlign: 'center',
  },
});
