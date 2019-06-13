import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import NavigationService from '../utils/navigationService';
import authVerification from '../utils/authVerification';

Animatable.initializeRegistryWithDefinitions({
  heart: {
    0: {
      scale: 0.8,
    },
    0.5: {
      scale: 1,
    },
    1: {
      scale: 0.8,
    },
  },
});

class FixedBtn extends React.Component {
  jumpPage = async () => {
    const { datas } = this.props;
    if (datas.needLogin === 1) {
      const isAuth = await authVerification({
        navigation: this.props.navigation,
      });
      if (!isAuth) {
        return;
      }
    }
    NavigationService.navigate('WebView', { title: datas.title || '新人免单', src: datas.value });
  };

  async isLogin() {
    const { token } =
      (await storage
        .load({
          key: 'token',
        })
        .catch(e => e)) || {};
    if (!token) {
      return false;
    }
    return true;
  }

  render() {
    const { isShow, datas } = this.props;
    return (
      isShow && (
        <TouchableOpacity onPress={this.jumpPage} style={styles.fixedWrap}>
          <Animatable.Image animation="heart" easing="linear" iterationCount="infinite" source={{ uri: datas.imageUrl }} style={styles.fixImg} />
        </TouchableOpacity>
      )
    );
  }
}

const mapStateToProps = state => ({
  isShow: state.fixedBtn.isShow,
  datas: state.fixedBtn.datas,
});
export default connect(mapStateToProps)(FixedBtn);

const styles = StyleSheet.create({
  fixedWrap: {
    width: 63,
    height: 92,
    position: 'absolute',
    right: 0,
    top: 403,
  },
  fixImg: {
    width: 63,
    height: 92,
  },
});
