import { createAppContainer, createMaterialTopTabNavigator } from 'react-navigation';
import React, { Component } from 'react';
import { Animated, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ScrollTabBar from '@components/MaterialTopTabBar/ScrollTabBar';
import OtherTabPage from './OtherTabPage';
import RecommendTabPage from './RecommendTabPage';
import { getTopTabs } from '@api';

const styles = StyleSheet.create({
  indicatorWrap: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
  },
  indicator: {
    width: 16,
    height: 2,
    backgroundColor: '#FC4277',
  },
});
export default class DynamicTabComponent extends Component {
  state = {
    tabs: [],
  };

  tabs = [{ name: '推荐', id: 'recommend' }, { name: '猜你喜欢', id: 'guessLike' }];

  loadedTopBar = false;

  async componentDidMount() {
    this.getTopTabs();
  }

  shouldComponentUpdate() {
    if (this.loadedTopBar) {
      return false;
    }
    return true;
  }

  getTopTabs = async () => {
    const res = await getTopTabs();
    let tabs = [];
    console.log('getTopTabs===', res);
    if (res && res.length) {
      tabs = [...this.tabs, ...res];
    }
    this.setState({
      tabs,
    });
  };

  _tabNavigator = tabs => {
    const { navigation } = this.props;
    const tabsView = {};
    if (tabs.length < 1) {
      return false;
    }
    tabs.forEach((item, index) => {
      if (item.id === 'recommend') {
        tabsView[`page${index}`] = {
          screen: () => <RecommendTabPage navigation={navigation} init={this.props.init} />,
          navigationOptions: () => ({
            title: item.name,
          }),
        };
      } else {
        tabsView[`page${index}`] = {
          screen: () => <OtherTabPage navigation={navigation} id={item.id} init={this.props.init} />,
          navigationOptions: () => ({
            title: item.name,
          }),
        };
      }
    });
    this.loadedTopBar = true;
    return createAppContainer(
      createMaterialTopTabNavigator(tabsView, {
        navigationOptions: () => ({
          header: null,
          headerMode: 'none',
          tabBarVisible: true,
        }),
        animationEnabled: false,
        swipeEnabled: true,
        lazy: true,
        tabBarComponent: props => <ScrollTabBar {...props} />,
        tabBarOptions: {
          renderIndicator: props => {
            return null;
          },
          activeTintColor: '#fff',
          activeTintFontSize: 16,
          activeTintFontWeight: '600',
          inactiveTintFontWeight: '200',
          inactiveTintColor: '#fff',
          scrollEnabled: true,
          itemPadding: 10,
          tabStyle: {
            height: 48,
            width: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          },
          labelStyle: {
            flexWrap: 'nowrap',
            margin: 0,
          },
          style: {
            backgroundColor: 'rgba(0,0,0,0)',
            elevation: 0,
          },
          statusBarStyle: 'light-content',
        },
      })
    );
  };

  render() {
    const { tabs } = this.state;
    const Tabs = this._tabNavigator(tabs);
    if (!Tabs) {
      return null;
    }
    return <Tabs />;
  }
}
