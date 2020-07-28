import {
  REGISTER_FARM,
} from '../types'

export function farm(state = {}, action = {}) {
  switch(action.type) {
    case REGISTER_FARM:
      return {
        ...state,
        ...action.status,
      }
    default:
      return state
  }
}
