import axios from 'axios'
import { push } from 'react-router-redux'
import moment from 'moment'
import { sortBy } from 'lodash'
import { filter } from 'lodash'
import * as AdGroupConstants from './ad_group_constants'

import { showNotif } from '../notification/notification_action'
import { closeAlert } from '../notification/notification_action'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'

export function clearAdGroup() {
  return { type: AdGroupConstants.CLEAR_ADGROUP, payload: { ad_group: { locations: [] } } }
}

export function clearAdGroups() {
  return { type: AdGroupConstants.CLEAR_ADGROUPS, payload: { data:[] } }
}

export function saveAdGroup(group, wizard = '') {
  group.start_date = moment(group.start_date).format('YYYY-MM-DD')
  group.end_date = moment(group.end_date).format('YYYY-MM-DD')

  return (dispatch) => {
    dispatch(showLoading())
    if (group.id) {
      axios.put(`/ad_groups/${group.id}`, group).then(() => {
        dispatch(push(`/campaigns/${group.campaign_id}`))
        dispatch(hideLoading())
      }).catch((resp) => {
        dispatch(showNotif({ message: resp.data.message, style: 'danger' }))
        dispatch(hideLoading())
      })
    } else {
      axios.post(`/campaigns/${group.campaign_id}/ad_groups`, group).then((resp) => {
        dispatch(push(`/ad_groups/${resp.data.id}${wizard}`))
        dispatch(hideLoading())
      }).catch((resp) => {
        dispatch(hideLoading())
        dispatch(showNotif({ message: resp.data.message, style: 'danger' }))
      })
    }
  }
}

export function newAdGroup(campaignId) {
  return (dispatch) => {
    dispatch(showLoading())
    dispatch({ type: AdGroupConstants.NEW_AD_GROUP, payload: { campaignId: campaignId } })
    dispatch(closeAlert())
    axios.get(`/campaigns/${campaignId}/ad_groups/new`).then((resp) => {
      dispatch({ type: AdGroupConstants.NEW_AD_GROUP_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function editAdGroup(id) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`/ad_groups/${id}/edit`).then((resp) => {
      dispatch({ type: AdGroupConstants.EDIT_AD_GROUP_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function fetchAdGroup(adGroupId) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`/ad_groups/${adGroupId}`).then((resp) => {
      dispatch({ type: AdGroupConstants.FETCH_AD_GROUP_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function fetchAdGroups(campaignId, params) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`/campaigns/${campaignId}/ad_groups`, { params }).then((resp) => {
      dispatch({ type: AdGroupConstants.FETCH_AD_GROUPS_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function deleteAdGroup(group, campaignId) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.delete(`/ad_groups/${group.id}`).then(() => {
      dispatch(showNotif({ message: 'Delete AdGroup successfully!', style: 'success' }))
      dispatch(fetchAdGroups(campaignId))
      dispatch(hideLoading())
    }).catch(() => {
      dispatch(hideLoading())
      dispatch(showNotif({ message: 'Can not delete this AdGroup', style: 'danger' }))
    })
  }
}

export function checkAdLocation(attachment, isTargetLocation) {
  let formData = new FormData()
  formData.append('attachment', attachment)
  return (dispatch) => {
    dispatch(showLoading())
    axios.post(`/locations/check_locations?is_target_location=${isTargetLocation}`, formData).then((resp) => {
      let numberLocationInValid = filter(resp.data.locations, { 'valid': false }).length
      if (numberLocationInValid !== 0) {
        let numberLocationValid = filter(resp.data.locations, { 'valid': true }).length
        dispatch(
          showNotif({
            message: `Number of locations: Valid: ${numberLocationValid}, Invalid: ${numberLocationInValid}`,
            style: 'danger'
          })
        )
      }
      dispatch({ type: AdGroupConstants.CHECK_AD_LOCATION_SUCCESS, payload: resp.data.locations })
      dispatch(hideLoading())
      if (resp.data.message !== null)
        dispatch(showNotif({ message: resp.data.message, style: 'danger' }))
    })
  }
}

export function killAdGroupLocations() {
  return (dispatch) => {
    dispatch(closeAlert())
    dispatch({ type: AdGroupConstants.DELETE_AD_LOCATIONS })
  }
}

export function resetAdGroupLocations() {
  return (dispatch) => {
    dispatch(closeAlert())
    dispatch({ type: AdGroupConstants.RESET_ADGROUP_LOCATIONS })
  }
}

export function clearDateTrackingCreatives() {
  return { type: AdGroupConstants.FETCH_DATE_TRACKING_SUCCESS,
           payload: { data: null, summary: {} } }
}

export function fetchDateTracking(adGroupId, callback) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`ad_groups/${adGroupId}/date_trackings`).then((resp) => {
      callback(resp.data)
      dispatch(hideLoading())
      dispatch({ type: AdGroupConstants.FETCH_DATE_TRACKING_SUCCESS, payload: resp.data })
    })
  }
}

export function sortDateTrackingClient(trackingData, columnKey, sortDir) {
  let sorted = sortBy(trackingData.data, columnKey)
  if (sortDir === 'desc')
    sorted = sorted.reverse()
  trackingData.data = sorted
  return { type: AdGroupConstants.FETCH_DATE_TRACKING_SUCCESS,
    payload: trackingData }
}

export function sortAdGroups(adGroups, columnKey, sortDir) {
  let adGroupSorted = sortBy(adGroups, columnKey)
  if (sortDir === 'desc')
    adGroupSorted = adGroupSorted.reverse()
  return { type: AdGroupConstants.SORT_ADGROUPS_SUCCESS,
    payload: { data: adGroupSorted } }
}