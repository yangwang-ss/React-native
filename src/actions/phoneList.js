import * as types from './actionsTypes';

module.exports = {
  setPhones: (phoneList, userType) => ({
    type: types.SET_PHONE,
    phoneList,
    userType,
  }),
  clearPhones: () => ({
    type: types.CLEAR_PHONE,
  }),
};
