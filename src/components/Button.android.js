const React = require('react');
const ReactNative = require('react-native');

const { TouchableOpacity } = ReactNative;

const Button = props => (
  <TouchableOpacity
    activeOpacity={1}
      // delayPressIn={0}
      // background={TouchableNativeFeedback.SelectableBackground()} // eslint-disable-line new-cap
    {...props}
  >
    {props.children}
  </TouchableOpacity>
);

module.exports = Button;
