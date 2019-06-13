import * as types from '../actions/actionsTypes';

const initialState = {
  showSplashView: false,
};

// 不同类别的事件使用switch对应处理过程
export default function splashView(state = initialState, action) {
  switch (action.type) {
    case types.SET_SPLASH_VIEW:
      return {
        ...state,
        showSplashView: action.showSplashView,
      };
    default:
      return state;
  }
}
