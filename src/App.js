import React, { useEffect } from 'react'
import Web3 from 'web3'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import './app.scss'

import { store } from './store'
import { walletChange, netChange } from './actions'

import FooHeader from './components/Header'
import { RegisterFarmPage } from './components/pages'
import { Farm } from './components/pages/Farm'
import { Farms } from './components/pages/Farms'

import makeBlockie from 'ethereum-blockies-base64';

function App({ wallet, loaded }) {

  useEffect(() => {
    if (loaded) {
      (async () => {
        const isMetaMaskInstalled = typeof window.ethereum !== 'undefined';
        if (isMetaMaskInstalled) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
					await window.ethereum.enable()
        } else {
          window.alert("You need MetaMask wallet to interact with this application. You will be redirected to a site to download the wallet for use in accessing the Ethereum blockchain.")
          window.location.assign("https://metamask.io/download.html")
        }
      })()
    }
  })

  let walletAddress = {}

  if (loaded) {
    window.ethereum.on('accountsChanged', (accounts) => {
      walletAddress.address = accounts
      walletAddress.addressBlockie = makeBlockie(String(accounts[0]))
      store.dispatch(walletChange({ ...walletAddress }))
    })

    window.ethereum.on('chainChanged', (_chainId) => {
      walletAddress.netId = Web3.utils.hexToNumber(_chainId)
      store.dispatch(netChange({ ...walletAddress }))
    })
  }

  
 return (
    <>
      <FooHeader />
      <Switch>
        <Route exact path="/explore" component={Farms} />
        <Route exact path="/farm/add" component={RegisterFarmPage} />
        <Route exact path="/farm/:tokenId" component={Farm} />
      </Switch>
    </>
  )
}

function mapStateToProps(state) {
  return {
    wallet: state.wallet.address,
    loaded: !!state.wallet.loaded,
  }
}

export default connect(mapStateToProps)(App);
