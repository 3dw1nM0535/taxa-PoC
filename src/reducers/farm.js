import {
  QUERY_FARM,
} from '../types'

export function farm(state = {}, action = {}) {
  switch(action.type) {
    case QUERY_FARM:
      return {
        ...state,
        ...action.farm,
      }
    default:
      return state
  }
}

