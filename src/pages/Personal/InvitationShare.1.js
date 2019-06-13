/* eslint-disable camelcase */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, StatusBar, Clipboard, InteractionManager } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import Toast from 'react-native-root-toast';
import Carousel from 'react-native-snap-carousel';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import fetch_blob from 'rn-fetch-blob';
import { isIphoneX } from 'react-native-iphone-x-helper';
import Svg, { Image as SvgImage, Text as SvgText } from 'react-native-svg';
import ShareBox from '../../components/ShareBox';
import LoadingIcon from '../../components/LoadingIcon';
import SaveImg from '../../components/SaveImg';
import Layout from '../../constants/Layout';
import drawText from '../../utils/drawText';
import saveFile from '../../utils/saveFile';
import { sharePoster, shareCopywriting } from '../../services/api';
import Share1 from '../../svgImages/share1';

const shadowValue = {
  width: 475,
  height: 5,
  color: '#999',
  border: 16,
  opacity: 0.5,
  x: 0,
  y: 14,
};

const imgShadowValue = {
  width: (Layout.window.height - 280) * 0.5625,
  height: Layout.window.height - 272,
  color: '#999',
  border: 16,
  opacity: 0.6,
  x: 2,
  y: 16,
  style: { position: 'absolute', left: 8, top: 2 },
};
const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  chooseContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 94,
  },
  chooseTitle: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  shareBtnBox: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  btnBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
  },
  btnArea: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FF890F',
    height: 38,
  },
  btnText: {
    lineHeight: 38,
    textAlign: 'center',
    color: '#FF890F',
    fontSize: 15,
    fontFamily: 'PingFangSC-Regular',
  },
  shareBtnArea: {
    marginLeft: 7,
    borderColor: '#FC4277',
  },
  shareBtnText: {
    color: '#FC4277',
  },
  imgBox: {
    height: Layout.window.height - 234,
    width: '100%',
    overflow: 'hidden',
  },
  imgList: {
    height: Layout.window.height - 244,
    width: (Layout.window.height - 244) * 0.5625,
  },
  imgs: {
    height: Layout.window.height - 244,
    width: (Layout.window.height - 244) * 0.5625,
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
export default class InvitationShare extends Component {
  static navigationOptions = {
    title: '邀请',
  };

  state = {
    showLoading: true,
    showShareBox: false,
    shareImageUrl: '',
    shareTitle: '米粒生活',
    shareText: '',
    copywriting: '',
    shareImgs: [],
    result: [],
    isDraw: false,
    canClick: true,
    sliderActive: 0,
    // 图片保存state
    imgSwiperIndex: 0,
    canOpenImg: true,
    showFullPic: false,
    fullPicInfo: [],
  };

  async componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.init();
    });
  }

  componentWillUnmount() {
    Toast.hide(this.loadingToast);
  }

  init = () => {
    this.getInvitationShare();
    this.shareCopywriting();
  };

  closeShare = () => {
    this.setState({
      showShareBox: false,
    });
  };

  copyLink = () => {
    const { copywriting, canClick } = this.state;
    if (canClick) {
      this.setState(
        {
          canClick: false,
        },
        () => {
          Clipboard.setString(copywriting);
          storage.save({
            key: 'searchText',
            data: { searchText: copywriting },
          });
          AnalyticsUtil.event('InvitationShare_click_copy_link');
          Toast.show('复制成功');
          setTimeout(() => {
            const { WeChat } = global;
            WeChat.isWXAppInstalled()
              .then(async isInstalled => {
                if (isInstalled) {
                  WeChat.openWXApp();
                  this.setState({
                    canClick: true,
                  });
                } else {
                  Toast.show('你还没有安装微信，请安装微信之后再试！');
                  setTimeout(() => {
                    this.setState({
                      canClick: true,
                    });
                  }, 2000);
                }
              })
              .catch(() => {
                setTimeout(() => {
                  this.setState({
                    canClick: true,
                  });
                }, 2000);
              });
          }, 500);
        }
      );
    }
  };

  shareCopywriting = async () => {
    this.setState({
      copywriting: (await shareCopywriting()).copywriting,
    });
  };

  pressImg = imgs => {
    console.log('===', imgs);
    const { canOpenImg } = this.state;
    if (canOpenImg) {
      this.props.navigation.setParams({ fullscreen: true });
      this.setState(
        {
          canOpenImg: false,
        },
        () => {
          this.loadingToast = Toast.show('图片加载中..', {
            duration: 0,
            position: 0,
            onShow: () => {
              const imgArr = [];
              const screenWidth = Layout.window.width;
              Image.getSize(imgs, (width, height) => {
                const imgH = Math.floor((screenWidth / width) * height);
                imgArr.push({
                  height: imgH,
                  src: imgs,
                });

                this.setState(
                  {
                    showFullPic: true,
                    fullPicInfo: imgArr,
                    canOpenImg: true,
                  },
                  () => {
                    Toast.hide(this.loadingToast);
                  }
                );
              });
            },
          });
        }
      );
    }
  };

  onPressClosefullPic = () => {
    this.props.navigation.setParams({ fullscreen: false });
    this.setState({
      showFullPic: false,
    });
  };

  async getInvitationShare() {
    const { drawParam } = await sharePoster();
    /*  const shareImgs =
      (await storage
        .load({
          key: 'shareImgs',
        })
        .catch(e => e)) || [];
    let isDraw = false;
    if (shareImgs && shareImgs instanceof Array) {
      for (let i = 0; i < drawParam.length; i++) {
        const id1 = drawParam[i].id;
        let flag = false;
        for (let j = 0; j < shareImgs.length; j++) {
          const id2 = shareImgs[j].id;
          if (id1 === id2) {
            flag = true;
            break;
          }
        }
        if (flag === false) {
          isDraw = true;
          break;
        }
      }
    } else {
      isDraw = true;
    } */
    if (drawParam) {
      this.setState({
        result: drawParam,
        isDraw: true,
      });
    } else {
      this.setState({
        shareImgs,
        isDraw,
        showLoading: false,
        sliderActive: 0,
      });
    }
  }

  checked = false;

  async getShareImgChoose() {
    if (this.checked) {
      return;
    }
    const { shareImgs, copywriting, sliderActive } = this.state;
    AnalyticsUtil.event('InvitationShare_click_share_photo');
    Clipboard.setString(copywriting);
    storage.save({
      key: 'searchText',
      data: { searchText: copywriting },
    });
    const res = await saveFile({ fileType: 'base64', file: shareImgs[sliderActive].img, location: 'cache' });
    if (res) {
      this.setState({
        shareImageUrl: res,
        showShareBox: true,
      });
    } else {
      Toast.show('请开启手机权限');
      setTimeout(() => {
        Toast.hide(this.toast);
      }, 800);
    }
  }

  renderItem({ item, index }) {
    return (
      <TouchableOpacity key={index} activeOpacity={1} onPress={() => item.img && this.pressImg(item.img)} style={styles.imgList}>
        <BoxShadow setting={imgShadowValue} />
        <Image style={styles.imgs} source={{ uri: item.img }} />
      </TouchableOpacity>
    );
  }

  shareImgs = [];

  getBase64 = ({ baseImg, id }) => {
    const { shareImgs, result } = this.state;
    this.shareImgs.push({
      img: `data:image/jpeg;base64,${baseImg}`,
      id,
    });
    this.setState({
      shareImgs: [...this.shareImgs],
      sliderActive: 0,
      showLoading: false,
    });
    storage.save({
      key: 'shareImgs',
      data: this.shareImgs,
    });
  };

  render() {
    const { showFullPic, fullPicInfo, imgSwiperIndex, result, shareImgs } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="always">
        <StatusBar barStyle="dark-content" />
        {result.length > 0 && <Share1 result={result} getBase64={this.getBase64.bind(this)} />}
        {shareImgs.length > 0 && (
          <View style={[styles.chooseContainer, isIphoneX() && { paddingBottom: 120 }]}>
            <Text style={styles.chooseTitle}>请选择邀请图</Text>
            <View style={styles.imgBox}>
              <Carousel
                data={shareImgs}
                renderItem={this.renderItem.bind(this)}
                sliderWidth={Layout.window.width}
                itemWidth={(Layout.window.height - 244) * 0.5625}
                onSnapToItem={index => this.setState({ sliderActive: index })}
              />
            </View>
            <View style={styles.shareBtnBox}>
              <BoxShadow setting={shadowValue} />
              <View style={[styles.btnBox, isIphoneX() && { paddingBottom: 30 }]}>
                <TouchableOpacity onPress={this.copyLink} style={[styles.btnArea]}>
                  <Text style={[styles.btnText]}>复制邀请链接</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.getShareImgChoose()} style={[styles.btnArea, styles.shareBtnArea]}>
                  <Text style={[styles.btnText, styles.shareBtnText]}>分享专属海报</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.bottomTextWrap}>
                <Text style={styles.bottomText}>转发时已自动复制文案，可直接粘贴</Text>
              </View>
            </View>
          </View>
        )}
        <LoadingIcon showLoading={this.state.showLoading} />
        {this.state.showShareBox ? (
          <ShareBox closeShare={this.closeShare} showShareBox={this.state.showShareBox} shareImageUrl={this.state.shareImageUrl} shareTitle={this.state.shareTitle} shareText={this.state.shareText} />
        ) : null}
        {showFullPic && (
          <SaveImg
            fileType="base64"
            screenHeight={Layout.window.height - 60}
            imgSwiperIndex={imgSwiperIndex}
            fullPicInfo={fullPicInfo}
            onIndexChanged={this.onIndexChanged}
            onPressClosefullPic={this.onPressClosefullPic}
          />
        )}
      </ScrollView>
    );
  }
}
