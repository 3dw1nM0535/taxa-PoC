import { SUBMITTING } from '../types'

export function loading(state = { status: false }, action = {}) {
  switch(action.type) {
    case SUBMITTING:
      return {
        ...state,
        ...action.status,
      }
    default:
      return state
  }
}
