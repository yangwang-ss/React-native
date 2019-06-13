import { combineReducers } from 'redux';
import common from './common';
import updateVersion from './updateVersion';
import searchModel from './searchModel';
import splashView from './splashView';
import vipUpModal from './vipUpModal';
import phoneList from './phoneList';
import fixedBtn from './fixedBtn';

const rootReducer = combineReducers({
  common,
  updateVersion,
  searchModel,
  splashView,
  vipUpModal,
  phoneList,
  fixedBtn,
});

export default rootReducer;
