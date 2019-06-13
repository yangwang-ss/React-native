import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import authVerification from '../utils/authVerification';

export default class NewToast extends React.Component {
  closeNewToast = () => {
    const { closeNewToast } = this.props;
    closeNewToast();
  };

  jumpPage = async () => {
    const { closeNewToast, datas } = this.props;
    if (datas.needLogin === 1) {
      const isAuth = await authVerification({
        navigation: this.props.navigation,
      });
      if (!isAuth) {
        return;
      }
    }
    this.props.navigation.navigate('WebView', { title: datas.title || '新人免单', src: datas.value });
    closeNewToast();
  };

  render() {
    return (
      <View style={styles.alertWrap}>
        <View style={styles.alertContent} onPress={this.jumpPage}>
          <TouchableOpacity style={styles.closeWrap} onPress={this.closeNewToast}>
            <Image source={require('@assets/activity/close.png')} style={styles.closeImg} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mainWrap} onPress={this.jumpPage} />
          <Image source={require('@assets/activity/new-toast-img.png')} style={styles.mainImg} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  alertWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 100,
    elevation: 9,
  },
  alertContent: {
    width: 288,
    height: 300,
    position: 'relative',
  },
  mainWrap: {
    width: 288,
    height: 300,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  mainImg: {
    width: 288,
    height: 300,
  },
  closeWrap: {
    paddingLeft: 10,
    width: 36,
    height: 30,
    position: 'absolute',
    top: 1,
    right: 8,
    zIndex: 12,
  },
  closeImg: {
    width: 26,
    height: 26,
  },
});
