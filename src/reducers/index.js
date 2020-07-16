import { combineReducers } from 'redux';

// Reducers
import { wallet } from './wallet';
import { farm } from './farm';
import { loading } from './loading'

const rootReducer = combineReducers({
  wallet,
  farm,
  loading,
});

export default rootReducer;

