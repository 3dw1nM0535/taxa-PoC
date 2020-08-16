import {
  addFarm,
  queryFarm,
  openSeason,
  submitting,
} from './farm'
import { connectWallet, walletFound, disconnectMetaMask, walletChange } from './wallet'
import {
  LOCATION_ACCESS,
  NETWORK_CHANGE,
  SET_MARKET_PRICE,
} from '../types'

const locationAccess = location => ({
	type: LOCATION_ACCESS,
	location,
})

const networkChange = netId => ({
  type: NETWORK_CHANGE,
  netId,
})

const setPrices = price => ({
  type: SET_MARKET_PRICE,
  price,
})

export {
  addFarm,
  connectWallet,
	walletChange,
  walletFound,
  disconnectMetaMask,
  queryFarm,
  openSeason,
  submitting,
  networkChange,
  locationAccess,
  setPrices,
}
