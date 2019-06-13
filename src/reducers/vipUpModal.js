import * as types from '../actions/actionsTypes';

const initialState = {
  isShow: false,
  text: 'VIP',
};

// 不同类别的事件使用switch对应处理过程
export default function setVipUpModal(state = initialState, action) {
  switch (action.type) {
    case types.SET_VIP_UP_MODAL:
      return {
        ...state,
        isShow: action.isShow || initialState.isShow,
        text: action.text || initialState.text,
      };
      break;
    default:
      return state;
  }
}
