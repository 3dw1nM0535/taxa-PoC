import { combineReducers } from 'redux';

// Reducers
import { wallet } from './wallet';
import { farm } from './farm';

const rootReducer = combineReducers({
  wallet,
  farm,
});

export default rootReducer;

