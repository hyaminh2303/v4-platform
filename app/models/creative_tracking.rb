class CreativeTracking
  include Mongoid::Document

  field :date, type: Date
  field :views, type: Integer, default: 0
  field :clicks, type: Integer, default: 0
  field :landed, type: Integer, default: 0
  field :locations, type: Hash
  field :platforms, type: Hash
  field :device_os, type: Hash
  field :countries, type: Hash
  field :languages, type: Hash
  field :app_names, type: Hash
  field :devices, type: Array, default: []
  field :clicked_devices, type: Array, default: []

  belongs_to :creative
  belongs_to :ad_group
  belongs_to :campaign

  index({campaign_id: 1, ad_group_id: 1, creative_id: 1, date: 1}, {unique: true})
end
