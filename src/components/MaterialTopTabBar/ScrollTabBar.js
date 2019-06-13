/* @flow */

import * as React from 'react';
import { Animated, StyleSheet, View, ScrollView, Platform, TouchableWithoutFeedback } from 'react-native';
import CrossFadeIcon from './CrossFadeIcon';

export type TabBarOptions = {
  activeTintColor?: string,
  inactiveTintColor?: string,
  showLabel?: boolean,
  showIcon?: boolean,
  upperCaseLabel?: boolean,
  labelStyle?: any,
  iconStyle?: any,
  allowFontScaling?: boolean,
  activeTintFontSize?: number,
  inactiveTintFontSize?: number,
  activeTintFontWeight: string,
  inactiveTintFontWeight: string,
  itemPadding?: number,
};

type Props = TabBarOptions & {
  position: Animated.Value,
  offsetX: Animated.Value,
  panX: Animated.Value,
  layout: any,
  navigation: any,
  renderIcon: (props: {
    route: any,
    focused: boolean,
    tintColor: string,
  }) => React.Node,
  getLabelText: (props: { route: any }) => any,
  getAccessibilityLabel: (props: { route: any }) => string,
  getTestID: (props: { route: any }) => string,
  useNativeDriver?: boolean,
  jumpTo: (key: string) => any,
};

export default class TabBarTop extends React.PureComponent<Props> {
  static defaultProps = {
    activeTintColor: '#fff',
    inactiveTintColor: '#fff',
    showIcon: false,
    showLabel: true,
    upperCaseLabel: true,
    allowFontScaling: true,
  };

  state = {
    flag: 0,
  };

  _tabsMeasurements = {};

  _containerMeasurements = {};

  componentDidUpdate() {
    const { state } = this.props.navigation;
    const { width = 0, left = 0 } = this._tabsMeasurements[state.index] || {};
    const containerWidth = this._containerMeasurements.width;
    let newScrollX = 0;
    newScrollX = left - containerWidth / 2 + width / 2;
    this._scrollView.scrollTo({ x: newScrollX });
  }

  _renderLabel = ({ route }) => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      showLabel,
      upperCaseLabel,
      labelStyle,
      allowFontScaling,
      activeTintFontSize,
      inactiveTintFontSize,
      activeTintFontWeight,
      inactiveTintFontWeight,
    } = this.props;

    if (showLabel === false) {
      return null;
    }

    const { routes } = navigation.state;
    const index = routes.indexOf(route);
    const focused = index === navigation.state.index;

    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x, i) => i)];
    const outputRange = inputRange.map(inputIndex => (inputIndex === index ? activeTintColor : inactiveTintColor));
    const color = position.interpolate({
      inputRange,
      outputRange,
    });
    const fontSize = position.interpolate({
      inputRange,
      outputRange: inputRange.map(inputIndex => (inputIndex === index ? activeTintFontSize : inactiveTintFontSize || 14)),
    });

    const fontWeight = focused ? activeTintFontWeight : inactiveTintFontWeight || '200';
    const tintColor = focused ? activeTintColor : inactiveTintColor;
    const label = this.props.getLabelText({ route });

    if (typeof label === 'string') {
      return (
        <Animated.Text numberOfLines={1} style={[styles.label, { color, fontSize, fontWeight }, labelStyle]} allowFontScaling={allowFontScaling}>
          {upperCaseLabel ? label.toUpperCase() : label}
        </Animated.Text>
      );
    }
    if (typeof label === 'function') {
      return label({ focused, tintColor });
    }

    return label;
  };

  _renderIcon = ({ route }) => {
    const { position, navigation, activeTintColor, inactiveTintColor, renderIcon, showIcon, iconStyle } = this.props;

    if (showIcon === false) {
      return null;
    }

    const index = navigation.state.routes.indexOf(route);

    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...navigation.state.routes.map((x, i) => i)];
    const activeOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 1 : 0)),
    });
    const inactiveOpacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map(i => (i === index ? 0 : 1)),
    });

    return (
      <CrossFadeIcon
        route={route}
        navigation={navigation}
        activeOpacity={activeOpacity}
        inactiveOpacity={inactiveOpacity}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        style={[styles.icon, iconStyle]}
      />
    );
  };

  measureTab = (key, event) => {
    const routerLen = this.props.navigation.state.routes.length;
    const { itemPadding = 0 } = this.props;
    const { x, width, height } = event.nativeEvent.layout;
    if (!this._tabsMeasurements[key]) {
      this._tabsMeasurements[key] = { left: x + itemPadding * 2 * key, right: x + itemPadding * key + width + itemPadding * 2, width: width + itemPadding * 2, height };
      if (routerLen === key + 1) {
        this.setState({
          flag: 1,
        });
      }
    }
  };

  onContainerLayout = e => {
    this._containerMeasurements = e.nativeEvent.layout;
  };

  _handleTabPress = ({ route }: Scene<*>) => {
    this._pendingIndex = this.props.navigationState.routes.indexOf(route);

    if (this.props.onTabPress) {
      this.props.onTabPress({ route });
    }

    this.props.jumpTo(route.key);
  };

  _handleTabLongPress = ({ route }: Scene<*>) => {
    if (this.props.onTabLongPress) {
      this.props.onTabLongPress({ route });
    }
  };

  render() {
    /* eslint-disable no-unused-vars */
    const { navigation, renderIcon, getLabelText, ...rest } = this.props;
    const { flag } = this.state;
    return (
      /* $FlowFixMe */
      <View style={[styles.tabBar, this.props.style]} onLayout={this.onContainerLayout}>
        <ScrollView
          ref={scrollView => {
            this._scrollView = scrollView;
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          directionalLockEnabled
          bounces={false}
          scrollsToTop={false}
        >
          {navigation.state.routes.map((route, index) => {
            const tabInfo = this._tabsMeasurements[index];
            return (
              <TouchableWithoutFeedback
                style={tabInfo && { width: tabInfo.width }}
                key={index}
                onPress={this._handleTabPress.bind(this, { route })}
                onLongPress={this._handleTabLongPress.bind(this, { route })}
                onLayout={this.measureTab.bind(this, index)}
              >
                <View style={[rest.tabStyle, !flag && { opacity: 0 }, tabInfo && { width: tabInfo.width }]}>{this._renderLabel({ route })}</View>
              </TouchableWithoutFeedback>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
  },
  label: {
    textAlign: 'center',
    fontSize: 13,
    margin: 8,
    backgroundColor: 'transparent',
  },
  tabBar: {
    backgroundColor: '#2196f3',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    // We don't need zIndex on Android, disable it since it's buggy
    zIndex: Platform.OS === 'android' ? 0 : 1,
  },
});
