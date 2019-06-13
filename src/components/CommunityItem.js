import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity, Clipboard,
} from 'react-native';
import Toast from 'react-native-root-toast';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import HTML from 'react-native-render-html';
import Layout from '../constants/Layout';

export default class CommunityItem extends Component {
  constructor(props) {
    super(props);
    this.htmlText = '';
  }

  _keyExtractor = (item, index) => `${index}`;

  renderItemImg = () => {
    const { info, info: { imgs } } = this.props;
    const arr = [];
    imgs.map((item, index) => {
      arr.push(
        <View style={[styles.contentImgItem, (imgs.length === 2 || imgs.length === 4) && styles.contentImgItem2]} key={index}>
          {
           info.productId ? (
             <Image style={styles.contentImgs} source={{ uri: imgs[index] }} />
           ) : (
             <TouchableOpacity onPress={() => this.pressImg(imgs, index)} activeOpacity={Layout.activeOpacity}>
               <Image style={styles.contentImgs} source={{ uri: imgs[index] }} />
             </TouchableOpacity>
           )
         }
          {
            info.isLoot == 1 && (
              <View style={[styles.statusTxtWrap, (imgs.length === 2 || imgs.length === 4) && styles.statusTxtWrap2]}>
                <Text style={styles.statusTxt}>已抢光</Text>
              </View>
            )
          }
          {
            info.price && info.price > 0 && index == 0 ? (
              <View style={styles.priceLable}>
                <View style={styles.priceArrow} />
                <View style={styles.priceArea}>
                  <Text style={styles.price}>
￥
                    {info.price || '0.00'}
                  </Text>
                </View>
              </View>
            ) : null
          }
        </View>,
      );
    });
    return arr;
  };

  onPressShare = (item, index) => {
    const { onPressShare } = this.props;
    onPressShare(item, index);
    if (this.htmlText) {
      Clipboard.setString(this.htmlText);
      // Toast.show('内容复制成功');
      storage.save({
        key: 'searchText',
        data: { searchText: this.htmlText },
      });
    }
  };

  copyText = () => {
    if (this.htmlText) {
      Clipboard.setString(this.htmlText);
      Toast.show('复制成功');
      storage.save({
        key: 'searchText',
        data: { searchText: this.htmlText },
      });
    }
  };

  pressImg = (src, index) => {
    const { pressImg } = this.props;
    pressImg(src, index);
  };

  jumpDetail = (item) => {
    const { jumpDetail } = this.props;
    if (item.productId) {
      jumpDetail(item);
    } else {
      return null;
    }
  };

  copy = (text) => {
    Clipboard.setString(text);
    storage.save({
      key: 'searchText',
      data: { searchText: text },
    });
    this.showToast('复制成功');
  };

