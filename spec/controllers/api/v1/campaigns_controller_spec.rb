require 'rails_helper'
require 'support/controller_helpers'

describe Api::V1::CampaignsController do
  include ControllerHelpers

  before(:each) do
    authenticate_request
  end

  describe 'GET #index' do
    it 'returns list of campaigns' do
      create_list(:campaign, 10)

      get :index

      expect(response).to be_success
      expect(response).to render_template(:index)
      expect(assigns(:campaigns).length).to eq(10)
    end
  end
end
