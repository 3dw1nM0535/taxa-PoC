import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import Web3 from 'web3'
import { connect } from 'react-redux'
import { walletChange, networkChange, disconnectMetaMask, setPrices } from './actions'
import { store } from './store'
import { Switch, Route, useLocation } from 'react-router-dom'
import { UserRoute } from './components/routes'

import { ResponsiveContainer } from './components/containers'
import {
  RegisterFarmPage,
  FarmsPage,
  FarmPage,
  DormantFarms,
  PreparingFarms,
  PlantingFarms,
  GrowingFarms,
  HarvestingFarms,
} from './components/pages'

function App({ history, loaded }) {

  const location = useLocation()

  useEffect(() => {
    async function calculateEthPrice() {
      const etherConversionRate = {}
      let currencyResp
      const etherFetchResult = await fetch(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`)
      const { result } = await etherFetchResult.json()
      const currencyFetchResult = await fetch(`https://currency-exchange.p.rapidapi.com/exchange?q=1.0&from=USD&to=KES`, {
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "currency-exchange.p.rapidapi.com",
          "x-rapidapi-key": `${process.env.REACT_APP_RAPID_X_API_KEY}`
        }
      })
      currencyResp = await currencyFetchResult.json()
      const latestPrice = Number(result.ethusd) * Number(currencyResp)
      etherConversionRate.ethkes = latestPrice.toFixed(2)
      store.dispatch(setPrices({ ...etherConversionRate }))
    }
    const interval = setInterval(() => {
      calculateEthPrice()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  let walletAddress = {}
  const isWindowEthereum = window.ethereum !== undefined

  if (isWindowEthereum) {
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
        <UserRoute location={location} path='/farm/:tokenId/' component={FarmPage} />
        <Route location={location} exact path='/' component={FarmsPage} />
        <Route location={location} exact path='/tokenize/' component={RegisterFarmPage} />
        <Route location={location} exact path='/dormant/' component={DormantFarms} />
        <Route location={location} exact path='/preparations/' component={PreparingFarms} />
        <Route location={location} exact path='/planting/' component={PlantingFarms} />
        <Route location={location} exact path='/growth/' component={GrowingFarms} />
        <Route location={location} exact path='/harvesting/' component={HarvestingFarms} />
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

