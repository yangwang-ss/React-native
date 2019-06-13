import React from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, Image, TouchableOpacity, Dimensions, PanResponder, Animated, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { BoxShadow } from 'react-native-shadow';
import { qiniuToken, shopAddGoods, shopEditGoods, getCommisionByRole, editGoodsD } from '@api';
import ImagePicker from 'react-native-image-crop-picker';
import { QNEngine } from 'react-native-qiniu-uploader/QNEngine';
import Toast from 'react-native-root-toast';
import DraggableImage from './DraggableImage';
import DraggableImage2 from './DraggableImage';
import ToastConfirm from '@components/ToastConfirm';
import UUIDGenerator from 'react-native-uuid-generator';
import Layout from '../../constants/Layout'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { width, height } = Dimensions.get('window');
const fontFamily = 'PingFangSC-Regular';
const imgShadowValue = {
  width: Layout.window.width - 40,
  height: 40,
  color: '#FC4277',
  border: 1,
  opacity: 0.08,
  radius: 24,
  x: 2,
  y: 6,
  style: { position: 'absolute', left: 0, top: 0 },
};
const styles = StyleSheet.create({
  containWrap: {
    backgroundColor: '#f4f4f4',
  },
  item: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EFEFEF',
    backgroundColor: '#fff',
  },
  label: {
    width: 120,
    paddingLeft: 16,
  },
  labelText: {
    fontFamily,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily,
    fontSize: 16,
    color: '#333',
  },
  conItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  conImg: {
    width: 24,
    height: 24,
  },
  conText: {
    fontFamily,
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  btn1: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#FC4277',
    borderRadius: 4,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    marginRight: 12,
  },
  btn1Text: {
    fontFamily,
    fontSize: 14,
    color: '#FC4277',
  },
  mainImgWrap: {
    marginTop: 8,
    backgroundColor: '#fff',
  },
  title: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EFEFEF',
    paddingLeft: 16,
  },
  mainImg: {
    width: (width - 32) / 3,
    height: (width - 32) / 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    marginBottom: 4,
  },
  imgDetail: {
    width: (width - 32) / 3,
    height: 138,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  imgs: {
    flex: 1,
    paddingTop: 16,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  titleText1: {
    fontFamily,
    fontSize: 16,
    color: '#333',
    lineHeight: 18,
  },
  titleText2: {
    fontFamily,
    fontSize: 12,
    color: '#999',
    marginLeft: 2,
    lineHeight: 14,
  },
  submit: {
    height: 48,
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 32,
    marginBottom: 35,
    backgroundColor: '#FC4277',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  submitText: {
    fontFamily,
    fontSize: 18,
    color: '#fff',
  },
});

export default class Index extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title || '添加商品',
  });

  state = {
    pInfo: {
      distribution: 0, // 0到店自提 1送货上门
      status: 1, // 1上架 0下架
      isRecommend: 1, // 1推荐 0否
      sort: 0,
      couponPrice: 0,
      thumbnails: '',
      imgs: '',
      id: '',
      title: '',
      salePrice: '',
      commissionRate: '',
      stock: '',
    },
    imgs: [], // 详情图
    thumbnails: [], // 主图
    isScroll: true,
    showToast: false,
    hideCancel: false,
    toastWords: '',
    isEdit: false,
    // top: '20%',
    wrapPaddingHeight: 0
  };

  componentDidMount = async () => {
    this.token = await qiniuToken();
    this.thumbnailsArr = [];
    this.imgsArr = [];
    this.pid = this.props.navigation.getParam('pid')
    if (this.pid) {
      // 编辑商品
      this.getGoodsDetail()
    }
    QNEngine.eventEmitter({
      onProgress: data => {
        console.log('开始上传',data.percent);
      },
      onComplete: data => {
        console.log('上传完成', data);
      },
      onError: data => {
        console.log(data);
        switch (data.code) {
          case '-2':
            Toast.show('任务已暂停', 2);
            break;
          default:
            Toast.show(`错误：${data.msg}`, 2);
            break;
        }
      },
    });

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this._keyboardHandle(true));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this._keyboardHandle(false));
  };

  componentWillUnmount() {
    QNEngine.removeEmitter();
  }
  _keyboardHandle = (isShow) => {
    this.setState({
      wrapPaddingHeight: isShow ? 180 : 0
    })
  }
  uploadImage = (imgInfo, index, type) => {
    console.log('上传图片')
    UUIDGenerator.getRandomUUID().then((uuid) => {
      type === 'main' ? this.thumbnailsArr.push({path: `https://image.vxiaoke360.com/${uuid}`, sort: index}) : this.imgsArr.push({path: `https://image.vxiaoke360.com/${uuid}`, sort: index})
      const params = {
        filePath: imgInfo.path,
        upKey: uuid,
        upToken: this.token,
        zone: 1,
      };
      QNEngine.setParams(params);
      QNEngine.startTask();
    });
  };

  addImage = type => {
    ImagePicker.openPicker({
      // multiple: true,
      mediaType: 'photo',
      width: 640,
      height: type === 'main' ? 640 : 819,
      cropping: true,
      cropperChooseText: '确定',
      cropperCancelText: '取消'
    })
      .then(result => {
        const { thumbnails, imgs } = this.state;
        const images = [result]
        if (images.length > 0) {
          if (type === 'main') {
            thumbnails.push(
              ...images.map((item, index) => {
              let len = images.length > 1 ?  thumbnails.length + 1 + index : thumbnails.length + 1;
                this.uploadImage(item, len, type);
                return {
                  path: item.path,
                  sort: len,
                };
              })
            );
            this.setState({
              thumbnails,
            });
          } else {
            imgs.push(
              ...images.map((item, index) => {
                let len = images.length > 1 ?  imgs.length + 1 + index : imgs.length + 1;
                this.uploadImage(item, len, type);
                return {
                  path: item.path,
                  sort: len,
                };
              })
            );
            this.setState({
              imgs,
            });
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  handleInput = (obj, val) => {
    const regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
    if (val && val.match(regRule)) {
      this.showToast('禁止输入表情符')
      return
    }
    const { pInfo } = this.state;
    const params = {
      ...pInfo,
      ...obj,
    };
    // console.log('57890-----', params);
    this.setState({
      pInfo: params,
    });
  };

  checkSubmit = (e)=> {
    const {
      pInfo: { title, salePrice, commissionRate, stock, sort, couponPrice },
    } = this.state;
    if (!title) {
      this.showToast('请填写商品名称');
      return;
    }
    if (!salePrice) {
      this.showToast('请填写商品销售价格');
      return;
    }
    if (salePrice && String(salePrice).indexOf(".") > 0 && String(salePrice).split(".")[1].length > 2) {
      this.showToast('商品销售价格最多为两位小数');
      return;
    }
    if (stock <= 0) {
      this.showToast('请填写商品库存');
      return;
    }
    // if (String(stock).indexOf(".") > 0) {
    //   this.showToast('商品库存需要为整数');
    //   return;
    // }
    // if (String(sort).indexOf(".") > 0 ) {
    //   this.showToast('排序需要为整数');
    //   return;
    // }
    // if (String(couponPrice).indexOf(".") > 0 ) {
    //   this.showToast('优惠券金额需要为整数');
    //   return;
    // }
    if (!this.thumbnailsArr.length) {
      this.showToast('请上传商品主图');
      return;
    }
    if (!this.imgsArr.length) {
      this.showToast('请上传商品详情图');
      return;
    }
    // if (String(commissionRate).indexOf(".") > 0 ) {
    //   this.showToast('佣金比例需要为整数');
    //   return;
    // }
    if (Number(commissionRate) >= 100) {
      this.showToast('佣金比例不能大于100');
      return;
    }
    if (commissionRate >= 50 && e !== 'submit') {
      this.setState({
        toastWords: '佣金比例过高',
        hideCancel: false,
        showToast: true,
        // top: '60%'
      })
      return;
    }

    function sortArr(a, b) {
      return a.sort - b.sort
    }
    let imgStr1 = [], imgStr2 = [];

    this.thumbnailsArr.sort(sortArr)
    this.imgsArr.sort(sortArr)

    console.log('this.thumbnails===', this.thumbnailsArr, this.imgsAr)
    this.thumbnailsArr.map((item, index) => {
      imgStr1.push(item.path)
    })

    this.imgsArr.map((item, index) => {
      imgStr2.push(item.path)
    })

    const params = {
      ...this.state.pInfo,
      thumbnails: imgStr1.join(","),
      imgs: imgStr2.join(",")
    }
    console.log('========', params);
    this.setState({
      pInfo: params
    }, ()=> {
      if (this.pid) {
        this.editGoods()
      } else {
        this.addGoods()
      }
    })
  }

  async addGoods() {
    const { pInfo } = this.state;
    console.log('提交白哦单', pInfo)
    const res = await shopAddGoods(pInfo);
    if (res) {
      this.setState({
        pInfo: {
          distribution: 0,
          status: 1,
          isRecommend: 1,
          sort: 0,
          couponPrice: 0,
          thumbnails: '',
          imgs: '',
          id: '',
          title: '',
          salePrice: '',
          commissionRate: '',
          stock: '',
        },
        thumbnails: [],
        imgs: []
      })
      this.showToast('上传商品成功');
      this.props.navigation.state.params.refresh();
      this.props.navigation.goBack();
    }
  }
  async getGoodsDetail() {
    const res = await editGoodsD(this.pid)
    if (res) {
      let arr1 = [], arr2 = [];
       res.thumbnails.map((item, index) => {
        arr1.push({ path: item, sort: index + 1 })
       })
       res.imgs.map((item, index) => {
        arr2.push({ path: item, sort: index + 1 })
       })
      this.setState({
        isEdit: true,
        pInfo: {
          ...res
        },
        thumbnails: [...arr1],
        imgs: [...arr2],
      })
      this.thumbnailsArr = [...arr1]
      this.imgsArr = [...arr2]
    }
  }
  async editGoods() {
    const res = await shopEditGoods(this.state.pInfo)
    console.log('编辑商品', res)
    if (res) {
      this.setState({
        pInfo: {
          distribution: 0,
          status: 1,
          isRecommend: 1,
          sort: '',
          couponPrice: '',
          thumbnails: '',
          imgs: '',
          id: '',
          title: '',
          salePrice: '',
          commissionRate: '',
          stock: '',
        },
        thumbnails: [],
        imgs: [],
    })
    this.pid = '';
    this.showToast('修改成功')
    this.props.navigation.state.params.refresh();
    this.props.navigation.goBack();
    }
  }

  async getCommision() {
    const { pInfo: {salePrice, couponPrice, commissionRate} } = this.state
    if (!salePrice) {
      this.showToast('请填写销售价')
      return
    }
    if (!(commissionRate >= 0)) {
      this.showToast('请填写佣金比例')
      return
    }
    const data = {
      salePrice,
      couponPrice,
      commissionRate,
    }
    const res = await getCommisionByRole(data);
    if (res) {
      const text = `会员: ${res[0]}\nVIP: ${res[30]}\n合伙人: ${res[40]}`;
      this.setState({
        toastWords: text,
        showToast: true,
        hideCancel: true,
        // top: '20%',
      })
    }
  }

  confirmBtn = (type)=> {
    console.log('9999===', type);
    if (!type) {
      this.checkSubmit('submit')
    }
    this.setState({
      showToast: false,
    })
  }

  cancelBtn = ()=> {
    this.setState({
      showToast: false,
    })
  }

  showToast(str) {
    Toast.show(str, {
      duration: 2000,
      position: 0,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  }

  changeSort = (val, index, type) => {
    const { thumbnails, imgs } = this.state;
    if (type === 'main') {
      thumbnails[index].sort = val;
      this.thumbnailsArr[index].sort = val;
      console.log('this.thumbnails===', index,  this.thumbnailsArr)
      this.setState({
        thumbnails,
      })
    } else {
      imgs[index].sort = val;
      this.imgsArr[index].sort = val;
      console.log('this.imgsArr===', this.imgsArr)
      this.setState({
        imgs,
      })
    }
  }

  deleteImg = (index, type)=> {
    const { thumbnails, imgs } = this.state;
    if (type === 'main') {
      thumbnails.splice(index, 1)
      this.thumbnailsArr.splice(index, 1)
      thumbnails.map((item, index) => {
        item.sort = index + 1
      })
      this.thumbnailsArr.map((item, index) => {
        item.sort = index + 1
      })
      this.setState({
        thumbnails,
      })
    } else {
      imgs.splice(index, 1)
      this.imgsArr.splice(index, 1)
      imgs.map((item, index) => {
        item.sort = index + 1
      })
      this.imgsArr.map((item, index) => {
        item.sort = index + 1
      })
      this.setState({
        imgs,
      })
    }
  }

  renderItem = (item, index) => {
    const { thumbnails } = this.state;
    if (thumbnails[index]) {
      return <DraggableImage _scrollToInput={this._scrollToInput} index={index} key={index} item={thumbnails[index]} type="main" deleteImg={this.deleteImg} changeSort={this.changeSort}/>;
    }
    if (thumbnails.length >= 9) {
      return null;
    }
    if (!thumbnails[index] && (thumbnails[index - 1] || index - 1 < 0)) {
      return (
        <TouchableOpacity key={index} style={[styles.mainImg, { borderWidth: 1, borderColor: '#F4F4F4' }]} onPress={() => this.addImage('main')}>
          <Icon name="plus" size={36} color="#E8E8E8" />
        </TouchableOpacity>
      );
    }
    return <View key={index} style={[styles.mainImg, { opacity: 0 }]} />;
  };

  renderItem2 = (item, index) => {
    const { imgs } = this.state;
    if (imgs[index]) {
      return <DraggableImage2 _scrollToInput={this._scrollToInput} index={index} key={index} item={imgs[index]} height={138} type="detail" deleteImg={this.deleteImg} changeSort={this.changeSort}/>;
    }
    if (imgs.length >= 21) {
      return null;
    }
    if (!imgs[index] && (imgs[index - 1] || index - 1 < 0)) {
      return (
        <TouchableOpacity key={index} style={[styles.imgDetail, { borderWidth: 1, borderColor: '#F4F4F4' }]} onPress={() => this.addImage('detail')}>
          <Icon name="plus" size={36} color="#E8E8E8" />
        </TouchableOpacity>
      );
    }
    return <View key={index} style={[styles.imgDetail, { opacity: 0 }]} />;
  };

  _scrollToInput = (reactNode: any) => {
    this.scroll.props.scrollToFocusedInput(reactNode)
  }

  render() {
    const {
      thumbnails,
      imgs,
      isScroll,
      pInfo: {
        distribution,
        status,
        isRecommend,
        couponPrice,
        sort,
        title,
        salePrice,
        commissionRate,
        stock, },
      showToast,
      toastWords,
      hideCancel,
      isEdit,
      // top,
      wrapPaddingHeight
    } = this.state;
    return (
      <View style={{flex: 1}}>
        <KeyboardAwareScrollView contentContainerStyle={{paddingBottom: wrapPaddingHeight}} style={styles.containWrap} scrollEnabled={!showToast} innerRef={ref => {
          this.scroll = ref
        }}>
          <View style={styles.item}>
            <View style={styles.label}>
              <Text style={styles.labelText}>商品名称</Text>
            </View>
            <View style={styles.content}>
              <TextInput style={styles.input} value={title} placeholder="请输入商品名称" maxLength={30} onChangeText={e => this.handleInput({ title: e }, e)} />
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.label}>
              <Text style={styles.labelText}>销售价</Text>
            </View>
            <View style={styles.content}>
              <TextInput style={styles.input} value={String(salePrice)} keyboardType="numeric" placeholder="请输入销售价(单位：元)" onChangeText={e => this.handleInput({ salePrice: e.replace(/[^0-9-\.]+/, "") }, e)} />
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.label}>
              <Text style={styles.labelText}>库存</Text>
            </View>
            <View style={styles.content}>
              <TextInput style={styles.input} value={String(stock) || ''} keyboardType="numeric" placeholder="请输入库存" onChangeText={e => this.handleInput({ stock: e.replace(/[^0-9-]+/, "") }, e)} />
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.label}>
              <Text style={styles.labelText}>排序</Text>
            </View>
            <View style={styles.content}>
              <TextInput style={styles.input} value={String(sort) || ''} keyboardType="numeric" placeholder="数字越大商品越靠前" onChangeText={e => this.handleInput({ sort: e.replace(/[^0-9-]+/, "") }, e)} />
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.label}>
              <Text style={styles.labelText}>送货方式</Text>
            </View>
            <View style={styles.content}>
              <TouchableOpacity style={styles.conItem} onPress={() => this.handleInput({ distribution: 0 })}>
                <Image style={styles.conImg} source={distribution === 0 ? require('@assets/icon-selected.png') : require('@assets/icon-unselected.png')} />
                <Text style={styles.conText}>到店自提</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.conItem} onPress={() => this.handleInput({ distribution: 1 })}>
                <Image style={styles.conImg} source={distribution === 1 ? require('@assets/icon-selected.png') : require('@assets/icon-unselected.png')} />
                <Text style={styles.conText}>门店配送</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.label}>
              <Text style={styles.labelText}>优惠券金额</Text>
            </View>
            <View style={styles.content}>
              <TextInput style={styles.input} keyboardType="numeric" value={String(couponPrice) || ''} placeholder="请输入优惠券金额(单位：元)" onChangeText={e => this.handleInput({ couponPrice: e.replace(/[^0-9-]+/, "") }, e)} />
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.label}>
              <Text style={styles.labelText}>佣金比例(%)</Text>
            </View>
            <View style={styles.content}>
              <TextInput style={styles.input} keyboardType="numeric" value={String(commissionRate)} placeholder="请输入佣金比例" onChangeText={e => this.handleInput({ commissionRate: e.replace(/[^0-9-]+/, "") }, e)} />
              <TouchableOpacity style={styles.btn1}  onPress={()=> this.getCommision()}>
                <Text style={styles.btn1Text}>用户佣金收益</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.label}>
              <Text style={styles.labelText}>状态</Text>
            </View>
            <View style={styles.content}>
              <TouchableOpacity style={styles.conItem} onPress={() => this.handleInput({ status: 1 })}>
                <Image style={styles.conImg} source={status === 1 ? require('@assets/icon-selected.png') : require('@assets/icon-unselected.png')} />
                <Text style={styles.conText}>上架</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.conItem} onPress={() => this.handleInput({ status: 0 })}>
                <Image style={styles.conImg} source={status === 0 ? require('@assets/icon-selected.png') : require('@assets/icon-unselected.png')} />
                <Text style={styles.conText}>下架</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.label}>
              <Text style={styles.labelText}>是否推荐</Text>
            </View>
            <View style={styles.content}>
              <TouchableOpacity style={styles.conItem} onPress={() => this.handleInput({ isRecommend: 1 })}>
                <Image style={styles.conImg} source={isRecommend === 1 ? require('@assets/icon-selected.png') : require('@assets/icon-unselected.png')} />
                <Text style={styles.conText}>是</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.conItem} onPress={() => this.handleInput({ isRecommend: 0 })}>
                <Image style={styles.conImg} source={isRecommend === 0 ? require('@assets/icon-selected.png') : require('@assets/icon-unselected.png')} />
                <Text style={styles.conText}>否</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mainImgWrap}>
            <View style={styles.title}>
              <Text style={styles.titleText1}>商品主图</Text>
              <Text style={styles.titleText2}>(建议尺寸：640*640，输入数字可调整图片顺序)</Text>
            </View>
            <View style={styles.imgs}>
              {[...Array(3 * ((thumbnails.length % 3 > 0 ? parseInt(thumbnails.length / 3) : parseInt(thumbnails.length / 3) * 1) + 1))].map((item, index) => this.renderItem(item, index))}
            </View>
          </View>
          <View style={styles.mainImgWrap}>
            <View style={styles.title}>
              <Text style={styles.titleText1}>商品详情</Text>
              <Text style={styles.titleText2}>(建议尺寸：640*819，输入数字可调整图片顺序)</Text>
            </View>
            <View style={styles.imgs}>
              {/* <View style={[styles.imgDetail, { borderWidth: 1, borderColor: '#F4F4F4' }]}>
                <Icon name="plus" size={36} color="#E8E8E8" />
              </View>
              <View style={[styles.imgDetail, { opacity: 0 }]} />
              <View style={[styles.imgDetail, { opacity: 0 }]} /> */}
              {[...Array(3 * ((imgs.length % 3 > 0 ? parseInt(imgs.length / 3) : parseInt(imgs.length / 3) * 1) + 1))].map((item, index) => this.renderItem2(item, index))}
            </View>
          </View>
          <TouchableOpacity style={styles.submit} activeOpacity={0.8} onPress={() => this.checkSubmit()}>
            <BoxShadow setting={imgShadowValue} />
            <Text style={styles.submitText}>{isEdit ? '编辑' : '添加'}</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        {
          showToast ? <ToastConfirm confirm={this.confirmBtn} cancel={()=> this.cancelBtn()} hideCancel={hideCancel} words={toastWords}/> : null
        }
      </View>
    );
  }
}
