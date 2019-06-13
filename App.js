/* eslint-disable no-underscore-dangle */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import './src/utils/storage';
import { Provider, connect } from 'react-redux';
import store from './src/store/configureStore';
import common from './src/actions/common';
import Container from './src/container';

const mapStateToProps = state => {
  return {
    updateStatus: state.updateVersion.status,
    godModelStatus: state.common.godModelStatus,
    godUrl: state.common.godUrl,
    showSplashView: state.splashView.showSplashView,
  };
};

const mapDispatchToProps = dispatch => ({
  onCancel: async () => {
    await storage.remove({
      key: 'globalHost',
    });
    dispatch(common(false));
  },
  setUrl: ({ godModelStatus, godUrl }) => {
    dispatch(common(godModelStatus, godUrl));
  },
  onConfirm: async godUrl => {
    await storage.save({
      key: 'globalHost',
      data: { godUrl },
    });
    dispatch(common(false));
  },
});

const Root = connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);

export default class Index extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}
