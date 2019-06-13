import { Image as CanvasImage } from 'react-native-canvas';
import fetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';
import bgBase64 from './bg-base64';

function downloadImage(url) {
  return new Promise(async resolve => {
    fetchBlob
      .config({
        fileCache: true,
      })
      .fetch('GET', url)
      .then(resp => {
        return resp.readFile('base64');
      })
      .then(base64Data => {
        resolve(`data:image/jpeg;base64,${base64Data}`);
      });
  });
}
const loadedImg = image => new Promise(resolve => image.addEventListener('load', resolve));
export default function handleCanvas({ canvas }) {
  return new Promise(async resolve => {
    const { invitationCode } = await storage.load({ key: 'userInfo' }).catch(e => e);
    if (!(canvas instanceof Object) || !invitationCode) {
      return;
    }
    canvas.width = 375;
    canvas.height = 660;
    const ctx = canvas.getContext('2d');
    const image = new CanvasImage(canvas);
    image.src = bgBase64;
    await loadedImg(image);
    ctx.drawImage(image, 0, 0, 375, 667);

    ctx.fillStyle = '#000';
    ctx.font = '15px PingFangSC-Medium';
    ctx.fillText(invitationCode[0], 155, 574);
    ctx.fillText(invitationCode[1], 187, 574);
    ctx.fillText(invitationCode[2], 219, 574);
    ctx.fillText(invitationCode[3], 251, 574);
    ctx.fillText(invitationCode[4], 283, 574);
    ctx.fillText(invitationCode[5], 315, 574);
    ctx.save();

    canvas.toDataURL('image/jpeg').then(async data => {
      const baseImg = data.substr(1, data.length - 2);
      resolve(baseImg);
    });
  });
}
