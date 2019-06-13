/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Layout from '../constants/Layout';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
});
export default class Share extends Component {
  static navigationOptions = {
    title: '邀请',
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    headerRight: React.createElement(View, null, null),
  };

  state = {
    scrollHeight: 0,
    index: 0,
    cardWidth: Layout.window.width - 105,
    scaleSize: 30, // 放缩尺寸
    cardMargin: 30,
  };

  _onScroll(event) {
    const xSize = event.nativeEvent.contentOffset.x;
    const { cardWidth } = this.state;
    const index = parseInt(xSize / (cardWidth + 60));

    console.log(index);
    this.setState({
      scrollHeight: xSize,
      index,
    });
  }

  render() {
    const {
      scrollHeight, cardWidth, index: currentIndex, scaleSize, cardMargin,
    } = this.state;
    const containerWidth = (cardWidth + cardMargin) * 3 + 100;
    const coefficient = scaleSize / (cardWidth + cardMargin);
    return (
      <ScrollView
        onScroll={e => this._onScroll(e)}
        horizontal
        contentContainerStyle={{
          width: containerWidth,
          justifyContent: 'space-between',
          paddingRight: 50,
          paddingLeft: 50,
          height: 480,
        }}
        style={styles.container}
      >
        {[...Array(3)].map((v, index) => {
          let size = 0;
          if (currentIndex === 0) {
            if (index === 0) {
              size = scrollHeight * coefficient;
            } else if (index === 1) {
              size = scaleSize - scrollHeight * coefficient;
            } else {
              size = scaleSize;
            }
          } else if (index === currentIndex) {
            size = (scrollHeight - cardWidth * currentIndex) * coefficient;
          } else if (index === currentIndex + 1) {
            size = scaleSize - (scrollHeight - cardWidth * currentIndex) * coefficient;
          } else {
            size = scaleSize;
          }
          return (
            <View
              key={index}
              style={{
                height: '100%',
                width: cardWidth,
                paddingTop: size,
                paddingRight: size,
                paddingBottom: size,
              }}
            >
              <View style={{ height: '100%', width: '100%', backgroundColor: 'red' }} />
            </View>
          );
        })}
      </ScrollView>
    );
  }
}
