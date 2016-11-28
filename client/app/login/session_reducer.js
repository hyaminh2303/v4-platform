import * as SessionConstants from './session_constants'

export function sessionReducer(state = { isAuthenticated: false, isLoading: true }, action) {
  switch (action.type) {
    case SessionConstants.CHECK_AUTH_TOKEN:
      return {
        isAuthenticated: false,
        isLoading: true
      }
    case SessionConstants.UPDATE_USER_SUCCESS:
    case SessionConstants.LOGIN_SUCCESS:
      return {
        isAuthenticated: true,
        auth_token: action.payload.auth_token,
        role_key: action.payload.role_key,
        name: action.payload.name,
        id: action.payload.id,
        isLoading: false
      }
    case SessionConstants.LOGIN_FAIL:
      return {
        isAuthenticated: false,
        isLoading: false
      }
    case SessionConstants.LOG_OUT:
      return { isAuthenticated: false }
    default:
      return state
  }
}
