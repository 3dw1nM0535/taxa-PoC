import {
  CONNECT_WALLET,
  WALLET_CHANGE,
  NETWORK_CHANGE,
} from '../types'

export function wallet(state = { loaded: false }, action = {}) {
  switch(action.type) {
    case CONNECT_WALLET:
      return {
        ...action.wallet,
        loaded: true,
      }
    case WALLET_CHANGE:
      return {
        ...state,
        ...action.wallet,
      }
    case NETWORK_CHANGE:
      return {
        ...state,
        ...action.wallet,
      }
    default:
      return state
  }
}

