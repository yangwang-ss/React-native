import * as types from './actionsTypes';

export default (cutFixBtnModel = ({ isShow, datas }) => ({
  type: types.SET_FIX_BTN_MODAL,
  isShow,
  datas,
}));
