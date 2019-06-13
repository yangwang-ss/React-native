import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { goodsOut, goodsDelete } from '../../../services/api';
import Layout from '../../../constants/Layout';

export default class goodsManage extends Component {
  state = {
    newListItem: {},
    dataSource: [],
    pageNo: 1,
    newParams: {},
  };

  componentDidMount() {
    const { listItem, dataSource } = this.props.listItem;
    this.setState({ newListItem: this.props.listItem, dataSource: this.props.dataSource });
  }

  oparate = id => {
    const { updateData } = this.props;
    updateData(id);
  };

  entrueModul = (id, params) => {
    const { showModal } = this.props;
    showModal(id, params);
  };

  async soldsOuts(id) {
    const res = await goodsOut(id);
    if (res) {
      const { params } = this.props;
      this.props.updateList(params);
    }
    const { newListItem } = this.state;
    if (id === newListItem.id) {
      newListItem.selected = !newListItem.selected;
    } else {
      newListItem.selected = false;
    }
    this.setState({ newListItem });
  }

  async goodsDelete(id) {
    this.oparate(id);
    const res = await goodsDelete(id);
    if (res) {
      const { params } = this.props;
      this.props.updateList(params);
    }
    const { newListItem } = this.state;
    if (id === newListItem.id) {
      newListItem.selected = !newListItem.selected;
    } else {
      newListItem.selected = false;
    }
    this.setState({ newListItem });
  }

  setModalVisible = visible => {
    this.setState({ modalVisible: visible });
  };

  jumpEdit = id => {
    const { init } = this.props;
    this.oparate(id);
    this.props.navigation.navigate('GoodsEdit', {
      pid: id,
      title: '编辑商品',
      refresh: () => {
        init();
      },
    });
  };

