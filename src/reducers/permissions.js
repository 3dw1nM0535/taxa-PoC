import {
  GRANT_LOCATION_PERMISSION,
  GRANT_LOCATION_PERMISSION_ERROR,
} from '../types'

export function permissions(state = {}, action = {}) {
  switch(action.type) {
    case GRANT_LOCATION_PERMISSION:
      return {
        ...state,
        ...action.state
      }
    case GRANT_LOCATION_PERMISSION_ERROR:
      return {
        ...state,
        ...action.error,
      }
    default:
      return state
  }
}
