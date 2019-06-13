import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, DeviceInfo, Dimensions } from 'react-native';
import { Header } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { isIphoneX } from 'react-native-iphone-x-helper';
import NavigationService from '../utils/navigationService';

const LANDSCAPE = 'landscape';
const PORTRAIT = 'portrait';

const getHeaderHeight = () => {
  let height;
  const orientation = getOrientation();
  height = getHeaderSafeAreaHeight();
  height += isIphoneX() && orientation === PORTRAIT ? 24 : 0;
  return height;
};

const getHeaderSafeAreaHeight = () => {
  const orientation = getOrientation();
  if (Platform.OS === 'ios' && orientation === LANDSCAPE && !Platform.isPad) {
    return 32;
  }
  return Header.HEIGHT;
};

const getOrientation = () => {
  const { width, height } = Dimensions.get('window');
  return width > height ? LANDSCAPE : PORTRAIT;
};

const paddingTop = Platform.select({
  ios: isIphoneX() ? 32 : 20,
  android: 20,
});

export default class HeaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBack: true,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      isBack: navigation.dangerouslyGetParent().state.isTransitioning,
    });
  }

  render() {
    const { title, navigation, alpha, backgroundColor = 'rgb(251, 65, 162)' } = this.props;
    const { isBack } = this.state;
    return (
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor,
            opacity: alpha,
            height: alpha > 0.1 ? (Platform.OS === 'ios' ? 0 : paddingTop) + getHeaderHeight() : 0,
            paddingTop: alpha > 0.1 ? paddingTop : 0,
          },
        ]}
      >
        <View style={styles.item}>
          {isBack && (
            <TouchableOpacity
              style={{
                flex: 1,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'} size={25} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.item, styles.item2]}>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
        </View>
        <View style={styles.item} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
    elevation: 2,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  item2: {
    flex: 8,
  },
});
