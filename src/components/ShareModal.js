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
  height: 160,
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
    const { imgArr } = this.props;
    if (imgArr.length && this.canDo) {
      // 朋友圈图片不能分享多张
      this.canDo = false;
      setTimeout(() => {
        this.canDo = true;
      }, 2000);
      this.showToast('只可转发1张图片给好友');
      return;
    }
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
            const isUrl = shareImageUrl.indexOf('://') > -1;
            Clipboard.setString(shareTkl);
            storage.save({
              key: 'searchText',
              data: { searchText: shareTkl },
            });
            AnalyticsUtil.event('product_detail_share_friend');

            WeChat.shareToSession({
              type: isUrl ? 'imageUrl' : 'imageFile',
              title: shareTitle,
              description: shareText,
              imageUrl: isUrl ? shareImageUrl : `file://${shareImageUrl}`,
            });
            this.saveShareCount();
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
    const { imgArr } = this.props;
    if (imgArr.length && this.canDo) {
      // 朋友圈图片不能分享多张
      this.canDo = false;
      setTimeout(() => {
        this.canDo = true;
      }, 2000);
      this.showToast('只可转发1张图片给好友');
      return;
    }
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
            const isUrl = shareImageUrl.indexOf('://') > -1;
            Clipboard.setString(shareTkl);
            storage.save({
              key: 'searchText',
              data: { searchText: shareTkl },
            });
            AnalyticsUtil.event('product_detail_share_friend_cirlce');

            WeChat.shareToTimeline({
              type: isUrl ? 'imageUrl' : 'imageFile',
              title: shareTitle,
              description: shareText,
              imageUrl: isUrl ? shareImageUrl : `file://${shareImageUrl}`,
            });
            this.saveShareCount();
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

  saveImgArr = async () => {
    if (this.canDo) {
      this.canDo = false;
      setTimeout(() => {
        this.canDo = true;
      }, 1600);
      loadingToast = Toast.show('图片保存中', {
        duration: 0,
        position: 0,
        hideOnPress: true,
      });
      AnalyticsUtil.event('product_detail_share_savephoto');
      const { imgArr, shareImg } = this.props;
      const res = await saveFile({ fileType: 'base64', file: shareImg, location: 'album' });
      if (res) {
        for (let i = 0; i < imgArr.length; i++) {
          await saveFile({ fileType: 'url', file: imgArr[i].url, location: 'album' });
        }
        setTimeout(() => {
          Toast.hide(loadingToast);
          this.showToast('保存成功');
        }, 1500);
      } else {
        Toast.hide(loadingToast);
        Toast.show('请开启手机权限');
      }
    } else {
      setTimeout(() => {
        Toast.hide(loadingToast);
      }, 600);
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
    const { showShareModal } = this.props;
    return (
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
                <TouchableOpacity style={styles.shareBtnWrap} activeOpacity={Layout.activeOpacity} onPress={this.saveImgArr}>
                  <Image style={styles.iconShare} source={require('../../assets/icon-save-img.png')} />
                  <Text style={styles.shareText}>批量存图</Text>
                </TouchableOpacity>
              </View>
          </View>
          <View style={styles.bottomTextWrap}>
                <Text style={styles.bottomText}>转发时已自动复制文案，可直接粘贴</Text>
          </View>
        </View>
      </BoxShadow>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 14,
    paddingBottom: 16,
    height: 160,
  },
  contentInsider:{
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
  bottomTextWrap:{
    height:28,
    marginTop:16,
    backgroundColor: 'rgba(252,66,119,0.1)',
    alignItems: 'center',
  },
  bottomText:{
    height:28,
    lineHeight:28,
    fontFamily: 'PingFangSC-Regular',
    fontSize:12,
    color:'#FC4277',
    textAlign:'center'
  }
});
