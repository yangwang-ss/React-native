import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Clipboard, PixelRatio } from 'react-native';
import Toast from 'react-native-root-toast';
import Layout from '../constants/Layout';
import saveFile from '../utils/saveFile';

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
    backgroundColor: '#F6F6F6',
    height: 178,
  },
  shareBoxContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
  },
  shareBoxContent2: {
    paddingLeft: 32,
    paddingRight: 32,
  },
  shareBtnWrap: {
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
  botWrap: {
    height: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBot: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
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
let loadingToast = '';
type Props = {
  url: string,
  base64Img: string,
  shareText: string,
  shareTitle: string,
  closeShare: Function,
  shareDesc: string,
  type: string,
};
export default class WebShare extends React.Component<Props> {
  canDo = true;

  shouldComponentUpdate(nextProps) {
    if (nextProps.base64Img !== this.props.base64Img) {
      return true;
    }
    return false;
  }

  shareWechat = async () => {
    if (this.canDo) {
      this.canDo = false;
      this.analytics('wechat');
      setTimeout(() => {
        this.canDo = true;
      }, 2000);
      loadingToast = Toast.show('加载中...', {
        duration: 0,
        position: 0,
        hideOnPress: true,
      });
      const { base64Img, shareText } = this.props;
      const imgUrl = await saveFile({ fileType: 'base64', file: base64Img, location: 'cache' });
      const { WeChat } = global;
      WeChat.isWXAppInstalled()
        .then(isInstalled => {
          if (isInstalled) {
            setTimeout(() => {
              Toast.hide(loadingToast);
            }, 700);
            Clipboard.setString(shareText);
            storage.save({
              key: 'searchText',
              data: { searchText: shareText },
            });
            Toast.show('已自动复制文案，分享后可长按粘贴');
            const isUrl = imgUrl.indexOf('://') > -1;
            WeChat.shareToSession({
              type: isUrl ? 'imageUrl' : 'imageFile',
              imageUrl: isUrl ? imgUrl : `file://${imgUrl}`,
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

  shareFriends = async params => {
    if (this.canDo) {
      this.canDo = false;
      this.analytics('friends');
      setTimeout(() => {
        this.canDo = true;
      }, 2000);
      loadingToast = Toast.show('加载中...', {
        duration: 0,
        position: 0,
        hideOnPress: true,
      });
      const { base64Img, shareText } = this.props;
      const imgUrl = await saveFile({ fileType: 'base64', file: base64Img, location: 'cache' });
      const { WeChat } = global;
      WeChat.isWXAppInstalled()
        .then(isInstalled => {
          if (isInstalled) {
            setTimeout(() => {
              Toast.hide(loadingToast);
            }, 700);
            const isUrl = imgUrl.indexOf('://') > -1;
            Clipboard.setString(shareText);
            storage.save({
              key: 'searchText',
              data: { searchText: shareText },
            });
            WeChat.shareToTimeline({
              type: isUrl ? 'imageUrl' : 'imageFile',
              imageUrl: isUrl ? imgUrl : `file://${imgUrl}`,
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

  shareUrl = events => {
    if (this.canDo) {
      this.canDo = false;
      this.analytics('url');
      setTimeout(() => {
        this.canDo = true;
      }, 1800);
      loadingToast = Toast.show('加载中', {
        duration: 0,
        position: 0,
        hideOnPress: true,
      });
      const { url, shareTitle, shareText, shareDesc } = this.props;
      const { WeChat } = global;
      WeChat.isWXAppInstalled()
        .then(async isInstalled => {
          Toast.hide(loadingToast);
          if (isInstalled) {
            Clipboard.setString(shareText);
            storage.save({
              key: 'searchText',
              data: { searchText: shareText },
            });
            if (events === 'friend') {
              WeChat.shareToTimeline({
                title: shareTitle,
                description: shareDesc,
                thumbImage: 'https://image.vxiaoke360.com/Fu5jBQzuQy6jiaHM1xXqpUQGzjkz',
                type: 'news',
                webpageUrl: url,
              });
            } else {
              WeChat.shareToSession({
                title: shareTitle, // 主标题
                description: shareDesc, // 副标题
                thumbImage: 'https://image.vxiaoke360.com/Fu5jBQzuQy6jiaHM1xXqpUQGzjkz', // 分享的封面图
                type: 'news',
                webpageUrl: url, // 打开的地址
              });
            }
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

  saveImgArr = async () => {
    if (this.canDo) {
      this.canDo = false;
      this.analytics('saveImg');
      setTimeout(() => {
        this.canDo = true;
      }, 1600);
      loadingToast = Toast.show('图片保存中', {
        duration: 0,
        position: 0,
        hideOnPress: true,
      });
      const { base64Img } = this.props;
      const res = await saveFile({ fileType: 'base64', file: base64Img, location: 'album' });
      if (res) {
        this.showToast('保存成功');
      }
      Toast.hide(loadingToast);
    } else {
      setTimeout(() => {
        Toast.hide(loadingToast);
      }, 600);
    }
  };

  analytics = shareType => {
    const { type } = this.props;
    AnalyticsUtil.eventWithAttributes(`h5_share_click`, { type, shareType });
  };

  closeShare = () => {
    const { closeShare } = this.props;
    closeShare();
  };

  showToast = str => {
    Toast.show(str, {
      duration: 1200,
      position: 0,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };

  render() {
    const { base64Img, type, nameIsUrl } = this.props;
    return (
      <View style={styles.webShare}>
        <View style={{ flex: 1, paddingLeft: 88, paddingRight: 88 }}>
          <Image source={{ uri: base64Img }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        </View>
        <View style={styles.content}>
          {type !== 'onlyShareUrl' ? (
            <View style={[styles.shareBoxContent, type === 'zfb' && styles.shareBoxContent2]}>
              <TouchableOpacity style={styles.shareBtnWrap} activeOpacity={Layout.activeOpacity} onPress={this.shareWechat}>
                <Image style={styles.iconShare} source={require('@assets/detail/icon-wechat.png')} />
                <Text style={styles.shareText}>微信好友</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.shareBtnWrap]} activeOpacity={Layout.activeOpacity} onPress={this.shareFriends}>
                <Image style={styles.iconShare} source={require('@assets/detail/icon-friends.png')} />
                <Text style={styles.shareText}>朋友圈</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareBtnWrap} activeOpacity={Layout.activeOpacity} onPress={this.saveImgArr}>
                <Image style={styles.iconShare} source={require('@assets/share/w-save.png')} />
                <Text style={styles.shareText}>保存图片</Text>
              </TouchableOpacity>
              {type !== 'zfb' ? (
                <TouchableOpacity style={styles.shareBtnWrap} activeOpacity={Layout.activeOpacity} onPress={this.shareUrl}>
                  <Image style={styles.iconShare} source={require('@assets/share/w-link.png')} />
                  <Text style={styles.shareText}>分享链接</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <View style={[styles.shareBoxContent, type === 'onlyShareUrl' && styles.shareBoxContent2]}>
              {nameIsUrl ? (
                <TouchableOpacity style={styles.shareBtnWrap} activeOpacity={Layout.activeOpacity} onPress={this.shareUrl}>
                  <Image style={styles.iconShare} source={require('@assets/share/w-link.png')} />
                  <Text style={styles.shareText}>分享链接</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.shareBtnWrap} activeOpacity={Layout.activeOpacity} onPress={this.shareUrl}>
                  <Image style={styles.iconShare} source={require('@assets/detail/icon-wechat.png')} />
                  <Text style={styles.shareText}>微信好友</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.shareBtnWrap]} activeOpacity={Layout.activeOpacity} onPress={() => this.shareUrl('friend')}>
                <Image style={styles.iconShare} source={require('@assets/detail/icon-friends.png')} />
                <Text style={styles.shareText}>朋友圈</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.botWrap} activeOpacity={Layout.activeOpacity} onPress={this.closeShare}>
            <Text style={styles.shareBot}>取消</Text>
          </TouchableOpacity>
          <View style={styles.bottomTextWrap}>
            <Text style={styles.bottomText}>转发时已自动复制文案，可直接粘贴</Text>
          </View>
        </View>
      </View>
    );
  }
}
