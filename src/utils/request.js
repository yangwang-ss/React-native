import deviceInfo from 'react-native-device-info';
import Toast from 'react-native-root-toast';
import axios from 'axios';
import NavigationService from './navigationService';
import updateVersion from '../actions/updateVersion';

import { version } from '../../package';
import store from '../store/configureStore';

const device = {};
device.deviceId = deviceInfo.getUniqueID();
device.userAgent = deviceInfo.getUserAgent();
device.deviceBrand = deviceInfo.getBrand();
device.platform = device.deviceBrand === 'Apple' ? 2 : 1;
device.deviceModel = deviceInfo.getModel();
// device.systemVersion = deviceInfo.getSystemVersion();
// device.appVersion = deviceInfo.getVersion();
// device.appReadableVersion = deviceInfo.getReadableVersion();

// const host = 'http://192.168.20.36:8080';
// const host = 'http://192.168.10.119:8080';
// const host = 'http://192.168.20.110:8080'
// const host = 'http://192.168.10.105:8080';
// const host = 'http://192.168.20.52:8080'
// const host = 'http://192.168.10.122:8080'
// const host = 'http://47.96.129.233:8080'
// const host = 'http://test.vxiaoke360.com:9083';
// const host = 'https://testfamilyapi.vxiaoke360.com';
const host = 'https://testfamilyapi.vxiaoke360.com';
// const host = 'https://familyapi.vxiaoke360.com';
export default async function Request(url, options = {}) {
  // const beginTime = new Date().getTime()
  const { method = 'GET', headers, data } = options;
  const { token } =
    (await storage
      .load({
        key: 'token',
      })
      .catch(e => e)) || {};
  const { alias = '' } =
    (await storage
      .load({
        key: 'userInfo',
      })
      .catch(e => e)) || {};
  const { godUrl } =
    (await storage
      .load({
        key: 'globalHost',
      })
      .catch(e => e)) || {};
  const newHeaders = {
    ...headers,
    ...{
      Accept: 'application/json',
      // 媒体格式类型key/value格式
      Connection: 'keep-Alive',
      'Content-Type': 'application/json; charset=utf-8',
      ...device,
      token,
      version,
      alias,
    },
  };
  // console.log('newHeaders', newHeaders);
  let newOptions = {
    headers: newHeaders,
  };
  // console.log('newOptions', newOptions);
  if (data) {
    newOptions = {
      ...newOptions,
      data: JSON.stringify(data),
    };
  }
  return new Promise(resolve => {
    axios({
      url: (godUrl || host) + url,
      method,
      ...newOptions,
    })
      .then(({ data: responseJson }) => {
        // 拿到上面的转好的json
        console.log(url, responseJson);
        if (responseJson.code === 200) {
          // 200为请求成功
          // const endTime = new Date().getTime()
          // console.log('时间差距', (endTime - beginTime) / 1000)
          resolve(responseJson.data);
        } else {
          if (responseJson.code === 1005 || responseJson.code === 1035) {
            if (responseJson.msg) {
              Toast.show(responseJson.msg, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
              });
            }
            return resolve(responseJson);
          }
          if (responseJson.code === 1000 || responseJson.code === 1001) {
            storage.remove({
              key: 'token',
            });
            NavigationService.navigate('Auth');
            return resolve(false);
          }
          if (responseJson.code === 1016) {
            NavigationService.navigate('Invitation');
          } else if (responseJson.code === 404) {
            NavigationService.navigate('NetwokErr');
          } else if (responseJson.code === 1020) {
            store.dispatch(
              updateVersion({
                status: 2,
                msg: responseJson.data.content,
                url: responseJson.data.downloadUrl,
              })
            );
            return resolve(false);
          } else if (responseJson.code === 2001) {
            // 门店商品不存在操作
            NavigationService.navigate('Shop');
            resolve(false);
          } else if (responseJson.code === 1101) {
            // 提现时判断是否绑定微信
            resolve(responseJson);
          }
          if (responseJson.msg) {
            Toast.show(responseJson.msg, {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            });
          }
          console.log(responseJson.msg); // 可以处理返回的错误信息
          resolve(false);
        }
      })
      .catch(e => {
        console.log(e);
        resolve(false);
      });
  });
}
