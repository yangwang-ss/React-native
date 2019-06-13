
export default function drawText(ctx, content, textCount = 10, fs = '14px PingFangSC-Regular', fc = '#333', x, y, align = 'left') {
  // 将多行文字，拆分成指定textCount个字符为一行
  const getTextBlocks = (content) => {
    const result = [];
    if (typeof content === 'string') {
      const COUNT_PER_BLOCK = textCount;
      for (let offset = 0, l = content.length; offset < l;) {
        const start = offset;
        const end = offset + COUNT_PER_BLOCK;
        const block = content.substring(start, end);
        result.push(block);
        offset += COUNT_PER_BLOCK;
      }
    }
    return result;
  };

  ctx.fillStyle = fc;
  ctx.textAlign = align;
  ctx.font = fs;
  const textContentBlocks = getTextBlocks(content);
  let yNum = 0;

  for (let i = 0, l = textContentBlocks.length; i < l; i++) {
    if (i !== 0) {
      yNum = y += 18;
    } else {
      yNum = y;
    }
    ctx.fillText(textContentBlocks[i], x, yNum);
  }
}
