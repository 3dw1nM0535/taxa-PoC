import Web3 from 'web3'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App'
import * as serviceWorker from './serviceWorker'

import { networkChange } from './actions'

import 'semantic-ui-css/semantic.min.css'

// Configure redux
import { store, persistor } from './store'
import history from './history'

// Configure Apollo
const client = new ApolloClient({
  uri: `${process.env.REACT_APP_GRAPHQL_API}`,
  cache: new InMemoryCache(),
})

const isMetaMaskInstalled = typeof window.ethereum !== 'undefined'
const network = {}
if (isMetaMaskInstalled) {
  window.web3 = new Web3(window.ethereum)
  network.netId = window.ethereum.networkVersion
  store.dispatch(networkChange({ ...network }))
} else if (window.web3) {
  window.web3 = new Web3(window.web3.currentProvider)
  network.netId = window.ethereum.networkVersion
  store.dispatch(networkChange({ ...network }))
}

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