  showToast = (str) => {
    Toast.show(str, {
      duration: 2000,
      position: 0,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };

  alterNode = (e) => {
    let text = '';
    if (!e.parent && e.children instanceof Array && e.children.length > 0) {
      e.children.forEach(({ data, type }) => {
        if (type === 'text' && data) {
          text += `${data}\n`;
        }
      });
      if (text) {
        this.htmlText = text;
      }
    }
  };

  render() {
    const { info, isLine, index } = this.props;
    const { isReview } = global;
    return (
      <View style={styles.itemContainer}>
        <View style={[styles.itemList, !isLine && styles.itemLine]}>
          <View style={styles.items}>
            <View style={styles.itemAvatarBox}>
              <Image style={styles.itemAvatar} source={{ uri: info.avatar }} />
              <View style={styles.nameWrap}>
                <Text style={styles.itemName}>{info.author}</Text>
                <Text style={styles.itemTime}>{info.time}</Text>
              </View>
            </View>
            {
              !isReview && (
                <TouchableOpacity onPress={() => this.onPressShare(info, index)} style={styles.shareBtn}>
                  <Image style={styles.shareIcon} source={require('../../assets/icon-share.png')} />
                  <Text style={styles.shareText}>{info.shareTime}</Text>
                </TouchableOpacity>
              )
            }
          </View>
          <View style={styles.contentWrap}>
            <TouchableOpacity onPress={() => this.copyText()}>
              <HTML alterNode={this.alterNode} html={info.content} imagesMaxWidth={Layout.window.width - 100} textSelectable />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.jumpDetail(info, this.htmlText)} activeOpacity={Layout.activeOpacity}>
              {
                info.longImg ? (
                  <TouchableOpacity onPress={() => this.pressImg([info.longImg])} activeOpacity={Layout.activeOpacity}>
                    <FastImage style={styles.speImg} resizeMode={FastImage.resizeMode.contain} source={{ uri: `${info.longImg}?imageMogr2/thumbnail/206x/crop/!206x368a0a0` }} />
                  </TouchableOpacity>
                ) : (
                  info.imgs && info.imgs.length > 1 ? (
                    <View style={styles.itemImgList}>
                      {this.renderItemImg()}
                    </View>
                  ) : (
                    <View style={styles.contentSingleImg}>
                      {
                        info.productId ? (
                          <FastImage style={styles.singleImg} source={{ uri: info.imgs[0] }} />
                        ) : (
                          <TouchableOpacity onPress={() => this.pressImg(info.imgs)} activeOpacity={Layout.activeOpacity}>
                            <FastImage style={styles.singleImg} source={{ uri: info.imgs && info.imgs[0] }} />
                          </TouchableOpacity>
                        )
                      }
                      {
                        info.isLoot == 1
                        && (
                        <View style={[styles.statusTxtWrap, info.imgs.length > 1 ? '' : styles.statusTxtWrapSingle]}>
                          <Text style={styles.statusTxt}>已抢光</Text>
                        </View>
                        )
                      }
                      {
                        info.price && (
                          <View style={styles.priceLable}>
                            <View style={styles.priceArrow} />
                            <View style={styles.priceArea}>
                              <Text style={styles.price}>
￥
                                {info.price || '0.00'}
                              </Text>
                            </View>
                          </View>
                        )
                      }
                    </View>
                  )
                )
              }
            </TouchableOpacity>
            {
              !isReview && Boolean(info.productId) && Boolean(info.income) && (
                <View style={styles.awardWrap}>
                  <LinearGradient
                    style={styles.awardPrice}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#FEB364', '#FE964C']}
                  >
                    <Text style={styles.awardText}>{info.income}</Text>
                  </LinearGradient>
                </View>
              )
            }
            {info.comment
              ? (
                <View style={styles.commentContent}>
                  <View style={styles.angleTop} />
                  <Text style={styles.commentText}>{info.comment}</Text>
                  <View style={styles.commentCopy}>
                    <View />
                    <TouchableOpacity style={styles.commentCopyWrap} activeOpacity={Layout.activeOpacity} onPress={() => this.copy(info.comment)}>
                      <Image style={styles.commentCopyImg} source={require('../../assets/community-icon-comment.png')} />
                      <Text style={styles.commentCopyText}>复制评论</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null
            }
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    backgroundColor: '#f4f4f4',
  },
  contentWrap: {
    paddingLeft: 50,
  },
  itemLine: {
    marginBottom: 8,
  },
  itemList: {
    backgroundColor: '#fff',
    padding: 16,
  },
  items: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemAvatarBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#f4f4f4',
  },
  nameWrap: {
    height: 36,
    justifyContent: 'space-between',
  },
  itemName: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  itemTime: {
    color: '#999',
    fontSize: 12,
  },
  shareBtn: {
    borderRadius: 14,
    paddingLeft: 6,
    paddingRight: 6,
    height: 22,
    backgroundColor: 'rgba(252, 66, 119, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  shareText: {
    fontSize: 12,
    lineHeight: 22,
    color: '#fc4277',
  },
  itemImgList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    overflow: 'hidden',
  },
  contentImgItem: {
    width: 86,
    height: 86,
    marginRight: 6,
    marginBottom: 6,
    position: 'relative',
  },
  contentImgItem2: {
    width: 132,
    height: 132,
  },
  margin0: {
    marginRight: 0,
  },
  contentImgs: {
    width: '100%',
    height: '100%',
  },
  contentSingleImg: {
    height: 175,
    width: 175,
    position: 'relative',
  },
  singleImg: {
    height: 176,
    width: 176,
  },
  statusTxtWrap: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 3,
    width: 62,
    height: 62,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 43,
  },
  statusTxtWrapSingle: {
    top: 61,
    left: 61,
  },
  statusTxtWrap2: {
    top: 35,
    left: 35,
  },
  statusTxt: {
    color: '#fff',
    fontSize: 13,
  },
  priceLable: {
    position: 'absolute',
    bottom: 8,
    right: -5,
    height: 14,
  },
  priceArrow: {
    marginLeft: 5,
    marginTop: 1,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 5,
    borderTopColor: '#fff',
    borderLeftColor: '#81000F',
    borderBottomColor: '#fff',
    borderRightColor: '#fff',
    position: 'absolute',
    top: 7,
    right: -5,
  },
  priceArea: {
    backgroundColor: '#EA4457',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    height: 14,
  },
  price: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 10,
    color: '#fff',
    lineHeight: 14,
    marginLeft: 3,
    marginRight: 8,
  },
  commentHour: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  commentContent: {
    width: '100%',
    backgroundColor: '#F6F6F6',
    borderRadius: 4,
    marginTop: 10,
    padding: 12,
    position: 'relative',
  },
  commentText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  commentCopy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  commentCopyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 8,
    height: 20,
    backgroundColor: 'rgba(252,66,119,0.10)',
    borderRadius: 10,
  },
  commentCopyImg: {
    width: 15,
    height: 13,
  },
  commentCopyText: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    color: '#FC4277',
    marginLeft: 4,
  },
  angleTop: {
    position: 'absolute',
    left: 12,
    top: -10,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 5,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: '#F6F6F6',
    borderRightColor: 'transparent',
  },
  speImg: {
    width: 103,
    height: 184,
  },
  awardWrap: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 2,
  },
  awardPrice: {
    paddingLeft: 6,
    paddingRight: 6,
    height: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  awardText: {
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
  },
});
