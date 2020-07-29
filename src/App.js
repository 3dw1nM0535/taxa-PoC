import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import Web3 from 'web3'
import { connect } from 'react-redux'
import { connectWallet, walletChange, networkChange } from './actions'
import { store } from './store'
import { Switch, Route } from 'react-router-dom'

import { ResponsiveContainer } from './components/containers'
import {
  HomePage,
  RegisterFarmPage,
  Farms
} from './components/pages'

function App({ loaded, connectWallet }) {

  useEffect(() => {
    if (loaded) {
      (async() => {
        const isMetaMaskInstalled = typeof window.ethereum !== 'undefined'
        if (isMetaMaskInstalled) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
          await window.ethereum.enable()
        } else {
          connectWallet()
        }
      })()
    }
  })

  let walletAddress = {}

  if (loaded) {
    window.ethereum.on('accountsChanged', (accounts) => {
      walletAddress.address = accounts
      store.dispatch(walletChange({ ...walletAddress }))
    })
    window.ethereum.on('chainChanged', (_chainId) => {
      walletAddress.netId = Web3.utils.hexToNumber(_chainId)
      store.dispatch(networkChange({ ...walletAddress }))
    })
  }

  return (
    <ResponsiveContainer>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/tokenize/' component={RegisterFarmPage} />
        <Route exact path='/farms/' component={Farms} />
      </Switch>
    </ResponsiveContainer>
  )
}

App.propTypes = {
  loaded: PropTypes.bool.isRequired,
  connectWallet: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    loaded: state.wallet.loaded,
  }
}

export default connect(mapStateToProps, { connectWallet })(App)

