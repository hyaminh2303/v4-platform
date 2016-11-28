import axios from 'axios'
import * as AppNameConstants from './app_name_constants'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'
import { sortBy } from 'lodash'

export function fetchAppNameTracking(adGroupId, callback) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`ad_groups/${adGroupId}/app_name_trackings`).then((resp) => {
      dispatch({
        type: AppNameConstants.FETCH_APP_NAME_TRACKING_SUCCESS,
        payload: resp.data
      })
      callback(resp.data.data)
      dispatch(hideLoading())
    })
  }
}

export function sortAppName(appNames, columnKey, sortDir) {
  let sortedAppNames = sortBy(appNames, columnKey)
  if (sortDir === 'desc')
    sortedAppNames = sortedAppNames.reverse()
  return {
    type: AppNameConstants.SORT_APP_NAME_SUCCESS,
    payload: { data: sortedAppNames }
  }
}

export function clearAppNameTrackings() {
  return {
    type: AppNameConstants.CLEAR_APP_NAME_SUCCESS,
    payload: { data: null }
  }
}