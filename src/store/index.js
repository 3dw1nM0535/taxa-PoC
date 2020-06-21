// Redux
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// Redux thunk(api request using redux)
import thunk from 'redux-thunk';

// Redux persist
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

// Root reducer
import { rootReducer } from '../reducers';


// Config persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

// Persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);


// Configure application data store
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

const persistor = persistStore(store);

export { store, persistor };
