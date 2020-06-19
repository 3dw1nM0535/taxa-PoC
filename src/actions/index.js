import { USER_SIGNIN } from "../types";

export function signIn(user) {
    return {
        type: USER_SIGNIN,
        user,
    }
}
