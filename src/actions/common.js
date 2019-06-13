import * as types from './actionsTypes';

export default (godModelStatus, godUrl) => ({
  type: types.CUT_GODMODEL,
  godModelStatus,
  godUrl,
});
