import { combineReducers } from 'redux';

// Reducers
import { wallet } from './wallet';
import { farm } from './farm';
import { permissions } from './permissions'

const rootReducer = combineReducers({
  wallet,
  farm,
  permissions,
});

export default rootReducer;

