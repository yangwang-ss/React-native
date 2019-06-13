import React, { Component } from 'react';
import {
  ScrollView, StatusBar, View, Text, StyleSheet,
} from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import QRCode from 'react-native-qrcode-svg';
import drawText from '../utils/drawText';

export default class CanvasList extends Component {
  state = {
    qrCode: '生活不止眼前的枸杞',
    title: '曲奇饼干爆浆软酱曲奇饼干 500g散装独立*30 盒装112g【包邮】',
    price: '19.9',
    quanPrice: '2.00',
    salePrice: '29.9',
    originalPrice: '29.9',
    saleNum: '2324',
    codeUrl: '',
    isShowQRcode: true,
  };

  componentDidMount() {
    this.getQRcode();
  }

  getQRcode = () => {
    let time = null;
    if (this.svg && this.svg.toDataURL) {
      clearTimeout(time);
      setTimeout(() => {
        this.getQrcodeUrl();
      }, 100);
    } else {
      time = setTimeout(() => {
        this.getQRcode();
      }, 1);
    }
  };

  loaded = image => new Promise(resolve => image.addEventListener('load', resolve));

  async handleCanvas(canvas) {
    const {
      title, price, quanPrice, originalPrice, saleNum, salePrice, codeUrl,
    } = this.state;
    canvas.width = 375;
    canvas.height = 660;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 375, 480);
    ctx.save();

    ctx.fillStyle = '#F4F4F4';
    ctx.fillRect(0, 480, 375, 660);
    ctx.save();

    const image = new CanvasImage(canvas);
    image.src = 'https://image.vxiaoke360.com/FinWWzlfd8MqKyrEQCqPs8ZGBZnG';
    image.addEventListener('load', () => {
      ctx.drawImage(image, 16, 16, 14, 14);
    });
    drawText(ctx, title, 27, '14px PingFangSC-Medium', '#333', 38, 28);
    ctx.save();

    ctx.fillStyle = '#FC4277';
    ctx.font = '12px PingFangSC-Semibold';
    ctx.fillText('￥', 16, 84);


    ctx.font = '26px PingFangSC-Semibold';
    ctx.fillText(price, 30, 84);
    ctx.fill();
    ctx.save();

    const quanX = price.length * 20;
    const quanImage = new CanvasImage(canvas);
    quanImage.src = 'https://image.vxiaoke360.com/Ftw7AdGaaraQToj-1R7STc-EjeRg';
    quanImage.addEventListener('load', () => {
      ctx.drawImage(quanImage, quanX, 70, 42, 16);
    });

    const quanPriceImage = new CanvasImage(canvas);
    quanPriceImage.src = 'https://image.vxiaoke360.com/Fp8BgDo_R4r9W5qsmTKiTpfJVJ-8';
    quanPriceImage.addEventListener('load', () => {
      ctx.drawImage(quanPriceImage, 248, 63, 110, 32);
      ctx.fillStyle = '#fff';
      ctx.font = '16px PingFangSC-Medium';
      ctx.fillText(`￥${quanPrice}`, 290, 86);
      ctx.fill();
    });
    ctx.save();

    ctx.fillStyle = '#999';
    ctx.font = '12px PingFangSC-Regular';
    ctx.fillText(`￥${originalPrice}原价   月销${saleNum}`, 16, 108);
    ctx.fill();
    ctx.save();

    const productImage = new CanvasImage(canvas);
    productImage.src = 'https://img.alicdn.com/i2/3177163478/O1CN01aEbfBh1bYy07kC9mY_!!3177163478.jpg';

    const priceLabel = new CanvasImage(canvas);
    priceLabel.src = 'https://image.vxiaoke360.com/Fs4-JhfATTPyIx1OKMm0Vn94KCrI';

    await this.loaded(productImage);
    ctx.drawImage(productImage, 16, 120, 343, 343);

    await this.loaded(priceLabel);
    ctx.drawImage(priceLabel, 180, 358, 188, 90);

    ctx.fillStyle = '#fff';
    ctx.font = '16px PingFangSC-Regular';
    ctx.fillText('券后￥', 216, 420);
    ctx.fill();
    ctx.save();
    ctx.font = '32px PingFangSC-Medium';
    ctx.fillText(salePrice, 264, 420);
    ctx.fill();

    const codeImg = new CanvasImage(canvas);
    codeImg.src = codeUrl;
    codeImg.addEventListener('load', () => {
      ctx.drawImage(codeImg, 118, 490, 130, 130);
    });
    ctx.save();

    ctx.font = '14px PingFangSC-Regular';
    ctx.fillStyle = '#666';
    ctx.fillText('长按识别二维码进入', 92, 648);
    ctx.fill();
    ctx.font = '14px PingFangSC-Medium';
    ctx.fillStyle = '#FC4277';
    ctx.fillText('米粒生活', 218, 648);
    ctx.fill();

    canvas.toDataURL('image/jpeg')
      .then((data) => {
        // data = data.substring(1);
        // data = data.slice(0, -1);
        //
        // if (data.indexOf('data:image/jpeg;base64,') > -1) {
        //   data = data.substring(23);
        // }
        // console.log(data,66666)
        // RNFetchBlob.fs.writeFile(this.path, data, 'base64')
        //            .then(() => {
        //            })
      });
  }

  getQrcodeUrl = () => {
    if (this.svg && this.svg.toDataURL) {
      this.svg.toDataURL(this.qrcodeCallback);
    }
  };

  qrcodeCallback = (dataURL) => {
    this.setState({
      codeUrl: `data:image/jpeg;base64,${dataURL}`,
      isShowQRcode: false,
    });
    return dataURL;
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <ScrollView>
          {
            this.state.codeUrl ? <Canvas ref={this.handleCanvas.bind(this)} /> : null
          }
          {
            this.state.isShowQRcode ? (
              <View style={styles.qrCode}>
                <QRCode
                  value={this.state.qrCode}
                  logo={{ uri: 'https://image.vxiaoke360.com/Frp8d5ZGj9Zi9GoxWSlLrYYGdp_W' }}
                  getRef={c => (this.svg = c)}
                />
              </View>
            ) : null
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  qrCode: {
    position: 'absolute',
    zIndex: -1,
    opacity: 0,
  },
});
