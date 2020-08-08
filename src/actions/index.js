import {
  addFarm,
  queryFarm,
  openSeason,
} from './farm'
import { connectWallet, walletFound, disconnectMetaMask, walletChange } from './wallet'
import {
  LOCATION_ACCESS,
  NETWORK_CHANGE,
} from '../types'

export const locationAccess = location => ({
	type: LOCATION_ACCESS,
	location,
})

export const networkChange = netId => ({
  type: NETWORK_CHANGE,
  netId,
})

export {
  addFarm,
  connectWallet,
	walletChange,
  walletFound,
  disconnectMetaMask,
  queryFarm,
  openSeason,
}
