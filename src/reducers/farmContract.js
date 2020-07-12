import { LOAD_CONTRACT } from '../types'

export function contract(state = {}, action = {}) {
  switch(action.type) {
    case LOAD_CONTRACT:
      return {
        ...action.methods,
      }
    default:
      return state
  }
}
