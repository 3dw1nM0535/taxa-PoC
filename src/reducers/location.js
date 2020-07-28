import { LOCATION_ACCESS } from '../types'

const initialState = { lon: "0", lat: "0" }

export function location(state = initialState, action = {}) {
	switch(action.type) {
		case LOCATION_ACCESS:
			return {
				...action.location,
			}
		default:
			return state
	}
}
