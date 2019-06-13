import { Image as CanvasImage } from 'react-native-canvas';
import fetchBlob from 'rn-fetch-blob';
import drawText from '@utils/drawText';
import { Platform } from 'react-native';
import bgBase64 from './bg-base64';
import labelBase64 from './label-base64';

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
export default function handleCanvas({ canvas, plist }) {
  return new Promise(async resolve => {
    const { invitationCode } = await storage.load({ key: 'userInfo' }).catch(e => e);
    if (!(canvas instanceof Object)) {
      return;
    }
    canvas.width = 375;
    canvas.height = 660;
    const ctx = canvas.getContext('2d');
    const image = new CanvasImage(canvas);
    image.src = bgBase64;
    await loadedImg(image);
    ctx.drawImage(image, 0, 0, 375, 667);

    const img = new CanvasImage(canvas);
    img.src = await downloadImage(plist[0].productImg);
    await loadedImg(img);
    ctx.drawImage(img, 3, 192, 184, 184);

    img.src = await downloadImage(plist[1].productImg);
    await loadedImg(img);
    ctx.drawImage(img, 189, 192, 184, 184);

    img.src = await downloadImage(plist[2].productImg);
    await loadedImg(img);
    ctx.drawImage(img, 3, 378, 122, 122);

    img.src = await downloadImage(plist[3].productImg);
    await loadedImg(img);
    ctx.drawImage(img, 127, 378, 122, 122);

    img.src = await downloadImage(plist[4].productImg);
    await loadedImg(img);
    ctx.drawImage(img, 251, 378, 122, 122);

    const label = new CanvasImage(canvas);
    label.src = labelBase64;
    await loadedImg(label);
    ctx.drawImage(label, 95, 328, 92, 44);
    ctx.fillStyle = '#fff';
    ctx.font = '11px PingFangSC-Regular';
    ctx.fillText(plist[0].zkFinalPrice, 142, 364);

    ctx.drawImage(label, 281, 328, 92, 44);
    ctx.fillText(plist[1].zkFinalPrice, 328, 364);

    ctx.drawImage(label, 33, 452, 92, 44);
    ctx.fillText(plist[2].zkFinalPrice, 81, 488);

    ctx.drawImage(label, 157, 452, 92, 44);
    ctx.fillText(plist[3].zkFinalPrice, 203, 488);

    ctx.drawImage(label, 281, 452, 92, 44);
    ctx.fillText(plist[4].zkFinalPrice, 327, 488);

    ctx.fillStyle = '#000';
    ctx.font = '15px PingFangSC-Medium';
    ctx.fillText(invitationCode[0], 158, 588);
    ctx.fillText(invitationCode[1], 188, 588);
    ctx.fillText(invitationCode[2], 218, 588);
    ctx.fillText(invitationCode[3], 248, 588);
    ctx.fillText(invitationCode[4], 278, 588);
    ctx.fillText(invitationCode[5], 308, 588);
    ctx.save();

    canvas.toDataURL('image/jpeg').then(async data => {
      const baseImg = data.substr(1, data.length - 2);
      resolve(baseImg);
    });
  });
}
