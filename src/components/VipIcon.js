import React from 'react';
import { Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  vipWrapImg: {
    width: 54,
    height: 17,
    backgroundColor: '#fff',
  },
  vipWrapImgSize1: {
    width: 63,
    height: 19,
  },
  vipWrapImgSize2: {
    width: 67,
    height: 16,
  },
  serviceSize: {
    width: 83,
    height: 20,
  },
});

export default class VipIcon extends React.Component {
  renderType = type => {
    const vipTypeIcon = [
      'https://image.vxiaoke360.com/VIP.png',
      'https://image.vxiaoke360.com/FmhbPCbcSxjq16F8BsxB-W6A8WZc',
      'https://image.vxiaoke360.com/FimWmrLBegY4wYdYPJ2JQSp9JSBx',
      'https://image.vxiaoke360.com/FvJQy6ewyLP2hMHp2Rwui_zCnGV7',
      'https://image.vxiaoke360.com/FmWlSutR5KonM5cCljZcxL2V6luO',
      'https://image.vxiaoke360.com/basic-servicer-provider.png',
      'https://image.vxiaoke360.com/FqEduZPte_1cQdr0Z310t9wSTNB3',
      'https://image.vxiaoke360.com/icon-province-service.png',
      'https://image.vxiaoke360.com/FrsTf0pSz4MXsCSqgCwipMwvrwQr',
      // 'https://image.vxiaoke360.com/FiEvdPzQPaGaKxxGiRvYzoZy64fH',
      // 'https://image.vxiaoke360.com/Fvs1NZ1ufXmFp8QwXT65su4EJSSN',
      // 'https://image.vxiaoke360.com/FqO_tkGmbyfjIpKOulA8px59B0pF',
    ];
    switch (type) {
      case '会员': // 会员
        return vipTypeIcon[0];
        break;
      case '合伙人': // 合伙人
        return vipTypeIcon[1];
        break;
      case '高级合伙人': // 高级合伙人
        return vipTypeIcon[2];
        break;
      case '超级合伙人': // 超级合伙人
        return vipTypeIcon[3];
        break;
      case '普通会员': // 普通会员
        return vipTypeIcon[4];
        break;
      case '基础服务商': // 基础服务商
        return vipTypeIcon[5];
        break;
      case '城市服务商': // 城市服务商
        return vipTypeIcon[6];
        break;
      case '省级服务商': // 省级服务商
        return vipTypeIcon[7];
        break;
      case '店长': // 店长
        return vipTypeIcon[8];
        break;
      default:
        return vipTypeIcon[4];
    }
  };

  render() {
    const { roleId, levelName } = this.props;
    return <Image source={{ uri: this.renderType(levelName) }} style={[styles.vipWrapImg, roleId == 0 && styles.vipWrapImgSize1, roleId > 40 && styles.vipWrapImgSize2]} />;
  }
}
