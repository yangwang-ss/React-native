import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Platform, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AndroidOpenSettings from 'react-native-android-open-settings';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10000,
    elevation: 10000,
    backgroundColor: 'rgba(0,0,0,0.3)',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 240,
    height: 297,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  bg1: {
    width: '90%',
    height: 106,
    position: 'absolute',
    top: -26,
  },
  bg2: {
    width: 62,
    height: 74,
    marginTop: 33,
  },
  close: {
    width: 36,
    height: 36,
    marginTop: 20,
  },
  btn_wx: {
    width: 160,
    height: 40,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_text: {
    color: '#fff',
    fontSize: 14,
  },
  title: {
    color: '#333',
    fontSize: 16,
  },
  text: {
    fontSize: 12,
    color: '#999',
    marginLeft: 12,
    marginRight: 12,
    marginTop: 12,
    marginBottom: 21,
  },
});
export default class Index extends React.Component {
  static navigationOptions = () => ({
    title: '',
  });

  toPushSetting = () => {
    if (Platform.OS === 'android') {
      AndroidOpenSettings.appNotificationSettings();
    } else {
      Linking.openURL('app-settings:');
    }
  };

  render() {
    const { onClose } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={require('@assets/push-bg1.png')} style={styles.bg1} resizeMode="contain" />
          <Image source={require('@assets/push-bg2.png')} style={styles.bg2} resizeMode="contain" />
          <Text style={styles.title}>开启系统通知</Text>
          <Text style={styles.title}>你可以第一时间知道</Text>
          <Text style={styles.text}>现金红包到账、收藏商品降价、正在热销的大额优惠券</Text>
          <TouchableOpacity style={[styles.btn_wx, { marginTop: 20 }]} onPress={() => this.toPushSetting()}>
            <LinearGradient style={styles.btn_wx} colors={['#FA3C8E', '#FC4176']}>
              <Text style={[styles.btn_text]}>去开启></Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onClose}>
          <Image source={require('@assets/icon-close.png')} style={styles.close} />
        </TouchableOpacity>
      </View>
    );
  }
}
