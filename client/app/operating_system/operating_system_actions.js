import axios from 'axios'
import _ from 'lodash'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'
import * as OsConstants from './operating_system_constants'

export function sortOsTrackingClient(trackingData, columnKey, sortDir) {
  let sorted = _.sortBy(trackingData.data, columnKey)
  if (sortDir === 'desc')
    sorted = sorted.reverse()
  trackingData.data = sorted
  return { type: OsConstants.FETCH_OS_TRACKING_SUCCESS,
    payload: trackingData }
}

export function fetchOsTracking(adGroupId, callback) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`ad_groups/${adGroupId}/os_trackings`).then((resp) => {
      callback(resp.data)
      dispatch(hideLoading())
      dispatch({ type: OsConstants.FETCH_OS_TRACKING_SUCCESS, payload: resp.data })
    })
  }
}

export function clearOsTracking() {
  return { type: OsConstants.FETCH_OS_TRACKING_SUCCESS,
          payload: { data: null, summary: {} } }
}