import axios from 'axios'
import * as CarrierNameConstants from './carrier_name_constants'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'
import { sortBy } from 'lodash'

export function fetchCarrierNameTrackings(adGroupId, callback) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`ad_groups/${adGroupId}/carrier_name_trackings`).then((resp) => {
      dispatch({
        type: CarrierNameConstants.FETCH_CARRIER_NAME_TRACKING_SUCCESS,
        payload: resp.data
      })
      callback(resp.data.data)
      dispatch(hideLoading())
    })
  }
}

export function sortCarrierName(carrierNames, columnKey, sortDir) {
  let sortedCarrierNames = sortBy(carrierNames, columnKey)
  if (sortDir === 'desc')
    sortedCarrierNames = sortedCarrierNames.reverse()
  return {
    type: CarrierNameConstants.SORT_CARRIER_NAME_SUCCESS,
    payload: { data: sortedCarrierNames }
  }
}

export function clearCarrierNameTrackings() {
  return {
    type: CarrierNameConstants.CLEAR_CARRIER_NAME_SUCCESS,
    payload: { data: null }
  }
}