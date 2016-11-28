class CampaignTracking
  include Mongoid::Document

  field :date, type: Date
  field :views, type: Integer, default: 0
  field :clicks, type: Integer, default: 0
  field :landed, type: Integer, default: 0
  field :locations, type: Hash
  field :platforms, type: Hash
  field :device_os, type: Hash
  field :countries, type: Hash
  field :devices, type: Array, default: []
  field :clicked_devices, type: Array, default: []

  belongs_to :campaign

  index(campaign_id: 1, date: 1)
end
