import React from 'react';

import { createMaterialTopTabNavigator } from 'react-navigation';
import { View, StyleSheet, Animated } from 'react-native';
import MaterialTopTabBar from '@components/MaterialTopTabBar';
import Today from './Today';
import Yesterday from './Yesterday';
import SevenDay from './SevenDay';
import Total from './Total';

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
type Props = {
  width: number,
  translateX: number,
};
class IndicatorView extends React.Component<Props> {
  render() {
    const { width, translateX } = this.props;
    return (
      <Animated.View style={[styles.indicatorWrap, { width, transform: [{ translateX }] }]}>
        <View style={styles.indicator} />
      </Animated.View>
    );
  }
}
export default createMaterialTopTabNavigator(
  {
    Today,
    Yesterday,
    SevenDay,
    Total,
  },
  {
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerMode: 'none',
      tabBarVisible: true,
    }),
    animationEnabled: false,
    swipeEnabled: true,
    tabBarComponent: props => <MaterialTopTabBar {...props} />,
    tabBarOptions: {
      renderIndicator: props => {
        const { width, position } = props;
        const translateX = Animated.multiply(position, width);
        return <IndicatorView width={width} translateX={translateX} />;
      },
      activeTintColor: '#000',
      activeTintFontSize: 16,
      activeTintFontWeight: '600',
      inactiveTintColor: '#666',
      tabStyle: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
      },
      style: {
        backgroundColor: 'white',
        elevation: 0,
      },
      statusBarStyle: 'light-content',
    },
  }
);
