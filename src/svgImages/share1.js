/* eslint-disable camelcase */
import React from 'react';
import { View } from 'react-native';
import Svg, { Image as SvgImage, Text as SvgText } from 'react-native-svg';
import RNFetchBlob from 'rn-fetch-blob';
import saveFile from '@utils/saveFile';

type Props = {
  getBase64: Function,
  result: Array,
};
export default class Index extends React.PureComponent<Props> {
  ref = [];

  onRef = (ref, index) => {
    if (ref) {
      this.ref[index] = ref;
    }
  };

  onLayout = index => {
    const { getBase64 } = this.props;
    this.ref[index].toDataURL(base64 => {
      getBase64({ baseImg: base64, id: '' });
    });
  };

  render() {
    const { result } = this.props;

    return (
      <View style={{ opacity: 0, position: 'absolute', zIndex: 0, elevation: 0, width: 0, height: 0 }}>
        {result.map((item, index) => {
          const { elements, invitation_code, isSplit, backageImage, id } = item;
          let view = null;
          if (isSplit) {
            view = elements.map((subItem, subIndex) => {
              return (
                <SvgText key={subIndex} x={subItem.x} y={subItem.y} fill={subItem.color} fontSize={subItem.font.split(' ')[0]} fontFamily={subItem.font.split(' ')[1]}>
                  {invitation_code[subIndex]}
                </SvgText>
              );
            });
          } else {
            view = elements.map((subItem, subIndex) => {
              return (
                <SvgText key={subIndex} x={subItem.x} y={subItem.y} fill={subItem.color} fontSize={subItem.font.split(' ')[0]} fontFamily={subItem.font.split(' ')[1]}>
                  {invitation_code}
                </SvgText>
              );
            });
          }
          return (
            <Svg key={index} width="375" height="667" viewBox="0 0 375 667" onLayout={() => this.onLayout(index)} ref={ref => this.onRef(ref, index)}>
              <SvgImage width="100%" height="100%" href={{ uri: backageImage }} clipPath="url(#clip)" />
              {view}
            </Svg>
          );
        })}
      </View>
    );
  }
}
