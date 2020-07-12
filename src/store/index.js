import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { createTransform } from 'redux-persist'
import { parse, stringify } from 'flatted'

import rootReducer from '../reducers';

const transformCircular = createTransform(
  (inboundState, key) => stringify(inboundState),
  (outboundState, key) => parse(outboundState),
)

const persistConfig = {
  key: 'root',
  storage,
  transforms: [transformCircular],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

// Persist store
const persistor = persistStore(store);

export {
  store,
  persistor,
}
