import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { PersistGate } from 'redux-persist/integration/react'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'

// Configure redux
import { store, persistor } from './store'
import history from './history'

// Configure Apollo
const client = new ApolloClient({
  uri: 'http://localhost:4000/query',
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router history={history}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
