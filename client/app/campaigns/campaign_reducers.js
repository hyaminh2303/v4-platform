import { extend } from 'lodash'
import moment from 'moment'

import * as CampaignConstants from './campaign_constants'

const initialCampaignState = {
  countries: [],
  campaign_types: [
    { value: 'cpc', label: 'CPC' },
    { value: 'cpm', label: 'CPM' }
  ],
  categories: [],
  campaign: {
    name: null,
    start_date: moment(),
    end_date: moment()
  }
}
const initialCampaignsState = {
  page: 1,
  sortBy: null,
  sortDir: null,
  data: []
}

export function campaignReducer(state = initialCampaignState, action) {
  switch (action.type) {
    case CampaignConstants.CLEAR_CAMPAIGN:
      return action.payload
    case CampaignConstants.NEW_CAMPAIGN:
      return initialCampaignState
    case CampaignConstants.NEW_CAMPAIGN_SUCCESS:
      return extend({}, initialCampaignState, action.payload)
    case CampaignConstants.FETCH_CAMPAIGN_SUCCESS:
    case CampaignConstants.EDIT_CAMPAIGN:
      return extend({}, initialCampaignState, action.payload)
    default:
      return state
  }
}

export function campaignsReducer(state = initialCampaignsState, action) {
  switch (action.type) {
    case CampaignConstants.CLEAR_CAMPAIGNS:
      return action.payload
    case CampaignConstants.FETCH_CAMPAIGNS:
      return extend({}, state, {
        page: action.payload.page,
        sortBy: action.payload.sortBy,
        sortDir: action.payload.sortDir
      })
    case CampaignConstants.FETCH_CAMPAIGNS_SUCCESS:
      let newState = extend({}, action.payload)
      return extend({}, state, newState)
    default:
      return state
  }
}
