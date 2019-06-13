/* eslint-disable camelcase */
import React from 'react';
import { View } from 'react-native';
import Svg, { Image as SVGImage, Text as SVGText } from 'react-native-svg';
import saveFile from '@utils/saveFile';

type Props = {
  getBase64: Function,
  data: Array,
};
export default class Index extends React.PureComponent<Props> {
  state = {
    invitationCode: '',
  };

  prevBase64 = '';

  async componentDidMount() {
    const { invitationCode } = await storage.load({ key: 'userInfo' }).catch(e => e);
    this.setState({
      invitationCode,
    });
  }

  onRef = ref => {
    if (ref) {
      this.ref = ref;
    }
  };

  prevBase64 = '';

  onLayout = () => {
    const { getBase64 } = this.props;
    this.timer = setInterval(() => {
      this.ref.toDataURL(async base64 => {
        if (this.prevBase64 === base64) {
          clearInterval(this.timer);
          getBase64(`data:image/png;base64,${base64}`);
        } else {
          this.prevBase64 = base64;
        }
      });
    }, 500);
  };

  render() {
    const { invitationCode } = this.state;
    const { data } = this.props;
    if (!invitationCode) {
      return null;
    }
    return (
      <View style={{ opacity: 0, position: 'absolute', zIndex: 0, elevation: 0 }} onLayout={this.onLayout}>
        <Svg ref={this.onRef} height="667" width="375" viewBox="0 0 375 667">
          <SVGImage width="100%" height="100%" href={require('@assets/newPeople-bg.png')} />

          <SVGImage width="184" height="184" x="3" y="192" href={{ uri: data[0].productImg, __packager_asset: true }} clipPath="url(#clip)" />
          <SVGImage width="92" height="44" x="95" y="328" href={require('@assets/newPeople-label.png')} clipPath="url(#clip)" />
          <SVGText x="142" y="364" fontSize="11" fill="white" fontFamily="PingFangSC-Regular" textDecoration="line-through">
            {data[0].zkFinalPrice}
          </SVGText>

          <SVGImage width="184" height="184" x="189" y="192" href={{ uri: data[1].productImg, __packager_asset: true }} clipPath="url(#clip)" />
          <SVGImage width="92" height="44" x="281" y="328" href={require('@assets/newPeople-label.png')} clipPath="url(#clip)" />
          <SVGText x="328" y="364" fontSize="11" fill="white" fontFamily="PingFangSC-Regular" textDecoration="line-through">
            {data[1].zkFinalPrice}
          </SVGText>

          <SVGImage width="122" height="122" x="3" y="378" href={{ uri: data[2].productImg, __packager_asset: true }} clipPath="url(#clip)" />
          <SVGImage width="92" height="44" x="33" y="452" href={require('@assets/newPeople-label.png')} clipPath="url(#clip)" />
          <SVGText x="81" y="488" fontSize="11" fill="white" fontFamily="PingFangSC-Regular" textDecoration="line-through">
            {data[2].zkFinalPrice}
          </SVGText>

          <SVGImage width="122" height="122" x="127" y="378" href={{ uri: data[3].productImg, __packager_asset: true }} clipPath="url(#clip)" />
          <SVGImage width="92" height="44" x="157" y="452" href={require('@assets/newPeople-label.png')} clipPath="url(#clip)" />
          <SVGText x="203" y="488" fontSize="11" fill="white" fontFamily="PingFangSC-Regular" textDecoration="line-through">
            {data[3].zkFinalPrice}
          </SVGText>

          <SVGImage width="122" height="122" x="251" y="378" href={{ uri: data[4].productImg, __packager_asset: true }} clipPath="url(#clip)" />
          <SVGImage width="92" height="44" x="281" y="452" href={require('@assets/newPeople-label.png')} clipPath="url(#clip)" />
          <SVGText x="327" y="488" fontSize="11" fill="white" fontFamily="PingFangSC-Regular" textDecoration="line-through">
            {data[4].zkFinalPrice}
          </SVGText>

          <SVGText x="158" y="590" fontSize="18" fill="#000" fontFamily="PingFangSC-Medium">
            {invitationCode[0]}
          </SVGText>
          <SVGText x="188" y="590" fontSize="18" fill="#000" fontFamily="PingFangSC-Medium">
            {invitationCode[1]}
          </SVGText>
          <SVGText x="218" y="590" fontSize="18" fill="#000" fontFamily="PingFangSC-Medium">
            {invitationCode[2]}
          </SVGText>
          <SVGText x="248" y="590" fontSize="18" fill="#000" fontFamily="PingFangSC-Medium">
            {invitationCode[3]}
          </SVGText>
          <SVGText x="278" y="590" fontSize="18" fill="#000" fontFamily="PingFangSC-Medium">
            {invitationCode[4]}
          </SVGText>
          <SVGText x="308" y="590" fontSize="18" fill="#000" fontFamily="PingFangSC-Medium">
            {invitationCode[5]}
          </SVGText>
        </Svg>
      </View>
    );
  }
}
