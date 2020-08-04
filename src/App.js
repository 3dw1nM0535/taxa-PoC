import PropTypes from 'prop-types'
import React from 'react'
import Web3 from 'web3'
import { connect } from 'react-redux'
import { walletChange, networkChange, disconnectMetaMask } from './actions'
import { store } from './store'
import { Switch, Route } from 'react-router-dom'

import { ResponsiveContainer } from './components/containers'
import {
  RegisterFarmPage,
  FarmsPage,
  FarmPage,
} from './components/pages'

function App({ loaded }) {

  let walletAddress = {}

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
      const network = {}
      network.netId = Web3.utils.hexToNumber(_chainId)
      store.dispatch(networkChange({ ...network }))
    })
    window.ethereum.on('disconnect', (error) => {
      store.dispath(disconnectMetaMask())
      window.alert(`Error ${error.message}`)
    })
  }

  return (
    <ResponsiveContainer>
      <Switch>
        <Route path='/farm/:tokenId/' component={FarmPage} />
        <Route exact path='/farms/' component={FarmsPage} />
        <Route exact path='/tokenize/' component={RegisterFarmPage} />
      </Switch>
    </ResponsiveContainer>
  )
}

App.propTypes = {
  loaded: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
  return {
    loaded: state.wallet.loaded,
  }
}

export default connect(mapStateToProps)(App)

