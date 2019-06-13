import { Dimensions, NetInfo } from 'react-native';
import deviceInfo from 'react-native-device-info';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const device = {};
device.deviceId = deviceInfo.getUniqueID();
device.userAgent = deviceInfo.getUserAgent();
device.deviceBrand = deviceInfo.getBrand();
device.platform = (device.deviceBrand === 'Apple' ? 2 : 1);
device.deviceType = (device.deviceBrand === 'Apple' ? 'IDFA' : 'IMEI');
device.deviceModel = deviceInfo.getModel();
device.systemVersion = deviceInfo.getSystemVersion();
device.systemName = deviceInfo.getSystemName().toLowerCase();
device.appVersion = deviceInfo.getVersion();
device.apnm = 'com.vxiaoke.ricelife.app';
device.appReadableVersion = deviceInfo.getReadableVersion();
NetInfo.getConnectionInfo().then((status) => {
  console.log('getConnectionInfo===', status);
  device.net = status.type;
});

const w2 = 375;
const h2 = 667;
const scale = Math.min(height / h2, width / w2);

console.log('device===Info：', device);
function scaleSize(size) {
  size = Math.round(size * scale + 0.5);
  return size;
}

export default {
  window: {
    width,
    height,
  },
  device,
  activeOpacity: 0.85,
  isSmallDevice: width < 375,
  scaleSize,
};
