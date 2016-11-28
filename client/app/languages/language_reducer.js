import { extend } from 'lodash'
import * as LanguageConstants from './language_constants'

export function LanguageTrackingReducer(state = { data: null }, action) {
  switch (action.type) {
    case LanguageConstants.FETCH_LANGUAGES_TRACKING_SUCCESS:
      return action.payload
    case LanguageConstants.SORT_LANGUAGES_SUCCESS:
    case LanguageConstants.CLEAR_LANGUAGES_SUCCESS:
      return extend({}, state, action.payload)
    default:
      return state
  }
}