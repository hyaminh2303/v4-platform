import * as VastConstants from './vast_constants'
import { extend } from 'lodash'

export function vastDataReducer(state = { data: null }, action) {
  switch (action.type) {
    case VastConstants.FETCH_VAST_DATA_SUCCESS:
      return action.payload
    default:
      return state
  }
}

export function vastReducer( state = initVast, action) {
  switch (action.type) {
    case VastConstants.CLEAR_OLD_VAST:
      return extend({}, state, initVast)
    case VastConstants.CREATE_VAST_SUCCESS:
      return extend({}, state, action.payload)
    case VastConstants.LOAD_VAST_SUCCESS:
      return extend({}, state, action.payload.vast)
    default:
      return state
  }
}

const initVast = {
  'ad_system' : '',
  'ad_title': '',
  'description': '',
  'creative_type': 'preroll',
  'has_companion_ad': false,
  'error_url': '',
  'impression_url': '',
  'skipoffset': '',
  'duration': '',
  'click_through': '',
  'click_tracking_url': '',
  'event': '',
  'tracking_event_url': '',
  'resource_url': '',
  'resource_type': '',
  'com_resource_file': '',
  'com_resource_type': '',
  'com_resource_url': '',
  'com_width': '',
  'com_height': '',
  'com_click_through': '',
  'com_click_tracking_url': '',
  'com_event': '',
  'com_tracking_event_url': '',
  'vast_xml': '',
  'vast_url': ''
}
