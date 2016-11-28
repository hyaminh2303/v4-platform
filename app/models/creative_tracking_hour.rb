class CreativeTrackingHour
  include Mongoid::Document

  field :date, type: Date
  field :hour, type: Integer
  field :views, type: Integer, default: 0
  field :clicks, type: Integer, default: 0
  field :landed, type: Integer, default: 0
  field :locations, type: Hash
  field :platforms, type: Hash
  field :device_os, type: Hash
  field :countries, type: Hash
  field :languages, type: Hash
  field :app_names, type: Hash
  field :exchanges, type: Hash
  field :carrier_names, type: Hash
  field :devices, type: Array, default: []
  field :clicked_devices, type: Array, default: []
  field :aggregate_fail, type: Boolean, default: nil

  belongs_to :creative
  belongs_to :ad_group
  belongs_to :campaign

  index(campaign_id: 1, ad_group_id: 1, creative_id: 1, date: 1, hour: 1)
end


# CampaignTracking.update("_id" => BSON::ObjectId.from_string("57109fa93e7a239c5f10c543"),  "$inc" => {"locations.57109e02f144c50074163472.views" => 1}, upsert: true, safe: true )


# CampaignTracking.update("_id" => BSON::ObjectId.from_string("57109fa93e7a239c5f10c543"),  "$inc" => {"locations" => {"57109e02f144c50074163472" => {"views" => 1} } }, upsert: true, safe: true )


# i,s = build_upsert_attributes({},{},a,'')