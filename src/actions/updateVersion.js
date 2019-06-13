import * as types from './actionsTypes';


export default updateVersion = ({
  status, msg, url, hotUpdate = false, downloadType = 1,
}) => ({
  type: types.UPDATE_VERSION,
  status,
  msg,
  url,
  hotUpdate,
  downloadType,
});
