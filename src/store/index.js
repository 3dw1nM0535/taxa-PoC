// Redux
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// Redux thunk(api request using redux)
import thunk from 'redux-thunk';

// Root reducer
import { rootReducer } from '../reducers';


// Configure application data store
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export { store };
