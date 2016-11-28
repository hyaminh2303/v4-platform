import axios from 'axios'
import * as NationalityConstants from './nationality_constants'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'
import { showNotif } from '../notification/notification_action'
import { push } from 'react-router-redux'

export function fetchNationalityList(params) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get('/nationalities', { params }).then((resp) => {
      dispatch({ type: NationalityConstants.FETCH_NATIONALITIES_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function clearNationalities() {
  return { type: NationalityConstants.CLEAR_NATIONALITIES, payload: { data: [], total: 0 } }
}

export function deleteNationality(id, callback) {
  return (dispatch) => {
    axios.delete(`/nationalities/${id}`).then(() => {
      callback()
      dispatch(showNotif({ message: 'Delete nationality successfully!', style: 'success' }))
    }).catch(() => {
      dispatch(showNotif({ message: 'Can not delete this nationality', style: 'danger' }))
    })
  }
}

export function clearNationality() {
  return { type: NationalityConstants.CLEAR_NATIONALITY, payload: {} }
}

export function fetchNationality(id) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`/nationalities/${id}`).then((resp) => {
      dispatch({ type: NationalityConstants.FETCH_NATIONALITY_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function newNationality() {
  return (dispatch) => {
    dispatch(showLoading())
    dispatch({ type: NationalityConstants.NEW_NATIONALITY })
    dispatch({ type: NationalityConstants.NEW_NATIONALITY_SUCCESS, payload: { name: '', locales: {} } })
    dispatch(hideLoading())
  }
}

export function editNationality(id) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`/nationalities/${id}/edit`).then((resp) => {
      dispatch({ type: NationalityConstants.EDIT_NATIONALITY, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function saveNationality(nationality) {
  return (dispatch) => {
    dispatch(showLoading())
    if (nationality.id) {
      axios.put(`/nationalities/${nationality.id}`, nationality).then(() => {
        dispatch(push('/nationalities'))
        dispatch(hideLoading())
      })
    } else {
      axios.post('/nationalities', nationality).then(() => {
        dispatch(push('/nationalities'))
        dispatch(hideLoading())
      })
    }
  }
}
