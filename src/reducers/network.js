import {
  LOAD_NETWORK,
  NETWORK_CHANGE,
} from '../types'

export function network(state = {}, action = {}) {
  switch(action.type) {
    case LOAD_NETWORK:
      return {
        ...state,
        ...action.netId,
      } 
    case NETWORK_CHANGE:
      return {
        ...state,
        ...action.netId,
      }
    default:
      return state
  }
}

