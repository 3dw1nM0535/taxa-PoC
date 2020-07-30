import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import Web3 from 'web3'
import { connect } from 'react-redux'
import { connectWallet, walletChange, networkChange, disconnectMetaMask } from './actions'
import { store } from './store'
import { Switch, Route } from 'react-router-dom'

import { ResponsiveContainer } from './components/containers'
import {
  HomePage,
  RegisterFarmPage,
  FarmsPage,
  FarmPage,
} from './components/pages'

function App({ loaded, connectWallet }) {

  let walletAddress = {}

  useEffect(() => {
    (() => {
      const isMetaMaskInstalled = typeof window.ethereum !== 'undefined'
      if (isMetaMaskInstalled && loaded) {
        window.web3 = new Web3(window.ethereum)
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
    })()
  })

  if (loaded) {
    window.ethereum.on('accountsChanged', async(accounts) => {
      const isUnlocked = await window.ethereum._metamask.isUnlocked()
      if (isUnlocked) {
        walletAddress.address = accounts
        store.dispatch(walletChange({ ...walletAddress }))
      } else {
        store.dispatch(disconnectMetaMask())
      } 
    })
    window.ethereum.on('chainChanged', (_chainId) => {
      walletAddress.netId = Web3.utils.hexToNumber(_chainId)
      store.dispatch(networkChange({ ...walletAddress }))
    })
    window.ethereum.on('disconnect', (error) => {
      store.dispath(disconnectMetaMask())
      window.alert(`Error ${error.message}`)
    })
  }

  return (
    <ResponsiveContainer>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/tokenize/' component={RegisterFarmPage} />
        <Route exact path='/farms/' component={FarmsPage} />
        <Route path='/farm/:tokenId/' component={FarmPage} />
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

