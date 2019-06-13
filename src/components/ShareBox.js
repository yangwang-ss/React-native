import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Clipboard } from 'react-native';
import Toast from 'react-native-root-toast';
import Layout from '../constants/Layout';

let loadingToast = '';
export default class ShareBox extends React.Component {
  canDo = true;

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
      const { shareImageUrl, shareTitle, shareText, fromSource } = this.props;
      const { WeChat } = global;
      WeChat.isWXAppInstalled()
        .then(isInstalled => {
          if (isInstalled) {
            try {
              setTimeout(() => {
                Toast.hide(loadingToast);
              }, 700);
              const isUrl = shareImageUrl.indexOf('://') > -1;
              const params = {
                title: shareTitle,
                description: shareText,
                type: isUrl ? 'imageUrl' : 'imageFile',
                imageUrl: isUrl ? shareImageUrl : `file://${shareImageUrl}`,
              };
              if (fromSource === 'detail' || fromSource === 'ShopDetail') {
                Clipboard.setString(this.props.shareTkl);
                storage.save({
                  key: 'searchText',
                  data: { searchText: this.props.shareTkl },
                });
                AnalyticsUtil.event('product_detail_share_friend');
              }
              if (fromSource === 'ShopOwnerList') {
                WeChat.shareToSession({
                  title: shareTitle, // 主标题
                  description: '', // 副标题
                  thumbImage: 'https://image.vxiaoke360.com/Fu5jBQzuQy6jiaHM1xXqpUQGzjkz', // 分享的封面图
                  type: 'news',
                  webpageUrl: shareText, // 打开的地址
                });
              } else {
                WeChat.shareToSession(params);
              }
            } catch (e) {
              throw e;
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
      const { shareImageUrl, shareTitle, shareText, fromSource } = this.props;
      const { WeChat } = global;
      WeChat.isWXAppInstalled()
        .then(isInstalled => {
          if (isInstalled) {
            setTimeout(() => {
              Toast.hide(loadingToast);
            }, 700);
            try {
              const isUrl = shareImageUrl.indexOf('://') > -1;
              const params = {
                title: shareTitle,
                description: shareText,
                type: isUrl ? 'imageUrl' : 'imageFile',
                imageUrl: isUrl ? shareImageUrl : `file://${shareImageUrl}`,
              };
              if (fromSource === 'detail' || fromSource === 'ShopDetail') {
                Clipboard.setString(this.props.shareTkl);
                storage.save({
                  key: 'searchText',
                  data: { searchText: this.props.shareTkl },
                });
                AnalyticsUtil.event('product_detail_share_friend_cirlce');
              }

              if (fromSource === 'ShopOwnerList') {
                WeChat.shareToTimeline({
                  title: shareTitle, // 主标题
                  description: '', // 副标题
                  thumbImage: 'https://image.vxiaoke360.com/Fu5jBQzuQy6jiaHM1xXqpUQGzjkz', // 分享的封面图
                  type: 'news',
                  webpageUrl: shareText, // 打开的地址
                });
              } else {
                WeChat.shareToTimeline(params);
              }
            } catch (e) {
              throw e;
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

  shareWithTkl = () => {
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
      AnalyticsUtil.event('product_detail_share_tkl');
      const { shareTkl } = this.props;
      const { WeChat } = global;
      WeChat.isWXAppInstalled()
        .then(async isInstalled => {
          if (isInstalled) {
            setTimeout(() => {
              Toast.hide(loadingToast);
            }, 700);
            Clipboard.setString(shareTkl);
            storage.save({
              key: 'searchText',
              data: { searchText: shareTkl },
            });
            WeChat.openWXApp();
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

  copyLink = () => {
    const { shareText } = this.props;
    Clipboard.setString(shareText);
    Toast.show('复制链接成功！');
  };

  closeShare = () => {
    const { closeShare } = this.props;
    closeShare();
  };

  render() {
    const { showShareBox, fromSource } = this.props;
    return (
      showShareBox && (
        <TouchableOpacity style={styles.shareBoxWrap} activeOpacity={Layout.activeOpacity} onPress={this.closeShare}>
          <View style={styles.shareBoxContent}>
            <View style={styles.shareBox}>
              {fromSource == 'detail' && (
                <TouchableOpacity style={styles.shareBtnWrap} activeOpacity={Layout.activeOpacity} onPress={this.shareWithTkl}>
                  <Image style={styles.iconShare} source={require('../../assets/detail/icon-tkl.png')} />
                  <Text style={styles.shareText}>淘口令分享</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.shareBtnWrap} activeOpacity={Layout.activeOpacity} onPress={this.shareWechat.bind(this)}>
                <Image style={styles.iconShare} source={require('../../assets/detail/icon-wechat.png')} />
                <Text style={styles.shareText}>微信好友</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.shareBtnWrap]} activeOpacity={Layout.activeOpacity} onPress={this.shareFriends}>
                <Image style={styles.iconShare} source={require('../../assets/detail/icon-friends.png')} />
                <Text style={styles.shareText}>朋友圈</Text>
              </TouchableOpacity>
              {fromSource == 'ShopOwnerList' && (
                <TouchableOpacity style={[styles.shareBtnWrap]} activeOpacity={Layout.activeOpacity} onPress={this.copyLink}>
                  <Image style={styles.iconShare} source={require('../../assets/detail/icon-link.png')} />
                  <Text style={styles.shareText}>复制链接</Text>
                </TouchableOpacity>
              )}
              {/* <TouchableOpacity style={styles.shareBtnWrap} activeOpacity={Layout.activeOpacity}>
              <Image style={styles.iconShare} source={require('../../assets/detail/icon-qq.png')} />
              <Text style={styles.shareText}>QQ</Text>
            </TouchableOpacity>  */}
            </View>
            <View style={styles.bottomTextWrap}>
              <Text style={styles.bottomText}>转发时已自动复制文案，可直接粘贴</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    );
  }
}

const styles = StyleSheet.create({
  shareBoxWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    elevation: 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
  },
  shareBoxContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: Layout.window.width,
    height: 118,
    backgroundColor: '#fff',
    paddingTop: 11,
  },
  shareBox: {
    paddingLeft: 45,
    paddingRight: 45,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  bottomTextWrap: {
    height: 28,
    marginTop: 16,
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
