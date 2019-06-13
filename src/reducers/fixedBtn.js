import * as types from '../actions/actionsTypes';

const initialState = {
  isShow: false,
  datas: {},
};

// 不同类别的事件使用switch对应处理过程
export default function setFixBtnModal(state = initialState, action) {
  switch (action.type) {
    case types.SET_FIX_BTN_MODAL:
      return {
        ...state,
        isShow: action.isShow || initialState.isShow,
        datas: action.datas || initialState.datas,
      };
      break;
    default:
      return state;
  }
}
