import { extend } from 'lodash'
import * as CarrierNameConstants from './carrier_name_constants'

export function carrierNameTrackingReducer(state = { data: null }, action) {
  switch (action.type) {
    case CarrierNameConstants.FETCH_CARRIER_NAME_TRACKING_SUCCESS:
      return action.payload
    case CarrierNameConstants.SORT_CARRIER_NAME_SUCCESS:
    case CarrierNameConstants.CLEAR_CARRIER_NAME_SUCCESS:
      return extend({}, state, action.payload)
    default:
      return state
  }
}