import React from 'react';
import {
  View, Text, Image, StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  noDataWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  noDataImg: {
    marginTop: 100,
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  noDataTip: {
    fontFamily: 'PingFangSC-Regular',
    color: '#999',
    fontSize: 14,
    width: '100%',
    textAlign: 'center',
  },
});

export default class NoOrder extends React.Component {
  render() {
    const { isEmpty, text } = this.props;
    return (
      isEmpty && (
        <View style={styles.noDataWrap}>
          <Image style={styles.noDataImg} source={{uri: 'https://image.vxiaoke360.com/FhG0-NuijsOkbPJbIMnhJbmeRZNN'}} />
          <Text style={styles.noDataTip}>{text}</Text>
        </View>
      )
    );
  }
}
