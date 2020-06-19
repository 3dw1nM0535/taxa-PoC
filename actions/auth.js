import { USER_SIGNIN } from "../types";

export function signIn(address) {
    return {
        type: USER_SIGNIN,
        address
    }
}
