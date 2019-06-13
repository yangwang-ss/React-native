import * as types from '../actions/actionsTypes';

const initialState = {
  godModelStatus: false,
  godUrl: 'https://testfamilyapi.vxiaoke360.com',
};

// 不同类别的事件使用switch对应处理过程
export default function common(state = initialState, action) {
  switch (action.type) {
    case types.CUT_GODMODEL:
      return {
        ...state,
        godModelStatus: action.godModelStatus,
        godUrl: action.godUrl || state.godUrl,
      };
      break;
    default:
      return state;
  }
}
