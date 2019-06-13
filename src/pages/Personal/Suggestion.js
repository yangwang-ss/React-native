import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image, TextInput, StatusBar,
} from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import Toast from 'react-native-root-toast';
import Layout from '../../constants/Layout';
import { getSuggestion } from '../../services/api';

const shadowValue = {
  width: Layout.window.width - 50,
  height: 30,
  color: '#FC4277',
  border: 16,
  opacity: 0.3,
  radius: 14,
  x: 8,
  y: 12,
  style: { position: 'absolute', left: 4, top: 0 },
};

export default class Suggestion extends Component {
  static navigationOptions = {
    title: '意见反馈',
  };

  state = {
    content: '',
    canShow: true,
    canSubmit: true,
    isSuccess: false,
  };

  closeTip = () => {
    this.setState({
      isSuccess: false,
    });
    this.props.navigation.navigate('Personal');
  };

  handleSubmit = () => {
    const { content, canShow, canSubmit } = this.state;
    const text = content.trim();
    if (text.length < 1) {
      if (canShow) {
        this.setState({
          canShow: false,
        }, () => {
          Toast.show('提交内容不能为空', {
            position: 0,
          });
          setTimeout(() => {
            this.setState({
              canShow: true,
            });
          }, 3000);
        });
      }
      return;
    }
    if (text.length > 1000) {
      if (canShow) {
        this.setState({
          canShow: false,
        }, () => {
          Toast.show('内容字数不能超过1000字', {
            position: 0,
          });
          setTimeout(() => {
            this.setState({
              canShow: true,
            });
          }, 3000);
        });
      }
      return;
    }
    if (canSubmit) {
      this.refs.inputText.blur();
      this.setState({
        canSubmit: false,
      }, () => {
        this.getSuggestionSubmit();
      });
    }
  }

  async getSuggestionSubmit() {
    const { content } = this.state;
    const params = {
      text: content,
    };

    const res = await getSuggestion(params);
    if (res) {
      this.setState({
        content: '',
        canSubmit: true,
        isSuccess: true,
      });
    } else {
      this.setState({
        canSubmit: true,
      });
    }
  }

  render() {
    const { content, isSuccess } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor="#fff" />
        <View style={styles.contentWrap}>
          <TextInput
            ref="inputText"
            style={styles.inputArea}
            placeholder="请在此输入您对产品的建议…"
            underlineColorAndroid="transparent"
            onChangeText={content => this.setState({ content })}
            value={content}
            multiline
            numberOfLines={4}
          />
          <View style={styles.submitBtnWrap}>
            <BoxShadow setting={shadowValue} />
            <TouchableOpacity onPress={this.handleSubmit} activeOpacity={Layout.activeOpacity} style={styles.submitBtn}>
              <Text style={styles.submitText}>提交</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.bottomText}>您的建议是我们成长的源动力！</Text>
        {
          isSuccess && (
            <View style={styles.tipModalWrap}>
              <View style={styles.tipModalBg} />
              <View style={styles.tipModalBox}>
                <View style={styles.tipModal}>
                  <View style={styles.tipModalIcon}>
                    <Image style={styles.tipIcon} source={require('../../../assets/icon-suggestion.png')} />
                  </View>
                  <View style={styles.tipModalContent}>
                    <Text style={styles.tipText1}>非常感谢您的反馈！</Text>
                    <Text style={styles.tipText2}>我们会继续努力</Text>
                    <TouchableOpacity onPress={this.closeTip} activeOpacity={Layout.activeOpacity} style={styles.tipBtnWrap}>
                      <Text style={styles.tipBtnText}>好的</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-between',
    flexWrap: 'wrap',
    padding: 12,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: '#fff',
  },
  tipModalWrap: {
    height: Layout.window.height,
    width: Layout.window.width,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99,
  },
  tipModalBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  tipModalBox: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipModal: {
    position: 'relative',
    width: 270,
    height: 182,
    marginBottom: 170,
  },
  tipModalIcon: {
    width: '100%',
    height: 68,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -34,
    left: 0,
    zIndex: 99,
  },
  tipIcon: {
    width: 68,
    height: 68,
  },
  tipModalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 54,
    paddingBottom: 14,
  },
  tipText1: {
    textAlign: 'center',
    fontFamily: 'PingFangSC-Medium',
    color: '#333',
    fontSize: 16,
    marginBottom: 10,
  },
  tipText2: {
    textAlign: 'center',
    fontFamily: 'PingFangSC-Regular',
    color: '#666',
    fontSize: 14,
    marginBottom: 26,
  },
  tipBtnWrap: {
    width: '100%',
    height: 48,
    borderRadius: 30,
    backgroundColor: '#FC4277',
  },
  tipBtnText: {
    textAlign: 'center',
    fontFamily: 'PingFangSC-Regular',
    color: '#fff',
    fontSize: 18,
    lineHeight: 48,
  },
  contentWrap: {
    width: '100%',
  },
  submitBtn: {
    backgroundColor: '#FC4277',
    height: 48,
    width: '100%',
    borderRadius: 24,
  },
  submitText: {
    textAlign: 'center',
    lineHeight: 48,
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 18,
  },
  bottomText: {
    width: '100%',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  inputArea: {
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    textAlignVertical: 'top',
    height: 200,
    width: '100%',
    marginBottom: 32,
    padding: 12,
  },
});
