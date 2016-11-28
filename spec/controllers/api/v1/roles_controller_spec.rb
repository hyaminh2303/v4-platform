require 'rails_helper'
require 'support/controller_helpers'

describe Api::V1::RolesController do
  include ControllerHelpers

  before(:each) do
    authenticate_request
  end

  describe 'GET #index' do
    it 'returns list of roles' do
      Role.destroy_all
      create(:role, :admin)
      create(:role, :super_admin)

      get :index

      expect(response).to be_success
      expect(response).to render_template(:index)
      expect(assigns(:roles).length).to eq(2)
    end
  end
end
