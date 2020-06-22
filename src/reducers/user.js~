import { USER_SIGNIN } from "../types";

export function user(state = { loaded: true }, action) {
    switch(action.type) {
        case USER_SIGNIN:
            return { ...action.user, loaded: true }
        default:
            return state;
    }
}
