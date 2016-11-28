import axios from 'axios'
import * as LanguageConstants from './language_constants'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'
import { sortBy } from 'lodash'

export function fetchLanguageTrackings(adGroupId, callback) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`ad_groups/${adGroupId}/language_trackings`).then((resp) => {
      dispatch({
        type: LanguageConstants.FETCH_LANGUAGES_TRACKING_SUCCESS,
        payload: resp.data
      })
      callback(resp.data.data)
      dispatch(hideLoading())
    })
  }
}

export function sortLanguages(languages, columnKey, sortDir) {
  let sortedLanguages = sortBy(languages, columnKey)
  if (sortDir === 'desc')
    sortedLanguages = sortedLanguages.reverse()
  return {
    type: LanguageConstants.SORT_LANGUAGES_SUCCESS,
    payload: { data: sortedLanguages }
  }
}

export function clearLanguageTrackings() {
  return {
    type: LanguageConstants.CLEAR_LANGUAGES_SUCCESS,
    payload: { data: null }
  }
}