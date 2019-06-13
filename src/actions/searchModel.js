import * as types from './actionsTypes';

export default cutSearchModel = ({ isShow, searchText }) => ({
  type: types.CUT_SEARCHMODEL,
  isShow,
  searchText,
});
