import { combineReducers } from 'redux';

import { user } from './user';
import { db } from './db';

export const rootReducer = combineReducers({
  user,
  db,
});
