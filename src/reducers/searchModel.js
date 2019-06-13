import * as types from '../actions/actionsTypes';

const initialState = {
  isShow: false,
  searchText: '',
};

// 不同类别的事件使用switch对应处理过程
export default function searchModel(state = initialState, action) {
  switch (action.type) {
    case types.CUT_SEARCHMODEL:
      return {
        ...state,
        isShow: action.isShow || initialState.isShow,
        searchText: action.searchText || initialState.searchText,
      };
      break;
    default:
      return state;
  }
}
