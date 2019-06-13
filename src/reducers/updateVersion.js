import * as types from '../actions/actionsTypes';

const initialState = {
  status: 0,
  msg: '',
  url: '',
  downloadType: 1,
  hotUpdate: false,
};

// 不同类别的事件使用switch对应处理过程
export default function updateVersion(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_VERSION:
      return {
        ...state,
        status: action.status,
        msg: action.msg,
        url: action.url,
        hotUpdate: action.hotUpdate,
        downloadType: action.downloadType,
      };
      break;
    default:
      return state;
  }
}
