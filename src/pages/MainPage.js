import React from 'react';
import { Text, View, Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { Home } from '.';
import Community from './Community/Index';
import Personal from './Personal/PersonIndex';
// import VipIndex from './Vip/Index';
import VipSwitch from './Vip/VipSwitch';
// import ShopList from './Shop/ShopList';
import ShopSwitch from './Shop/ShopSwitch';
import { refreshUserInfo } from '@api';

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: '首页',
      },
    },
    VipIndex: {
      screen: VipSwitch,
      navigationOptions: {
        tabBarLabel: '会员',
      },
    },
    Shop: {
      screen: ShopSwitch,
      navigationOptions: {
        tabBarLabel: '门店',
      },
    },
    Community: {
      screen: Community,
      navigationOptions: {
        tabBarLabel: '社区',
      },
    },
    Personal: {
      screen: Personal,
      navigationOptions: {
        tabBarLabel: '我的',
      },
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        let iconNameFocused;
        if (routeName === 'Home') {
          iconName = <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/main/icon-home.png')} />;
          iconNameFocused = <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/main/icon-home-active.png')} />;
        } else if (routeName === 'Community') {
          iconName = <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/main/icon-community.png')} />;
          iconNameFocused = <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/main/icon-community-active.png')} />;
        } else if (routeName === 'VipIndex') {
          iconName = <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/main/icon-member.png')} />;
          iconNameFocused = <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/main/icon-member-active.png')} />;
        } else if (routeName === 'Personal') {
          iconName = <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/main/icon-my.png')} />;
          iconNameFocused = <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/main/icon-my-active.png')} />;
        } else if (routeName === 'Shop') {
          iconName = <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/main/icon-shop.png')} />;
          iconNameFocused = <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/main/icon-shop-active.png')} />;
        }

        return focused ? iconNameFocused : iconName;
      },
      tabBarOnPress: async ({ navigation, screenProps }) => {
        const { key, routeName } = navigation.state;
        AnalyticsUtil.eventWithAttributes('bottomTab_click', { routeName });
        if (key === 'Community' || key === 'VipIndex' || key === 'Personal' || key === 'Shop') {
          let { isParent } =
            (await storage
              .load({
                key: 'userInfo',
              })
              .catch(e => e)) || {};
          const { token } =
            (await storage
              .load({
                key: 'token',
              })
              .catch(e => e)) || {};
          if (token && !isParent) {
            if (!isParent) {
              const res = await refreshUserInfo();
              if (res && res.isParent) {
                isParent = res.isParent;
                await storage.save({
                  key: 'userInfo',
                  data: res,
                });
              }
            }
            if (isParent === undefined || isParent === null) {
              storage.remove({
                key: 'token',
              });
              navigation.navigate('Auth');
              return;
            }
            navigation.navigate('Invitation');
            return;
          }
          if (!token) {
            navigation.navigate('Auth');
            return;
          }
        }
        navigation.navigate(routeName);
      },
    }),
    tabBarOptions: {
      activeTintColor: '#fa558c',
      inactiveTintColor: 'gray',
    },
  }
);
TabNavigator.navigationOptions = ({ navigation }) => {
  const { routes, index } = navigation.state;
  const navigationOptions = {};
  navigationOptions.header = null;
  return navigationOptions;
};
export default TabNavigator;
