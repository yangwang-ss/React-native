import * as types from './actionsTypes';

export default cutSearchModel = ({ isShow, text }) => ({
  type: types.SET_VIP_UP_MODAL,
  isShow,
  text,
});
