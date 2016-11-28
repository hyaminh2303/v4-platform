import * as PasswordConstants from './forgot_password_constants'
import { extend } from 'lodash'

export function forgotPasswordReducer(state = { message: '' }, action) {
  switch (action.type) {
    case PasswordConstants.SENT_PASSWORD_INSTRUCTION_FAIL:
      return extend({}, state, action.payload)
    default:
      return state
  }
}