import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from './app'
import Dashboard from './dashboard'

import ForgotPassword from './forgot_passwords/forgot_password'
import ResetPassword from './forgot_passwords/reset_password'

import UserNew from './users/user_new/'
import UserList from './users/user_list/'
import UserProfile from './users/user_new/user_profile'

import CampaignList from './campaigns/campaign_list/'
import CampaignNew from './campaigns/campaign_new/'
import CampaignDetail from './campaigns/campaign_detail/'

import AdGroupNew from './ad_groups/ad_group_new/'
import AdGroupDetail from './ad_groups/ad_group_detail/'
import CreativePreview from './creatives/creative_preview'
import VastGenerator from './vast_generator/'

import NationalityList from './nationalities/nationality_list/'
import NationalityNew from './nationalities/nationality_new/'

const routes =
  <Route>
    <Route path="/forgot_password" component={ForgotPassword} />
    <Route path="/recoveries/:token" component={ResetPassword} />
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard} />
      <Route path="dashboard" component={Dashboard} />
      <Route
        path="campaigns(?page=:page&sort_by=:sort_by&sort_dir=:sort_dir)"
        component={CampaignList} />
      <Route path="campaigns/new" component={CampaignNew} />
      <Route path="campaigns/:id/edit" component={CampaignNew} />
      <Route path="campaigns/:id" component={CampaignDetail} />
      <Route path="campaigns/:campaignId/ad_groups/new" component={AdGroupNew} />
      <Route path="/ad_groups/:id/edit" component={AdGroupNew} />
      <Route path="ad_groups/:id(?wizard)" component={AdGroupDetail} />
      <Route path="creatives/:id/preview" component={CreativePreview} />

      <Route path="users/new" component={UserNew} />
      <Route path="users/:id/edit" component={UserNew} />
      <Route path="/profile" component={UserProfile} />
      <Route path="users(?page=:page&sort_by=:sort_by&sort_dir=:sort_dir&query=:query)" component={UserList} />
      <Route path="/vast_generator" component={VastGenerator} />
      <Route path="/nationalities" component={NationalityList} />
      <Route path="/nationalities/new" component={NationalityNew} />
      <Route path="/nationalities/:id/edit" component={NationalityNew} />
    </Route>
  </Route>

export default routes
