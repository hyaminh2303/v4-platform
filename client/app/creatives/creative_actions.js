import axios from 'axios'
import { forEach, keys } from 'lodash'
import _ from 'lodash'

import * as CreativeConstants from './creative_constants'
import { showNotif } from '../notification/notification_action'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'

export function clearCreatives() {
  return { type: CreativeConstants.FETCH_CREATIVES_SUCCESS,
           payload: { data: null, summary: {} } }
}

export function newCreative(adGroupId) {
  return { type: CreativeConstants.NEW_CREATIVE, payload: { adGroupId: adGroupId } }
}

export function editCreative(creative) {
  return { type: CreativeConstants.EDIT_CREATIVE, payload: { creative } }
}

export function saveCreative(creative, callback) {
  return (dispatch) => {
    dispatch(showLoading())
    const formData = new FormData()
    forEach(keys(creative), (key) => {
      if (key !== 'elements' && key !== 'attachment' && creative[key]) {
        formData.append(key, creative[key])
      }
    })
    if (creative.attachment) {
      formData.append('banner', creative.attachment)
    }
    if (creative.elements) {
      for (let i = 0; i < creative.elements.length; i++) {
        forEach(creative.elements[i], (value, key) => {
          if (key !== 'weather_conditions') {
            formData.append(`elements[]${key}`, value)
          } else {
            for (let j = 0; j < creative.elements[i].weather_conditions.length; j++) {
              forEach(creative.elements[i].weather_conditions[j], (weatherValue, weatherKey) => {
                formData.append(`elements[]weather_conditions[]${weatherKey}`, weatherValue)
              })
            }
          }
        })
      }
    }
    if (creative.id) {
      axios.put(`/creatives/${creative.id}/`, formData).then((resp) => {
        callback(resp.data)
        dispatch(hideLoading())
      }).catch((resp) => {
        dispatch(hideLoading())
        dispatch(showNotif({ message: `${resp.data.message[0]}`, style: 'danger' }))
      })
    } else {
      axios.post(`/ad_groups/${creative.ad_group_id}/creatives`, formData).then((resp) => {
        dispatch({ type: CreativeConstants.SAVE_CREATIVE_SUCCESS, payload: resp.data })
        callback(resp.data)
        dispatch(hideLoading())
      }).catch((resp) => {
        dispatch(hideLoading())
        dispatch(showNotif({ message: `${resp.data.message[0]}`, style: 'danger' }))
      })
    }
  }
}

export function fetchCreatives(adGroupId, params = {}, callback) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`/ad_groups/${adGroupId}/creatives`, { params }).then((resp) => {
      dispatch({ type: CreativeConstants.FETCH_CREATIVES_SUCCESS, payload: resp.data })
      callback(resp.data.data)
      dispatch(hideLoading())
    }).catch(() => {
      dispatch(hideLoading())
    })
  }
}

export function deleteCreative(creative, callback) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.delete(`/creatives/${creative.id}/`).then(() => {
      callback()
      dispatch(showNotif({ message: 'Delete creative successfully!',
        style: 'success' }))
      dispatch(hideLoading())
    }).catch((resp) => {
      dispatch(hideLoading())
      dispatch(showNotif({ message: `${resp.data.message}`, style: 'danger' }))
    })
  }
}

export function sortClient(creatives, columnKey, sortDir) {
  let sortedCreatives = _.sortBy(creatives, columnKey)
  if (sortDir === 'desc')
    sortedCreatives = sortedCreatives.reverse()

  return { type: CreativeConstants.FETCH_CREATIVES_SUCCESS,
    payload: { data: sortedCreatives } }
}

export function fetchCreative(creativeId) {
  return (dispatch) => {
    axios.get(`creatives/${creativeId}`).then((resp) => {
      dispatch({ type: CreativeConstants.FETCH_CREATIVE_SUCCESS, payload: resp.data })
    })
  }
}

export function fetchFonts() {
  return (dispatch) => {
    axios.get('fonts').then((resp) => {
      dispatch({ type: CreativeConstants.FETCH_FONTS_SUCCESS, payload: resp.data })
    })
  }
}

export function addElement(creative, elementType = 'default') {
  return {
    type: CreativeConstants.ADD_ELEMENT,
    payload: { creative, elementType }
  }
}

export function fetchTimeFormats() {
  return (dispatch) => {
    axios.get('time_formats').then((resp) => {
      dispatch({ type: CreativeConstants.FETCH_TIME_FORMATS_SUCCESS, payload: resp.data })
    })
  }
}

export function updateElement(creative, index, element, needClosePopup) {
  return { type: CreativeConstants.UPDATE_ELEMENT, payload: { creative, index, element, needClosePopup } }
}

export function deleteElement(creative, index) {
  return { type: CreativeConstants.DELETE_ELEMENT, payload: { creative, index } }
}

export function selectElement(creative, index) {
  return { type: CreativeConstants.OPEN_ELEMENT_FORM, payload: { creative, index } }
}

export function deselectElement(creative) {
  return { type: CreativeConstants.CLOSE_ELEMENT_FORM, payload: { creative } }
}
