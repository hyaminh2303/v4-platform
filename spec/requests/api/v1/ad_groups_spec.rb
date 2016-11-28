require 'rails_helper'
require 'support/api_helpers'
require 'uuid'

describe 'AdGroup API' do
  include ApiHelpers

  before(:each) do
    @max = ENV['MAX_RECORD'].to_i
    @campaign = create(:campaign)
    (1..@max).each do |_i|
      create(:ad_group, campaign: @campaign,
                        start_date: @campaign.start_date + 1.day,
                        end_date: @campaign.end_date - 1.day)
    end
    @admin = create(:user)
  end

  describe 'GET /api/v1/ad_groups' do
    context 'with valid campaign_id' do
      it 'return list ad groups' do
        get(*with_auth_token('/api/v1/ad_groups', @admin,
          campaign_id: @campaign.id))
        expect(json['data'].count).to eq(@campaign.ad_groups.count)
      end
    end
  end

  describe 'GET /api/v1/ad_group/:id' do
    context 'with valid id' do
      it 'return ad group' do
        ad_group = AdGroup.first
        get(*with_auth_token("/api/v1/ad_groups/#{ad_group.id}", @admin))
        expect(json['id']).to eq(ad_group.id.to_s)
      end
    end
  end

  describe 'GET /api/v1/campaigns/:campaign_id/ad_group/new' do
    context 'with valid campaign_id' do
      it 'return new ad group, campaign' do
        get(*with_auth_token("/api/v1/ad_groups/new", @admin,
          campaign_id: @campaign.id.to_s))
        expect(json['ad_group']['id']).to be_nil
        expect(json['campaign']['id']).to eq(@campaign.id.to_s)
      end
    end
  end

  describe 'GET /api/v1/ad_group/:id/edit' do
    context 'with valid id' do
      it 'return ad group, campaign' do
        ad_group = AdGroup.first
        get(*with_auth_token("/api/v1/ad_groups/#{ad_group.id}/edit", @admin))
        expect(json['ad_group']['id']).to eq(ad_group.id.to_s)
        expect(json['campaign']['id']).to eq(ad_group.campaign_id.to_s)
      end
    end
  end

  describe 'DELETE /api/v1/ad_group/:id' do
    context 'with valid id' do
      it 'return success' do
        count = AdGroup.count
        ad_group = AdGroup.first
        delete(*with_auth_token("/api/v1/ad_groups/#{ad_group.id}", @admin))
        expect(AdGroup.count).to eq(count - 1)
      end
    end
  end

  describe 'POST /api/v1/ad_group/' do
    context 'with valid params' do
      it 'return success' do
        count = AdGroup.count
        ad_group_attr = attributes_for(:ad_group, campaign_id: @campaign.id.to_s)
        post(*with_auth_token("/api/v1/ad_groups/", @admin,
          ad_group_attr.merge!(attachment: fixture_file_upload('spec/fixtures/location.csv', 'text/csv'))))
        expect(json['campaign_id']).to eq(@campaign.id.to_s)
        expect(AdGroup.count).to eq(count + 1)
      end
    end

    context 'with invalid params' do
      it 'return code 422 and errors message' do
        count = AdGroup.count
        ad_group_attr = attributes_for(:ad_group,
          start_date: @campaign.start_date - 1.day,
          end_date: @campaign.end_date + 1.day,
          target: '', name: '', campaign_id: @campaign.id.to_s)
        post(*with_auth_token("/api/v1/ad_groups/", @admin, ad_group_attr))
        expect(AdGroup.count).to eq(count)
        expect(response.status).to eq(422)
      end
    end
  end

  describe 'PUT /api/v1/ad_group/:id' do
    context 'with valid params' do
      it 'return success' do
        ad_group = AdGroup.first
        put(*with_auth_token("/api/v1/ad_groups/#{ad_group.id}",
          @admin,
          name: 'tada 123', start_date: @campaign.start_date + 2.days, end_date: @campaign.end_date - 2.days, target: 123))
        expect(ad_group.reload.name).to eq('tada 123')
        expect(ad_group.reload.start_date.to_date).to eq(@campaign.start_date.to_date + 2.days)
        expect(ad_group.reload.end_date.to_date).to eq(@campaign.end_date.to_date - 2.days)
        expect(ad_group.reload.target).to eq(123)
      end
    end

    context 'with invalid params' do
      it 'return code 422' do
        ad_group = AdGroup.first
        put(*with_auth_token("/api/v1/ad_groups/#{ad_group.id}",
          @admin,
          name: '', start_date: @campaign.start_date - 2.days, end_date: @campaign.end_date + 2.days, target: ''))
        expect(response.status).to eq(422)
      end
    end
  end
end
