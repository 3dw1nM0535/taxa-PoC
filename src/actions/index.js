import { addFarm } from './farm'
import { connectWallet, walletChange, networkChange } from './wallet'
import { LOCATION_ACCESS } from '../types'

export const locationAccess = location => ({
	type: LOCATION_ACCESS,
	location,
})

export {
  addFarm,
  connectWallet,
	walletChange,
	networkChange,
}
