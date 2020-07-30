import {
  addFarm,
  getFarm,
} from './farm'
import { connectWallet, walletFound, disconnectMetaMask, walletChange, networkChange } from './wallet'
import { LOCATION_ACCESS } from '../types'

export const locationAccess = location => ({
	type: LOCATION_ACCESS,
	location,
})

export {
  addFarm,
  connectWallet,
	walletChange,
  walletFound,
	networkChange,
  disconnectMetaMask,
  getFarm,
}
