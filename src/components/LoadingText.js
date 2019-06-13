import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class LoadingText extends React.Component {
  state = {
    loadingState: {
      loading: '加载中...',
      noMoreData: '-我是有底线的-',
      empty: '空空如也~',
    },
  };

  loadingText = () => {
    const { loading, textColor, bgColor } = this.props;
    const { loadingState } = this.state;
    let loadMoreText = '';
    switch (loading) {
      case 'loading':
        loadMoreText = loadingState.loading;
        break;
      case 'noMoreData':
        loadMoreText = loadingState.noMoreData;
        break;
      case 'empty':
        loadMoreText = loadingState.empty;
        break;
    }
    if (loadMoreText) {
      return (
        <View style={[styles.loadingTextWrap, bgColor ? { backgroundColor: bgColor } : '']}>
          <Text style={[styles.loadingText, textColor ? { color: textColor } : '']}>{loadMoreText}</Text>
        </View>
      );
    }
    return <Text />;
  };

  render() {
    return this.loadingText();
  }
}

const styles = StyleSheet.create({
  loadingTextWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
  },
  loadingText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
    color: '#999',
    fontFamily: 'PingFangSC-Regular',
  },
});
