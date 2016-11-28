require 'rails_helper'
require 'support/api_helpers'

describe 'Campaign API' do
  include ApiHelpers

  before(:each) do
    @super_admin = create(:user, role: create(:role, :super_admin))
    @admin = create(:user)
  end

  describe 'GET /api/v1/campaigns' do
    it 'returns list of campaigns' do
      create_list(:campaign, 10)

      get(*with_auth_token('/api/v1/campaigns', @admin))
      expect(json['data'].length).to eq(10)
    end
  end

  describe 'POST /api/v1/campaigns' do
    it 'returns a new campaign' do
      params = build(:campaign).as_json
      params.delete('_id')

      post(*with_auth_token('/api/v1/campaigns', @admin, params))

      expect(json['id']).not_to be_nil
      expect(json['name']).to eq(params['name'])
    end
  end

  describe 'DELETE /api/v1/campaigns/:id' do
    it 'deletes a campaign' do
      campaign = FactoryGirl.create(:campaign)

      delete(*with_auth_token("/api/v1/campaigns/#{campaign.id}", @admin))

      expect(response).to be_success
      expect(Campaign.exists?).to be_falsey
    end
  end
end
