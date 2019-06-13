import * as types from '../actions/actionsTypes';

const initialState = {
  1: [],
  2: [],
  3: [],
  4: [],
};

// 不同类别的事件使用switch对应处理过程
export default (state = initialState, action) => {
  const { userType, phoneList } = action;
  const newData = {};
  newData[userType] = phoneList;
  switch (action.type) {
    case types.SET_PHONE:
      return {
        ...state,
        ...newData,
      };
    case types.CLEAR_PHONE:
      return initialState;
    default:
      return state;
  }
};
