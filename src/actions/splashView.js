import * as types from './actionsTypes';

export default splashView = ({ showSplashView }) => ({
  type: types.SET_SPLASH_VIEW,
  showSplashView,
});
