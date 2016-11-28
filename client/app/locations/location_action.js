import * as LocationConstants from './location_constants'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'
import { sortBy } from 'lodash'
import axios from 'axios'

export function sortLocationTrackings(locations, columnKey, sortDir) {
  let sortedlocations = sortBy(locations, columnKey)
  if (sortDir === 'desc')
    sortedlocations = sortedlocations.reverse()
  return {
    type: LocationConstants.SORT_LOCATIONS_SUCCESS,
    payload: { data: sortedlocations }
  }
}

export function fetchLocationTracking(adGroupId, callback) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`ad_groups/${adGroupId}/location_trackings`).then((resp) => {
      dispatch({ type: LocationConstants.FETCH_LOCATION_TRACKING_SUCCESS, payload: resp.data })
      callback(resp.data.data)
      dispatch(hideLoading())
    })
  }
}

export function clearLocationTracking() {
  return { type: LocationConstants.FETCH_LOCATION_TRACKING_SUCCESS,
           payload: { data: null } }
}