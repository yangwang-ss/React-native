import RNFetchBlob from 'rn-fetch-blob';
import { Platform, CameraRoll, PermissionsAndroid } from 'react-native';

/**
 * 网络图转本地图
 * @param {保存路径} path
 * @param {图片地址} file
 */
function remoteUrlToLocalPath(path, file) {
  return new Promise(resolve => {
    RNFetchBlob.config({
      path: `${path}/mili_img_${Date.parse(new Date())}.jpeg`,
    })
      .fetch('GET', file)
      .then(res => {
        resolve(res.path());
      })
      .catch(() => {
        resolve(false);
      });
  });
}
/**
 * 保存到相册
 * @param {} file
 */
function saveAlbum(file) {
  return new Promise(resolve => {
    CameraRoll.saveToCameraRoll(file)
      .then(result => {
        resolve(result);
      })
      .catch(() => {
        resolve(false);
      });
  });
}
/**
 * base64转图片
 */
function base64ToLocalPath(path, img) {
  return new Promise(resolve => {
    const { fs } = RNFetchBlob;
    const imageDatas = img.split('data:image/jpeg;base64,');
    const imageData = imageDatas[1] || imageDatas[0];
    const filePath = `${path}/shareImg${Date.parse(new Date())}.jpeg`;
    fs.createFile(filePath, imageData, 'base64')
      .then(() => {
        resolve(filePath);
      })
      .catch(() => {
        resolve(false);
      });
  });
}
export default function({ fileType, file, location }) {
  return new Promise(async resolve => {
    const { dirs } = RNFetchBlob.fs;
    let path = '';
    switch (location) {
      case 'cache':
        path = dirs.CacheDir;
        break;
      case 'album':
        path = dirs.DCIMDir;
        break;
      default:
        break;
    }
    if (fileType === 'url') {
      if (location === 'cache') {
        const filePath = await remoteUrlToLocalPath(path, file);
        resolve(filePath);
      } else if (location === 'album') {
        if (Platform.OS === 'android') {
          const grantedWrite = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
          if (grantedWrite === PermissionsAndroid.RESULTS.GRANTED) {
            const src = await remoteUrlToLocalPath(dirs.CacheDir, file);
            const filePath = await saveAlbum(`file://${src}`);
            resolve(filePath);
          } else {
            resolve(false);
          }
        } else {
          const filePath = await saveAlbum(file);
          resolve(filePath);
        }
      }
    } else if (fileType === 'base64') {
      if (location === 'cache') {
        const filePath = await base64ToLocalPath(path, file);
        resolve(filePath);
      } else if (location === 'album') {
        if (Platform.OS === 'android') {
          const grantedWrite = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
          if (grantedWrite === PermissionsAndroid.RESULTS.GRANTED) {
            const src = await base64ToLocalPath(dirs.CacheDir, file);
            const filePath = await saveAlbum(`file://${src}`);
            resolve(filePath);
          } else {
            resolve(false);
          }
        } else {
          const filePath = await saveAlbum(file);
          resolve(filePath);
        }
      }
    }
  });
}
