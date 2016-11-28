import * as DevicesConstant from './device_constants'
import { extend } from 'lodash'


export function devicesReducer(state = { data: null, total_data: {} }, action) {
  switch (action.type) {
    case DevicesConstant.FETCH_DEVICES_SUCCESS:
      return extend({}, state, action.payload)
    case DevicesConstant.SORT_DEVICES_SUCCESS:
      return extend({}, state, action.payload)
    default:
      return state
  }
}