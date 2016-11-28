import * as ExchangeConstants from './exchange_constants'
import { extend } from 'lodash'


export function exchangeTrackingReducer(state = { data: null, total: {} }, action) {
  switch (action.type) {
    case ExchangeConstants.SORT_EXCHANGE_SUCCESS:
    case ExchangeConstants.FETCH_EXCHANGE_TRACKING_SUCCESS:
      return extend({}, state, action.payload)
    default:
      return state
  }
}