  render() {
    const { isSeleced, newListItem, dataSource } = this.state;
    const { onPressShare, navigation } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.push('GoodsSaleDetail', { id: newListItem.id })} activeOpacity={Layout.activeOpacity} style={styles.itemInfoWrap}>
          <View>
            <Image style={styles.Img} source={{ uri: newListItem.thumbnail }} />
          </View>
          <View style={styles.rightWap}>
            <View style={{ height: 96 }}>
              <View>
                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.TextFont}>
                  {newListItem.title}
                </Text>
              </View>
              <View style={[styles.lableRow, styles.Mt]}>
                <View style={styles.lableWap}>
                  <Text style={styles.lableText}>销售{newListItem.volume}件</Text>
                </View>
                <View style={[styles.lableWap, styles.lableBg]}>
                  <Text style={[styles.lableText, styles.lableColor]}>库存{newListItem.stock}件</Text>
                </View>
              </View>
            </View>
            <View style={[styles.lableRow, styles.spaceBetwwen]}>
              <View>
                <Text style={styles.Money}>
                  <Text style={{ fontSize: 14, marginTop: -3, marginRight: 2 }}>¥</Text>
                  {newListItem.discountPrice}
                </Text>
              </View>
              <View style={styles.shareWap}>
                <TouchableOpacity
                  onPress={() => {
                    this.oparate(newListItem.id);
                  }}
                >
                  <Image style={styles.shareImg} source={require('../../../../assets/Shop/more1.png')} />
                </TouchableOpacity>
                {newListItem.selected ? (
                  <View style={[styles.shareInside, dataSource.length > 1 ? '' : styles.shareInside2]}>
                    <View style={styles.triangle} />
                    <View style={styles.shareContent}>
                      <TouchableOpacity style={[styles.Box, dataSource.length > 1 ? '' : styles.Box2]} onPress={() => this.jumpEdit(newListItem.id)}>
                        <Image style={{ ...styles.sImg, height: 19 }} source={require('../../../../assets/personal/update.png')} />
                        <Text style={styles.bottomText}>修改</Text>
                      </TouchableOpacity>
                      {dataSource.length > 1 ? (
                        <TouchableOpacity style={styles.Box} onPress={() => this.entrueModul(newListItem.id, 1)}>
                          <Image style={styles.sImg} source={require('../../../../assets/Shop/xiajia.png')} />
                          <Text style={styles.bottomText}>下架</Text>
                        </TouchableOpacity>
                      ) : null}
                      {dataSource.length > 1 ? (
                        <TouchableOpacity style={styles.Box} onPress={() => this.entrueModul(newListItem.id, 0)}>
                          <Image style={styles.sImg} source={require('../../../../assets/Shop/sc.png')} />
                          <Text style={styles.bottomText}>删除</Text>
                        </TouchableOpacity>
                      ) : null}
                      <TouchableOpacity style={[styles.Box, dataSource.length > 1 ? '' : styles.Box2]} onPress={() => onPressShare(newListItem.id)}>
                        <Image style={styles.sImg} source={require('../../../../assets/Shop/tg.png')} />
                        <Text style={styles.bottomText}>分享</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    borderLeftColor: '#F6F6F6',
    borderLeftWidth: 12,
    borderRightColor: '#F6F6F6',
    borderRightWidth: 12,
  },

  hidden: {
    position: 'absolute',
    height: 0,
    width: 0,
  },
  itemInfoWrap: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  Mt: {
    marginTop: 4,
  },
  rightWap: {
    paddingLeft: 8,
  },
  Img: {
    width: 128,
    height: 128,
    borderRadius: 4,
  },
  lableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  lableWap: {
    paddingLeft: 5,
    paddingRight: 5,
    height: 18,
    marginRight: 4,
    backgroundColor: 'rgba(252,66,119,0.10)',
    borderRadius: 2,
  },
  lableBg: {
    backgroundColor: '#F6F6F6',
  },
  lableText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#FC4277',
  },
  lableColor: {
    color: '#999',
  },
  TextFont: {
    width: 188,
    fontSize: 14,
    color: '#333',
    fontFamily: 'PingFangSC-Regular',
    lineHeight: 22,
  },
  Money: {
    fontSize: 22,
    color: '#FC4277',
    fontFamily: 'DINA',
  },
  spaceBetwwen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  shareImg: {
    width: 32,
    height: 32,
    // marginTop: 10,
  },
  shareWap: {
    position: 'relative',
  },
  shareInside: {
    position: 'absolute',
    width: 197,
    height: 44,
    backgroundColor: '#333',
    borderRadius: 4,
    top: -6,
    right: 40,
    zIndex: 1,
  },
  shareInside2: {
    width: 100,
    display: 'flex',
    alignItems: 'center',
  },
  triangle: {
    position: 'absolute',
    right: -1,
    top: 19,
    width: 4,
    height: 6,
    backgroundColor: '#333',
    transform: [{ rotate: '-45deg' }],
    zIndex: -1,
  },
  shareContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Box: {
    width: '25%',
    display: 'flex',
    paddingTop: 6,
    height: 44,
    alignItems: 'center',
  },
  Box2: {
    width: '50%',
  },
  bottomText: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
    marginTop: 2,
  },
  sImg: {
    width: 18,
    height: 18,
  },
  // 弹出框样式
  toastWrap: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastContentWrap: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 270,
    position: 'relative',
  },
  toastContent: {
    marginTop: 36,
    marginBottom: 36,
    paddingLeft: 20,
    paddingRight: 20,
  },
  toastTitle: {
    fontFamily: 'PingFangSC-Medium',
    lineHeight: 24,
    fontSize: 16,
    color: '#333333',
    width: '100%',
    textAlign: 'center',
  },

  toastConfirmWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 48,
    borderTopWidth: 0.5,
    borderTopColor: '#DDD',
  },
  toastConfirm: {
    width: '50%',
    height: 48,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 16,
    color: '#FC4277',
    lineHeight: 48,
    textAlign: 'center',
  },
  bottomBtnWrap: {
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: '#DDD',
    height: 48,
    display: 'flex',
    flexDirection: 'row',
  },
  toastWordsRed: {
    color: '#FC4277',
  },
});
