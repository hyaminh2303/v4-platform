import { extend } from 'lodash'
import * as AppNameConstants from './app_name_constants'

export function appNameTrackingReducer(state = { data: null }, action) {
  switch (action.type) {
    case AppNameConstants.FETCH_APP_NAME_TRACKING_SUCCESS:
      return action.payload
    case AppNameConstants.SORT_APP_NAME_SUCCESS:
    case AppNameConstants.CLEAR_APP_NAME_SUCCESS:
      return extend({}, state, action.payload)
    default:
      return state
  }
}