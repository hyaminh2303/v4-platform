import axios from 'axios'
import { push } from 'react-router-redux'
import moment from 'moment'

import * as CampaignConstants from './campaign_constants'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'
import { showNotif } from '../notification/notification_action'

const MAX_RECORDS = 10


export function clearCampaigns() {
  return { type: CampaignConstants.CLEAR_CAMPAIGNS, payload: { data: [] } }
}

export function clearCampaign() {
  return { type: CampaignConstants.CLEAR_CAMPAIGN, payload: {} }
}

export function fetchCampaign(id) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`/campaigns/${id}`).then((resp) => {
      dispatch({ type: CampaignConstants.FETCH_CAMPAIGN_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

function requestCampaigns(params) {
  return {
    type: CampaignConstants.FETCH_CAMPAIGNS,
    payload: params
  }
}

export function fetchCampaigns(params) {
  return (dispatch) => {
    dispatch(showLoading())
    dispatch(requestCampaigns(params))
    axios.get('/campaigns', { params: {
      page: params.page,
      per_page: MAX_RECORDS,
      sort_by: params.sort_by,
      sort_dir: params.sort_dir,
      query: params.query }
    }).then((resp) => {
      dispatch({ type: CampaignConstants.FETCH_CAMPAIGNS_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function newCampaign() {
  return (dispatch) => {
    dispatch(showLoading())
    dispatch({ type: CampaignConstants.NEW_CAMPAIGN })
    axios.get('/campaigns/new').then((resp) => {
      dispatch({ type: CampaignConstants.NEW_CAMPAIGN_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function editCampaign(id) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`/campaigns/${id}/edit`).then((resp) => {
      dispatch({ type: CampaignConstants.EDIT_CAMPAIGN, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function deleteCampaign(id, callback) {
  return (dispatch) => {
    axios.delete(`/campaigns/${id}`).then(() => {
      callback()
      dispatch(showNotif({ message: 'Delete campaign successfully!', style: 'success' }))
    }).catch(() => {
      dispatch(showNotif({ message: 'Can not delete this campaign', style: 'danger' }))
    })
  }
}

export function saveCampaign(campaign) {
  campaign.start_date = moment(campaign.start_date).format('YYYY-MM-DD')
  campaign.end_date = moment(campaign.end_date).format('YYYY-MM-DD')
  return (dispatch) => {
    dispatch(showLoading())
    if (campaign.id) {
      axios.put(`/campaigns/${campaign.id}`, campaign).then(() => {
        dispatch(push('/campaigns'))
        dispatch(hideLoading())
      })
    } else {
      axios.post('/campaigns', campaign).then((resp) => {
        dispatch(push(`/campaigns/${resp.data.id}/ad_groups/new?wizard=1`))
        dispatch(hideLoading())
      })
    }
  }
}
