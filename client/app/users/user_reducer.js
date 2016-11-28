import * as UserConstants from './user_constants'
import { extend } from 'lodash'

export function userReducer(state = { }, action) {
  switch (action.type) {
    case UserConstants.CLEAR_USER:
      return action.payload
    case UserConstants.GET_USER_SUCCESS:
    case UserConstants.NEW_USER_SUCCESS:
    case UserConstants.EDIT_USER_SUCCESS:
    case UserConstants.FETCH_USER_PROFILE_SUCCESS:
      return action.payload
    default:
      return state
  }
}

export function usersReducer(state = { data: [], total: 0, page: 1, msg: {} }, action) {
  switch (action.type) {
    case UserConstants.CLEAR_USERS:
      return action.payload
    case UserConstants.FETCH_USER_SUCCESS:
      return extend({}, state, action.payload)
    case UserConstants.DELETE_USER:
      return extend({}, state, action.payload)
    default:
      return state
  }
}

export function editPasswordReducer(state = { message: '', isShow: false }, action) {
  switch (action.type) {
    case UserConstants.EDIT_PASSWORD_FAIL:
      return extend({}, state, action.payload)
    case UserConstants.EDIT_PASSWORD_SUCCESS:
      return extend({}, state, { message: '', isShow: false })
    case UserConstants.INIT_CHANGE_PASSWORD:
      return extend({}, state, { message: '', isShow: true })
    case UserConstants.CANCEL_CHANGE_PASSWORD:
      return extend({}, state, { message: '', isShow: false })
    default:
      return state
  }
}

export function resetUserPasswordReducer(state = {}, action) {
  switch (action.type) {
    case UserConstants.RESET_USER_PASSWORD_SUCCESS:
      return extend({}, state, action.payload)
    default:
      return state
  }
}