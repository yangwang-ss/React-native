import React from 'react';
import {
  View, StyleSheet, ActivityIndicator, Text,
} from 'react-native';
import Layout from '../constants/Layout';

const styles = StyleSheet.create({
  loadingBg: {
    position: 'absolute',
    width: Layout.window.width,
    height: Layout.window.height - 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    width: 24,
    height: 24,
  },
  loadingText: {
    color: '#333',
    marginTop: 10,
  },
});

export default class LoadingIcon extends React.Component {
  render() {
    const { showLoading } = this.props;
    return (
      showLoading && (
        <View style={styles.loadingBg}>
          <ActivityIndicator size="small" color="#333" />
          <Text style={styles.loadingText}>加载中…</Text>
        </View>
      )
    );
  }
}
