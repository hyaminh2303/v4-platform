class Coordinate
  include Mongoid::Document
  field :coord, type: Hash
  field :radius, type: Float
  field :location_id, type: BSON::ObjectId
  field :ad_group_id, type: BSON::ObjectId
  field :campaign_id, type: BSON::ObjectId
  field :transportation_type, type: String
  field :transportation_distance, type: String, default: ''
  field :transportation_duration, type: String, default: ''
  field :location_name, type: String, default: ''
  field :message, type: String, default: ''
  field :temperature, type: Float, default: nil
  field :time_zone, type: String, default: nil
  field :weather_condition, type: String, default: ''
  field :weather_code, type: String, default: ''

  index(coord: '2dsphere', ad_group_id: 1, campaign_id: 1, radius: 1)
  index(ad_group_id: 1, location_id: 1)


  def lat
    coord['coordinates'][1]
  end

  def lng
    coord['coordinates'][0]
  end
end
