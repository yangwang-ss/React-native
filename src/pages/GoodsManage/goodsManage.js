import React, { Component, PureComponent } from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList, ScrollView, Keyboard, Image, TextInput, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import fetch_blob from 'rn-fetch-blob';
import Toast from 'react-native-root-toast';
import GoodsItem from './components/goodsItem';
import { getGoodsLists, getStorePrdDetail, shopDetailSearch } from '../../services/api';
import saveFile from '../../utils/saveFile';
import base64img from '../../utils/base64Img';
import authVerification from '../../utils/authVerification';
import drawText from '../../utils/drawText';

type Props = {
  navigation: Object,
};
export default class OrderList extends PureComponent<Props> {
  static navigationOptions = ({ navigation }) => ({
    title: '商品管理',
    headerRight: (
      <TouchableOpacity
        onPress={() => {
          navigation.state.params.jumpEdit();
        }}
      >
        <View style={{ paddingRight: 16 }}>
          <Text style={{ fontSize: 16, color: '#333', fontFamily: 'PingFangSC-Regular' }}>添加商品</Text>
        </View>
      </TouchableOpacity>
    ),
  });

  state = {
    list: [],
    isClick: true, // 解决Tab反复加载数据重复的问题
    showEmpty: false,
    isDelteShop: false,
    NewId: '',
    isOut: '',
    menus: [
      {
        name: '在售',
        active: true,
        type: 0,
        left: 0,
      },
      {
        name: '库存预警',
        active: false,
        type: 1,
        left: 30,
      },
      {
        name: '售罄',
        active: false,
        type: 2,
        left: 60,
      },
    ],
    loadMoreText: '',

    params: {
      type: 0,
      pageNo: 1,
      keyWord: '',
    },
    qrCodeInfo: '',
    tabIndex: 0,
  };

  isChecked = false;

  componentDidMount() {
    const { params, menus } = this.state;
    console.log('99999', params);
    const index = this.props.navigation.getParam('index', '');
    if (typeof index === 'string') {
      params.type = Number(index);
      const newMenus = menus.map((item, i) => {
        item.active = i == index;
        return item;
      });
      this.setState({
        menus: newMenus,
      });
    }
    this.props.navigation.setParams({ jumpEdit: this.jumpEdit });
    this.getStoreOrderList(params);
  }

  componentWillUnmount() {
    Toast.hide(this.shareToast);
  }

  init = () => {
    this.setState(
      {
        list: [],
        params: {
          type: 0,
          pageNo: 1,
          keyWord: '',
        },
      },
      () => {
        const { tabIndex, menus } = this.state;
        const params = {
          type: menus[tabIndex].type,
          pageNo: 1,
          keyWord: '',
        };
        this.getStoreOrderList(params);
      }
    );
  };

  jumpEdit = pid => {
    this.props.navigation.navigate('GoodsEdit', {
      title: '添加商品',
      refresh: () => {
        this.init();
      },
    });
  };

  // 下拉刷新
  onHeaderRefresh = () => {
    const { params } = this.state;
    const datas = {
      ...params,
      pageNo: 1,
    };
    this.setState({ list: [], params: datas }, () => this.getStoreOrderList(datas));
    console.log('下拉刷新===onHeaderRefresh');
    this.canLoadMore = false;
  };

  // 上拉加载
  onFooterLoad = () => {
    const { params } = this.state;
    console.log('上拉加载===onFooterLoad');
    if (this.canLoadMore) {
      this.canLoadMore = false;
      console.log('this', this);
      this.getStoreOrderList(params);
    }
  };

  onChangeText = val => {
    const { params } = this.state;
    this.setState({
      params: {
        ...params,
        keyWord: val,
      },
    });
  };

  getQRCode = () => {
    let flag = 0;
    return new Promise(resolve => {
      const timer = setInterval(() => {
        flag += 1;
        if (this.svg && this.svg.toDataURL) {
          clearInterval(timer);
          this.svg.toDataURL(dataURL => {
            resolve(`data:image/jpeg;base64,${dataURL}`);
          });
          return;
        }
        if (flag > 10) {
          clearInterval(timer);
          resolve(false);
        }
      }, 500);
    });
  };

  getCanvas = () => {
    let flag = 0;
    return new Promise(resolve => {
      const timer = setInterval(() => {
        flag += 1;
        if (this.canvasImg) {
          clearInterval(timer);
          resolve(this.canvasImg);
          return;
        }
        if (flag > 10) {
          clearInterval(timer);
          resolve(false);
        }
      }, 500);
    });
  };

