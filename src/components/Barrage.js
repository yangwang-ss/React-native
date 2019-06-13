import React from 'react';
import { Text, Image, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Layout from '../constants/Layout';

export default class Barrage extends React.Component {
  state = {
    isShow: false,
    animation: 'zoomIn',
  };

  componentDidMount() {
    this.index = -1;
    this.barrageTimer();
  }

  barrageTimer = () => {
    const { barrageList } = this.props;
    clearTimeout(this.timer);
    if (!this.first) {
      this.first = true;
      this.duringTime = 2000;
    } else {
      this.duringTime = 5000;
    }
    this.timer = setTimeout(() => {
      if (!barrageList.length) {
        clearTimeout(this.timer);
        return;
      }
      if (this.index < barrageList.length - 1) {
        this.index++;
      } else {
        this.index = 0;
      }
      this.setState({
        isShow: true,
        animation: 'zoomIn',
      });

      setTimeout(() => {
        this.setState({
          animation: 'zoomOut',
        });
      }, 3000);
      this.barrageTimer();
    }, this.duringTime);
  };

  render() {
    const { isShow, animation } = this.state;
    const { barrageList, top } = this.props;
    return (
      isShow && (
        <Animatable.View animation={animation} easing="ease-in-out-quad" style={[styles.barrageWrap, { top }]}>
          <Image style={styles.avatar} source={{ uri: barrageList[this.index].img }} />
          <Text style={styles.info} numberOfLines={1}>
            {barrageList[this.index].text}
          </Text>
        </Animatable.View>
      )
    );
  }
}

const styles = StyleSheet.create({
  barrageWrap: {
    maxWidth: Layout.window.width - 12,
    position: 'absolute',
    left: 6,
    zIndex: 2,
    elevation: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: 28,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 2,
    paddingRight: 14,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 4,
  },
  info: {
    maxWidth: Layout.window.width - 50,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 11,
    color: '#fff',
  },
});
