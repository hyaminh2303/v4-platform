import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { routerReducer } from 'react-router-redux'
import { reducer as notifReducer } from 're-notif'
import { notificationReducer } from './notification/notification_reducer'

import { userReducer,
        usersReducer,
        resetUserPasswordReducer,
        editPasswordReducer } from './users/user_reducer'

import { forgotPasswordReducer } from './forgot_passwords/forgot_password_reducer'

import { sessionReducer } from './login/session_reducer'

import { campaignReducer, campaignsReducer } from './campaigns/campaign_reducers'
import { adGroupReducer, adGroupsReducer, adGroupDateTracking,
         adGroupOsTracking } from './ad_groups/ad_group_reducers'
import { LanguageTrackingReducer } from './languages/language_reducer'
import { appNameTrackingReducer } from './app_names/app_name_reducer'
import { exchangeTrackingReducer } from './exchanges/exchange_reducer'
import { carrierNameTrackingReducer } from './carrier_names/carrier_name_reducer'
import { creativesReducer,
         creativeReducer,
         fontsReducer, timeFormatsReducer } from './creatives/creative_reducers'
import { loadingPageReducer } from './loading_page/loading_page_reducer'
import { dashboardSummaryReducer } from './dashboard/dashboard_reducer'
import { devicesReducer } from './devices/device_reducers'
import { locationTrackingsReducer } from './locations/location_reducers'
import { vastDataReducer, vastReducer } from './vast_generator/vast_reducer'
import { nationalityReducer, nationalitiesReducer } from './nationalities/nationality_reducers'

const appReducer = combineReducers({
  session: sessionReducer,
  user: userReducer,
  users: usersReducer,
  forgotPassword: forgotPasswordReducer,
  editPassword: editPasswordReducer,
  resetUserPassword: resetUserPasswordReducer,
  campaign: campaignReducer,
  campaigns: campaignsReducer,
  devices: devicesReducer,
  adGroup: adGroupReducer,
  adGroups: adGroupsReducer,
  adGroupDateTracking: adGroupDateTracking,
  languageTrackings: LanguageTrackingReducer,
  appNameTrackings: appNameTrackingReducer,
  carrierNameTrackings: carrierNameTrackingReducer,
  exchangeTrackings: exchangeTrackingReducer,
  adGroupOsTracking: adGroupOsTracking,
  locationTrackings: locationTrackingsReducer,
  form: formReducer,
  routing: routerReducer,
  notifs: notifReducer,
  notification: notificationReducer,
  creatives: creativesReducer,
  creative: creativeReducer,
  loadingPage: loadingPageReducer,
  dashboardSummary: dashboardSummaryReducer,
  fonts: fontsReducer,
  timeFormats: timeFormatsReducer,
  vastData: vastDataReducer,
  vast: vastReducer,
  nationalities: nationalitiesReducer,
  nationality: nationalityReducer
})

export default appReducer
