import { SET_MARKET_PRICE } from '../types'

export function prices(state = {}, action = {}) {
  switch(action.type) {
    case SET_MARKET_PRICE:
      return {
        ...action.price,
      }
    default:
      return state
  }
}

