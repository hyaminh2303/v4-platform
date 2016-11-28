import * as NationalityConstants from './nationality_constants'
import { extend } from 'lodash'

export function nationalitiesReducer(state = { data: [], total: 0, page: 0, per_page: 10 }, action) {
  switch (action.type) {
    case NationalityConstants.FETCH_NATIONALITIES_SUCCESS:
      return action.payload
    case NationalityConstants.CLEAR_NATIONALITIES:
      return action.payload
    default:
      return state
  }
}

export function nationalityReducer(state = { name: '', id: '', locales: [] }, action) {
  switch (action.type) {
    case NationalityConstants.CLEAR_NATIONALITY:
      return action.payload
    case NationalityConstants.NEW_NATIONALITY:
      return state
    case NationalityConstants.NEW_NATIONALITY_SUCCESS:
      return extend({}, state, action.payload)
    case NationalityConstants.FETCH_NATIONALITY_SUCCESS:
    case NationalityConstants.EDIT_NATIONALITY:
      return extend({}, state, action.payload.nationality)
    default:
      return state
  }
}