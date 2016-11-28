import * as LocationConstants from './location_constants'
import { extend } from 'lodash'


export function locationTrackingsReducer(state = { data: null, total: {} }, action) {
  switch (action.type) {
    case LocationConstants.SORT_LOCATIONS_SUCCESS:
    case LocationConstants.FETCH_LOCATION_TRACKING_SUCCESS:
      return extend({}, state, action.payload)
    default:
      return state
  }
}