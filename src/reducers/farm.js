import {
  QUERY_FARM,
  SEASON_OPEN,
} from '../types'

export function farm(state = {}, action = {}) {
  switch(action.type) {
    case QUERY_FARM:
      return {
        ...state,
        ...action.farm,
      }
    case SEASON_OPEN:
      return {
        ...state,
        ...action.resp,
      }
    default:
      return state
  }
}

