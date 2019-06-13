import React from 'react';
import { View, StyleSheet, ImageBackground, StatusBar, Text, Platform, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TabNavigator from './GoodsReport/TabNavigatorComponent';
import { storeReportByCount } from '@api';

const styles = StyleSheet.create({
  containerWrap: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f4f4f4',
  },
  headerWrap: {
    width: '100%',
    height: 158,
    alignItems: 'center',
    paddingTop: global.statusBarHeight,
    flexDirection: 'column',
  },
  headerNavWrap: {
    flex: 1,
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 18,
    color: '#fff',
  },
  headerDataWrap: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  headerDataText1: {
    color: '#fff',
    fontFamily: 'PingFangSC-Regular',
    fontSize: 12,
    marginBottom: 8,
  },
  headerDataText2: {
    color: '#fff',
    fontFamily: 'DINA',
    fontSize: 30,
  },
  headerDataItem: {
    alignItems: 'center',
  },
  leftBtn: {
    width: 60,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type Props = {
  navigation: Function,
};
export default class Index extends React.Component<Props> {
  static navigationOptions = () => ({
    header: null,
  });

  static router = TabNavigator.router;

  state = {
    members: 0,
    totalIncome: 0,
  };

  componentDidMount() {
    storeReportByCount().then(res => {
      this.setState({
        ...res,
      });
    });
  }

  getStoreReportByTime = type => {
    storeReportByTime(type).then(res => {});
  };

  render() {
    const { members, totalIncome } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.containerWrap}>
        <StatusBar barStyle="light-content" />
        <ImageBackground style={[styles.headerWrap, { paddingTop: global.statusBarHeight }]} source={require('../../../assets/report-background.png')}>
          <View style={styles.headerNavWrap}>
            <TouchableOpacity style={styles.leftBtn} onPress={() => navigation.goBack()}>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-back'} size={25} color="#fff" />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={styles.headerText}>运营报表</Text>
            </View>
            <View style={{ width: 60, height: '100%' }} />
          </View>
          <View style={styles.headerDataWrap}>
            <View style={styles.headerDataItem}>
              <Text style={styles.headerDataText1}>累计营收(元)</Text>
              <Text style={styles.headerDataText2}>{totalIncome}</Text>
            </View>
            <View style={styles.headerDataItem}>
              <Text style={styles.headerDataText1}>累计客户数</Text>
              <Text style={styles.headerDataText2}>{members}</Text>
            </View>
          </View>
        </ImageBackground>
        <TabNavigator navigation={navigation} />
      </View>
    );
  }
}
