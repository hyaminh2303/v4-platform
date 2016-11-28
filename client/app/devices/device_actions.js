import axios from 'axios'
import * as DevicesConstant from './device_constants'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'
import { sortBy } from 'lodash'

export function clearDevicesTrackingCreatives() {
  return { type: DevicesConstant.FETCH_DEVICES_SUCCESS,
          payload: { data: null, summary: {} } }
}

export function fetchDevicesTracking(adGroupId, callback) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`ad_groups/${adGroupId}/device_trackings`).then((resp) => {
      dispatch({ type: DevicesConstant.FETCH_DEVICES_SUCCESS, payload: resp.data })
      callback(resp.data.data)
      dispatch(hideLoading())
    })
  }
}

export function sortDevices(devices, columnKey, sortDir) {
  let sortedDevices = sortBy(devices, columnKey)
  if (sortDir === 'desc')
    sortedDevices = sortedDevices.reverse()
  return {
    type: DevicesConstant.SORT_DEVICES_SUCCESS,
    payload: { data: sortedDevices }
  }
}