  onPressShare = async pid => {
    try {
      const { navigation } = this.props;
      if (!this.isChecked) {
        this.isChecked = true;
        if (this.currentPid === pid) {
          navigation.navigate('DetailShare', {
            shareImg: this.canvasImg,
            imgArr: this.pDetail.images.map(item => item.value),
            sharePrice: this.pDetail.shareAwardPrice,
            pid,
            shareImageUrl: this.shareImageUrl,
            isStoreGoods: true,
            sharePage: 'ProductDetail',
            salePrice: this.pDetail.salePrice,
            discountPrice: this.pDetail.discountPrice,
            title: this.pDetail.title,
          });
          this.isChecked = false;
          return;
        }
        this.canvasImg = '';
        this.setState({
          qrCodeInfo: '',
          codeUrl: '',
        });
        this.shareToast = Toast.show('分享图片生成中...', {
          duration: 0,
          position: 0,
        });
        this.currentPid = pid;
        const { userId } =
          (await storage
            .load({
              key: 'userInfo',
            })
            .catch(e => e)) || {};
        this.setState({
          qrCodeInfo: `https://www.vxiaoke360.com/H5/mlsh-detail/index.html?id=${pid}&shareUserId=${userId}`,
        });
        const base64 = await this.getQRCode();
        if (!base64) {
          Toast.hide(this.shareToast);
          Toast.show('获取二维码失败');
          this.isChecked = false;
          this.currentPid = '';
          return;
        }
        this.pDetail = await getStorePrdDetail(pid);
        this.setState({
          codeUrl: base64,
        });
        this.canvasImg = await this.getCanvas();
        if (!this.canvasImg) {
          Toast.hide(this.shareToast);
          Toast.show('获取分享图失败');
          this.isChecked = false;
          this.currentPid = '';
          return;
        }
        this.shareImageUrl = await saveFile({ fileType: 'base64', file: this.canvasImg, location: 'cache' });
        navigation.navigate('DetailShare', {
          shareImg: this.canvasImg,
          imgArr: this.pDetail.images.map(item => item.value),
          sharePrice: this.pDetail.shareAwardPrice,
          pid,
          shareImageUrl: this.shareImageUrl,
          isStoreGoods: true,
          sharePage: 'ProductDetail',
          salePrice: this.pDetail.salePrice,
          discountPrice: this.pDetail.discountPrice,
          title: this.pDetail.title,
        });
        this.isChecked = false;
        this.currentPid = '';
        Toast.hide(this.shareToast);
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  // canvas图片写入
  loadedImg = image => new Promise(resolve => image.addEventListener('load', resolve));

  downloadImage = url => {
    return new Promise(resolve => {
      fetch_blob
        .config({
          fileCache: true,
        })
        .fetch('GET', url)
        // the image is now dowloaded to device's storage
        .then(resp => {
          // the image path you can use it directly with Image component
          return resp.readFile('base64');
        })
        .then(base64Data => {
          resolve(`data:image/jpeg;base64,${base64Data}`);
        });
    });
  };

  // canvas分享图
  handleCanvas = async canvas => {
    const { codeUrl } = this.state;
    const detailData = this.pDetail;
    if (!(canvas instanceof Object)) {
      return;
    }
    canvas.width = 375;
    canvas.height = 660;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 375, 480);

    ctx.fillStyle = '#F4F4F4';
    ctx.fillRect(0, 480, 375, 660);
    ctx.save();

    drawText(ctx, detailData.title, 25, '14px PingFangSC-Medium', '#333', 16, 28);
    ctx.save();

    ctx.fillStyle = '#FC4277';
    ctx.font = '12px PingFangSC-Semibold';
    ctx.fillText('￥', 16, 88);

    ctx.font = '26px PingFangSC-Semibold';
    ctx.fillText(detailData.discountPrice, 30, 88);
    ctx.fill();
    ctx.save();
    const quanX = detailData.discountPrice.indexOf('.') > 0 ? detailData.discountPrice.length * 25 + 15 : detailData.discountPrice.length * 25 + 20;
    const quanImage = new CanvasImage(canvas);
    if (detailData.couponPrice) {
      quanImage.src = base64img.img2;
    } else {
      quanImage.src = base64img.img3;
    }
    quanImage.addEventListener('load', () => {
      ctx.drawImage(quanImage, quanX, 74, 42, 16);
    });

    if (detailData.couponPrice) {
      const quanPriceImage = new CanvasImage(canvas);
      quanPriceImage.src = base64img.img4;
      quanPriceImage.addEventListener('load', () => {
        ctx.drawImage(quanPriceImage, 248, 70, 110, 32);
        ctx.fillStyle = '#fff';
        ctx.font = '16px PingFangSC-Medium';
        ctx.fillText(`￥${detailData.couponPrice}`, 293, 90);
        ctx.fill();
      });
    }
    ctx.save();

    ctx.fillStyle = '#999';
    ctx.font = '12px PingFangSC-Regular';
    ctx.fillText(`￥${detailData.salePrice}原价   销量${detailData.volume}`, 16, 108);
    ctx.fill();
    ctx.save();
    const productImage = new CanvasImage(canvas);
    productImage.src = await this.downloadImage(detailData.thumbnail);
    await this.loadedImg(productImage);
    ctx.drawImage(productImage, 16, 120, 343, 343);
    ctx.save();

    const priceLabel = new CanvasImage(canvas);
    priceLabel.src = base64img.img5;

    await this.loadedImg(priceLabel);
    ctx.drawImage(priceLabel, 180, 358, 188, 90);

    let qText = '';
    let qWidth = 264;
    if (detailData.couponPrice) {
      qText = '券后￥';
    } else {
      qText = '优惠价￥';
      qWidth = 280;
    }
    ctx.fillStyle = '#fff';
    ctx.font = '16px PingFangSC-Regular';
    ctx.fillText(qText, 216, 420);
    ctx.fill();
    ctx.save();
    ctx.font = '32px PingFangSC-Medium';
    ctx.fillText(detailData.discountPrice, qWidth, 420);
    ctx.fill();

    const codeImg = new CanvasImage(canvas);
    codeImg.src = codeUrl;

    await this.loadedImg(codeImg);
    ctx.drawImage(codeImg, 118, 490, 130, 130);
    ctx.save();

    ctx.font = '14px PingFangSC-Regular';
    ctx.fillStyle = '#666';
    ctx.fillText('长按识别二维码进入', 92, 648);
    ctx.fill();
    ctx.font = '14px PingFangSC-Medium';
    ctx.fillStyle = '#FC4277';
    ctx.fillText('米粒生活', 218, 648);
    ctx.fill();
    canvas.toDataURL('image/jpeg').then(async data => {
      this.canvasImg = data.substr(1, data.length - 2);
    });
  };

  jumpDetail = id => {
    this.props.navigation.navigate('OrderDetail', { id });
  };

  menuChange = (item, index) => {
    const { menus, isClick } = this.state;
    const menusArr = menus;
    menusArr.map(item => {
      item.active = false;
    });
    menusArr[index].active = true;
    const datas = {
      pageNo: 1,
      type: item.type,
    };
    if (isClick) {
      this.setState(
        {
          showEmpty: false,
          loadMoreText: '加载中...',
          menus: menusArr,
          list: [],
          params: datas,
          isClick: false,
          tabIndex: index,
        },
        () => {
          this.getStoreOrderList(datas);
        }
      );
    }
  };

  // 接口请求
  async getStoreOrderList(params) {
    const { list } = this.state;
    let loadMoreText = '';
    this.setState({ loadMoreText: '加载中' });
    let { pageNo } = params;
    const res = await getGoodsLists(params);
    if (res && res.length) {
      for (let i = 0; i < res.length; i++) {
        res[i].selected = false;
      }
      if (res.length > 9) {
        pageNo++;
        this.canLoadMore = true;
      } else {
        this.canLoadMore = false;
      }
      this.setState({
        list: [...this.state.list, ...res],
        params: {
          ...params,
          pageNo,
        },
        loadMoreText: res.length > 9 ? '加载中' : '—我是有底线的—',
      });
    } else {
      if (list.length > 0) {
        loadMoreText = '—我是有底线的—';
      } else {
        loadMoreText = '';
      }
      this.setState({ showEmpty: !(list.length > 0), loadMoreText });
    }
    this.setState({ isClick: true });
  }

  // 元素渲染
  _keyExtractor = (item, index) => `${index}`;

  loadingText = () => {
    const { loadMoreText } = this.state;
    return <Text style={styles.loadingText}>{loadMoreText}</Text>;
  };

  updateData = id => {
    const { list } = this.state;
    const newData = list.map(item => {
      if (item.id === id) {
        item.selected = !item.selected;
      } else {
        item.selected = false;
      }
      return item;
    });
    this.setState({
      list: newData,
    });
  };

  updateList = item => {
    const datas = {
      pageNo: 1,
      type: item.type,
    };
    this.setState({ list: [], params: datas }, () => this.getStoreOrderList(datas));
  };

  orderItem(item) {
    const { params, list } = this.state;
    return (
      <GoodsItem
        ref={this.bindRef}
        navigation={this.props.navigation}
        updateList={this.updateList}
        onPressShare={this.onPressShare}
        showModal={this.showModal}
        updateData={this.updateData}
        dataSource={list}
        listItem={item}
        params={params}
        getStoreOrderList={this.getStoreOrderList.bind(this)}
        init={this.init}
      />
    );
  }

  bindRef = ref => {
    this.child = ref;
  };

  showModal = (id, params) => {
    this.setState({ isDelteShop: true, NewId: id, isOut: params });
  };

  closeRule = () => {
    const { NewId } = this.state;
    this.child.oparate(NewId);
    this.setState({ isDelteShop: false });
  };

  entrueGo = params => {
    const { NewId } = this.state;
    if (params === 0) {
      this.child.goodsDelete(NewId);
    } else {
      this.child.soldsOuts(NewId);
    }
    this.setState({ isDelteShop: false });
  };

  emptyComponent() {
    const { showEmpty } = this.state;
    if (showEmpty) {
      return (
        <View style={styles.emptyWrap}>
          <Image style={styles.emptyImg} resizeMode="center" source={{ uri: 'http://family-img.vxiaoke360.com/no-order2.png' }} />
          <Text style={styles.emptyInfo}>暂无数据</Text>
        </View>
      );
    }
    return null;
  }

  renderMenus = () => {
    const { menus } = this.state;
    const arr = [];
    menus.map((item, index) => {
      arr.push(
        <View key={index} style={styles.tabWrap}>
          <Text onPress={() => this.menuChange(item, index)} style={[styles.tabs, item.active ? styles.tabActive : '']}>
            {item.name}
          </Text>
          {item.active && <View style={styles.tabIcon} />}
        </View>
      );
    });
    return arr;
  };

  render() {
    const { list, params, qrCodeInfo, isDelteShop, isOut } = this.state;
    const { isReview } = global;

    return (
      <View style={styles.container}>
        <View>
          <ScrollView contentContainerStyle={styles.scrollView} horizontal>
            {this.renderMenus()}
          </ScrollView>
        </View>
        {isDelteShop ? (
          <View style={styles.toastWrap}>
            <View style={styles.toastContentWrap}>
              <View style={styles.toastContent}>
                <Text style={styles.toastTitle}>{isOut === 0 ? '确定删除该商品吗？' : '确定下架该商品吗？'}</Text>
                <Text style={styles.toastTitle}>{isOut === 0 ? '商品删除后不可恢复！' : ''}</Text>
              </View>
              <View style={styles.bottomBtnWrap}>
                <TouchableOpacity onPress={() => this.closeRule()} style={{ ...styles.toastConfirm, borderRightWidth: 0.5, borderColor: '#DDD' }}>
                  <Text style={{ ...styles.toastConfirm, color: '#333' }}>取消</Text>
                </TouchableOpacity>
                {isOut === 0 ? (
                  <TouchableOpacity onPress={() => this.entrueGo(0)} style={styles.toastConfirm}>
                    <Text style={{ ...styles.toastConfirm }}>确认</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => this.entrueGo(1)} style={styles.toastConfirm}>
                    <Text style={{ ...styles.toastConfirm }}>确认</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ) : null}
        <View style={styles.orderWrap}>
          <FlatList
            style={styles.flatWrap}
            data={list}
            keyExtractor={this._keyExtractor}
            renderItem={({ item }) => this.orderItem(item)}
            onEndReachedThreshold={0.1}
            onEndReached={this.onFooterLoad}
            ListFooterComponent={() => this.loadingText()}
            ListEmptyComponent={() => this.emptyComponent()}
            refreshControl={<RefreshControl refreshing={false} onRefresh={this.onHeaderRefresh} title="加载中..." />}
          />
          {Boolean(qrCodeInfo) && (
            <View style={styles.qrCode}>
              <QRCode value={qrCodeInfo} logo={require('@assets/icon-mili.png')} getRef={c => (this.svg = c)} />
            </View>
          )}
          {this.state.codeUrl ? (
            <View style={styles.canvasWrap}>
              <Canvas ref={this.handleCanvas} />
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  orderWrap: {
    flex: 1,
  },
  flatWrap: {
    flex: 1,
  },
  loadingText: {
    lineHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
  },
  scrollView: {
    marginBottom: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: '100%',
  },
  tabWrap: {
    width: '33.33%',
    height: 42,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  tabIcon: {
    borderWidth: 1,
    borderColor: '#ea4457',
    width: 15,
  },
  tabs: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PingFangSC-Regular',
    marginBottom: 10,
    lineHeight: 24,
  },
  tabActive: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 26,
  },
  inputWrap: {
    padding: 12,
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  inputBox: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 19,
    height: 18,
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    height: 18,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  cancelWrap: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    width: 20,
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelIcon: {
    marginTop: -2,
  },
  qrCode: {
    position: 'absolute',
    zIndex: -1,
    opacity: 0,
  },
  canvasWrap: {
    position: 'absolute',
    zIndex: -1,
    opacity: 0,
  },
  emptyWrap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImg: {
    width: 150,
    height: 150,
    marginTop: 100,
  },
  emptyInfo: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
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
    width: 135,
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
