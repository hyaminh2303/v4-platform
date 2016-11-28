import * as AdGroupConstants from './ad_group_constants'
import * as OsConstants from '../operating_system/operating_system_constants'
import { extend } from 'lodash'
import moment from 'moment'

export function adGroupReducer(state = { ad_group: { locations: [] } }, action) {
  switch (action.type) {
    case AdGroupConstants.CLEAR_ADGROUP:
      return action.payload
    case AdGroupConstants.NEW_AD_GROUP:
      return extend({}, state, {
        ad_group: {
          start_date: moment(),
          end_date: moment(),
          campaign_id: action.payload.campaignId
        }, campaign: {}, locations: [] })
    case AdGroupConstants.FETCH_AD_GROUP_SUCCESS:
    case AdGroupConstants.EDIT_AD_GROUP_SUCCESS:
    case AdGroupConstants.NEW_AD_GROUP_SUCCESS:
      return extend({}, state, action.payload)
    case AdGroupConstants.CHECK_AD_LOCATION_SUCCESS:
      state.ad_group.locations = action.payload
      return state
    case AdGroupConstants.DELETE_AD_LOCATIONS:
      state.ad_group.locations = undefined
      return state
    case AdGroupConstants.CHECK_AD_LOCATION_FAIL:
    case AdGroupConstants.RESET_ADGROUP_LOCATIONS:
      state.ad_group.locations = []
      return state
    default:
      return state
  }
}

export function adGroupsReducer(state = { data: [], total: {}, msg: {} }, action) {
  switch (action.type) {
    case AdGroupConstants.CLEAR_ADGROUPS:
      return action.payload
    case AdGroupConstants.FETCH_AD_GROUPS_SUCCESS:
    case AdGroupConstants.DELETE_AD_GROUP_SUCCESS:
      return action.payload
    case AdGroupConstants.SORT_ADGROUPS_SUCCESS:
      return extend({}, state, action.payload)
    default:
      return state
  }
}

export function adGroupDateTracking(state = { data: null }, action) {
  switch (action.type) {
    case AdGroupConstants.FETCH_DATE_TRACKING_SUCCESS:
      return action.payload
    default:
      return state
  }
}

export function adGroupOsTracking(state = { data: null, summary: {} }, action) {
  switch (action.type) {
    case OsConstants.FETCH_OS_TRACKING_SUCCESS:
      return action.payload
    default:
      return state
  }
}
