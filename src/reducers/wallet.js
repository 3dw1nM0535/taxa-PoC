import {
  CONNECT_WALLET,
  WALLET_CHANGE,
  METAMASK_DISCONNECT
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
    case METAMASK_DISCONNECT:
      return { loaded: false }
    default:
      return state
  }
}

