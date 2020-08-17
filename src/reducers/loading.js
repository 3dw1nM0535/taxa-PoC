import {
  SUBMITTING,
  CONFIRMING_TX,
  CONFIRMED_TX,
} from '../types'

const INITIAL_STATE = {
  status: false,
  confirming: false,
  confirmed: false,
}

export function loading(state = { ...INITIAL_STATE }, action = {}) {
  switch(action.type) {
    case SUBMITTING:
      return {
        ...state,
        ...action.status,
      }
    case CONFIRMING_TX:
      return {
        ...state,
        ...action.txConfirming,
      }
    case CONFIRMED_TX:
      return {
        ...state,
        ...action.txConfirmed,
      }
    default:
      return state
  }
}
