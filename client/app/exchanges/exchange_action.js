import * as ExchangeConstants from './exchange_constants'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'
import { sortBy } from 'lodash'
import axios from 'axios'

export function sortExchangeTrackings(exchanges, columnKey, sortDir) {
  let sortedExchanges = sortBy(exchanges, columnKey)
  if (sortDir === 'desc')
    sortedExchanges = sortedExchanges.reverse()
  return {
    type: ExchangeConstants.SORT_EXCHANGE_SUCCESS,
    payload: { data: sortedExchanges }
  }
}

export function fetchExchangeTracking(adGroupId, callback) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`ad_groups/${adGroupId}/exchange_trackings`).then((resp) => {
      dispatch({ type: ExchangeConstants.FETCH_EXCHANGE_TRACKING_SUCCESS, payload: resp.data })
      callback(resp.data.data)
      dispatch(hideLoading())
    })
  }
}

export function clearExchangeTracking() {
  return { type: ExchangeConstants.FETCH_EXCHANGE_TRACKING_SUCCESS,
           payload: { data: null } }
}