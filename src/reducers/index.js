import { combineReducers } from 'redux'

// Reducers
import { farm } from './farm'
import { loading } from './loading'
import { wallet } from './wallet'
import { location } from './location'
import { network } from './network'
import { prices } from './prices'

export default combineReducers({
  farm,
  loading,
  wallet,
	location,
  network,
  prices,
})

