import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BoxShadow } from 'react-native-shadow';
import { connect } from 'react-redux';
import vipUpModalAction from '../actions/vipUpModal';

const shadowOpt = {
  width: 156,
  height: 40,
  color: '#C4A56F',
  border: 6,
  radius: 18,
  opacity: 0.4,
  x: 2,
  y: 4,
};

class VipUpModal extends React.Component {
  render() {
    const { isShow, text, cancel } = this.props;
    if (!isShow) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.modalWrap}>
          <View>
            <Text style={styles.modalTitleText}>恭喜您升级为米粒生活</Text>
            <Text style={styles.modalTitleText}>{text}</Text>
          </View>
          <Image style={styles.modalImg} source={{ uri: 'https://image.vxiaoke360.com/vip-up-modal.png' }} />
          <TouchableOpacity onPress={cancel}>
            <BoxShadow setting={shadowOpt}>
              <LinearGradient
                style={styles.modalBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#e1cda1', '#be9d65']}
              >
                <Text style={styles.btnText}>朕知道了</Text>
              </LinearGradient>
            </BoxShadow>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  isShow: state.vipUpModal.isShow,
  text: state.vipUpModal.text,
});

export default connect(mapStateToProps, dispatch => ({
  cancel: () => dispatch(vipUpModalAction({ isShow: false })),
}))(VipUpModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: 0,
    left: 0,
    paddingLeft: 58,
    paddingRight: 58,
    zIndex: 999,
  },
  modalWrap: {
    backgroundColor: '#fff',
    width: '100%',
    height: 318,
    marginTop: 165,
    paddingTop: 28,
    paddingBottom: 28,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitleText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 20,
    color: '#806a44',
    lineHeight: 34,
    textAlign: 'center',
  },
  modalImg: {
    alignSelf: 'center',
    width: 94,
    height: 94,
    borderRadius: 47,
    marginTop: 24,
    marginBottom: 20,
  },
  modalBtn: {
    width: 160,
    height: 44,
    borderRadius: 24,
  },
  btnText: {
    lineHeight: 44,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontFamily: 'PingFangSC-Medium',
  },
});
