import { USER_SIGNIN, INIT_DB } from "../types";

// Load user action creator
export function signIn(user) {
  return {
    type: USER_SIGNIN,
    user,
  }
}

// Load database action creator
export function initDB(orbitdbInstance) {
  return {
    type: INIT_DB,
    orbitdbInstance,
  }
}
