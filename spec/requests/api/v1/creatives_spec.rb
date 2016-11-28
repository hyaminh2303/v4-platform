require 'rails_helper'
require 'support/api_helpers'

describe 'Creative API' do
  include ApiHelpers

  before(:each) do
    @user = FactoryGirl.create(:user)
    @campaign = FactoryGirl.create(:campaign)
    @ad_group = create(:ad_group, name: Faker::Name.name, campaign_id: @campaign.id)
  end

  describe 'GET /api/v1/ad_group/:id/creatives' do
    it 'returns list of creatives' do
      10.times do |i|
        create(:creative, name: "name #{i}", landing_url: "http://google.com", creative_type: "static", ad_group_id: @ad_group.id)
      end

      get(*with_auth_token("/api/v1/ad_groups/#{@ad_group.id}/creatives", @user))
      expect(response).to be_success
      expect(json.length).to eq(10)
    end
  end

  describe 'POST /api/v1/ad_groups/:id/creatives' do
    context 'with valid params' do
      it 'return a new creative details when creative is created' do
        params = attributes_for(:creative)
        params[:ad_group_id] = @ad_group.id
        count = Creative.count
        post(*with_auth_token("/api/v1/ad_groups/#{@ad_group.id}/creatives", @user, params))

        expect(response).to be_success
        expect(json['id']).not_to be_nil
        expect(json['name']).to eq(params[:name])
        expect(Creative.count).to eq(count + 1)
        expect(json['platform']).to be_nil
        expect(json['tracking_type']).to be_nil
        expect(json['client_impression_url_1']).to eq('')
        expect(json['client_impression_url_2']).to eq('')
        expect(json['client_impression_url_3']).to eq('')
      end
    end

    context 'with invalid params' do
      it 'return a new creative details when creative is created' do
        params = attributes_for(:creative, name: '',
                                           landing_url: '',
                                           creative_type: '',
                                           platform: '',
                                           tracking_type: '',
                                           client_impression_url_1: '',
                                           client_impression_url_2: '',
                                           client_impression_url_3: '')
        params[:ad_group_id] = @ad_group.id

        post(*with_auth_token("/api/v1/ad_groups/#{@ad_group.id}/creatives", @user, params))

        expect(response.status).to eq(422)
        expect(json['message']).not_to be_nil
      end
    end
  end

  describe 'PUT /api/v1/creatives/:id' do
    before(:each) do
      @c = create(:creative, name: "name", landing_url: "http://google.com", creative_type: "static", ad_group_id: @ad_group.id)
    end
    it 'update with valid params' do
      @c.name = "New name"
      @c.platform = 'pocket_math'
      put(*with_auth_token("/api/v1/creatives/#{@c.id}", @user, @c.as_json))
      expect(json['platform']).to eq('pocket_math')
      expect(response.status).to eq(200)
    end

    it 'update with invalid params' do
      @c.name = ""
      put(*with_auth_token("/api/v1/creatives/#{@c.id}", @user, @c.as_json))
      expect(response.status).to eq(422)
      expect(json['message']).not_to be_nil
    end
  end
end
