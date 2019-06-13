import RNAlibcSdk from 'react-native-alibc-sdk';
import Toast from 'react-native-root-toast';
import { isTbAuth, appErrorLog, refreshUserInfo } from '../services/api';

export default function({ navigation }) {
  return new Promise(async resolve => {
    let { isParent } =
      (await storage
        .load({
          key: 'userInfo',
        })
        .catch(e => e)) || {};
    const { token } =
      (await storage
        .load({
          key: 'token',
        })
        .catch(e => e)) || {};
    if (!isParent) {
      const res = await refreshUserInfo();
      if (res && res.isParent) {
        isParent = res.isParent;
        await storage.save({
          key: 'userInfo',
          data: res,
        });
      }
    }
    if (token && isParent) {
      // 先从本地获取授权信息
      const authObj =
        (await storage
          .load({
            key: 'tbAuth',
          })
          .catch(e => e)) || {};
      let isAuth = true;
      let tbUrl = '';
      // 本地授权信息存在，直接赋值
      if (authObj && authObj instanceof Object && !authObj.message) {
        isAuth = authObj.isAuth;
        tbUrl = authObj.url;
      } else {
        // 不存在 从接口获取
        const newAuthObj = await isTbAuth();
        isAuth = newAuthObj.isAuth;
        tbUrl = newAuthObj.url;
        storage.save({
          key: 'tbAuth',
          data: newAuthObj,
        });
      }
      // 这里 true 表示需要授权，false 表示已授权
      if (isAuth) {
        const isLogin = await new Promise(resolve => {
          RNAlibcSdk.isLogin((err, isLogin) => {
            if (!err) {
              resolve(isLogin);
            }
          });
        });
        // 判断是否进行了百川授权
        if (!isLogin) {
          RNAlibcSdk.login(err => {
            if (!err) {
              navigation.push('WebView', { title: '应用授权', src: tbUrl });
            } else if (err.code === 1004) {
              Toast.show('授权已取消！');
            } else {
              appErrorLog(err);
              Toast.show('授权失败，请稍后重试！');
            }
          });
        } else {
          // 进入淘宝H5授权阶段
          navigation.push('WebView', { title: '应用授权', src: tbUrl });
        }
        resolve(false);
        return;
      }
      resolve(true);
    } else if (token && !isParent) {
      if (isParent === undefined || isParent === null) {
        storage.remove({
          key: 'token',
        });
        navigation.navigate('Auth');
        resolve(false);
        return;
      }
      navigation.navigate('Invitation');
      resolve(false);
    } else {
      navigation.navigate('Auth');
      resolve(false);
    }
  });
}
