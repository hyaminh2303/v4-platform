import { extend } from 'lodash'

export function notificationReducer(state = { isShow: false, message: '', style: '' }, action) {
  switch (action.type) {
    case 'DISPLAY_NOTIFICATION':
      return extend({}, state, action.payload)
    case 'HIDE_NOTIFICATION':
      return extend({}, state, { isShow: false, message: '' })
    default:
      return state
  }
}