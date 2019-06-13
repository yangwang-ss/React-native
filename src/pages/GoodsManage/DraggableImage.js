import React from 'react';
import { StyleSheet, Animated, Dimensions, Text, TextInput, Image, View, TouchableOpacity } from 'react-native';
import { isTerminatorless } from '@babel/types';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  conWrap: {
    width: (width - 32) / 3,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImgWrap: {
    position: 'relative',
    width: (width - 32) / 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },
  mainImg: {
    width: '100%',
    height: '100%',
  },
  deleteImg: {
    position: 'absolute',
    width: 18,
    height: 18,
    top: 4,
    right: 4,
  },
  inputWrap: {
    width: 44,
    height: 20,
    backgroundColor: 'rgba( 252, 66, 119, 0.1)',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    textAlign: 'center',
    color: '#FC4277',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default class Index extends React.Component {
  static navigationOptions = () => ({
    title: '',
  });

  state = {
    height: (width - 32) / 3,
    value: '',
  };

  componentWillMount = () => {
    const { height, item } = this.props;
    if (height) {
      this.setState({
        height,
      });
    }
  };

  deleteImg = () => {
    const { deleteImg, index, type } = this.props;
    deleteImg(index, type);
  };

  changeText = (e, index) => {
    const { changeSort, type, item } = this.props;
    changeSort(e, index, type);
  };

  render() {
    const { item, index, type, _scrollToInput } = this.props;
    const { height } = this.state;
    return (
      <View style={styles.conWrap}>
        <View style={[styles.mainImgWrap, { height }]}>
          <Animated.Image source={{ uri: item.path }} style={styles.mainImg} />
          <TouchableOpacity style={styles.deleteImg} onPress={this.deleteImg}>
            <Image source={require('@assets/Shop/icon-edit-delet.png')} style={styles.deleteImg} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputWrap}>
          <TextInput
            onFocus={(event: Event) => {
              // `bind` the function if you're using ES6 classes
              _scrollToInput(ReactNative.findNodeHandle(event.target));
            }}
            style={styles.input}
            key={index}
            value={String(item.sort)}
            keyboardType="numeric"
            maxLength={type === 'main' ? 1 : 2}
            onChangeText={e => this.changeText(e, index)}
          />
        </View>
      </View>
    );
  }
}
