require 'net/http'
require 'json'

class Location
  include Mongoid::Document

  TRANSPORTATION = %w(driving walking cycling public\ transit).freeze

  field :name, type: String
  field :latitude, type: Float
  field :longitude, type: Float
  field :dest_lat, type: Float
  field :dest_lng, type: Float
  field :transportation, type: String, default: ''
  field :radius, type: Float
  field :message, type: String, default: ''

  embedded_in :ad_group

  validates :name, :latitude, :longitude, :radius, presence: :true
  validates :latitude,
            numericality: {greater_than_or_equal_to: -90, less_than_or_equal_to: 90}
  validates :longitude,
            numericality: {greater_than_or_equal_to: -180, less_than_or_equal_to: 180}

  validates :dest_lat,
            numericality: {greater_than_or_equal_to: -90, less_than_or_equal_to: 90},
            allow_nil: true
  validates :dest_lng,
            numericality: {greater_than_or_equal_to: -180, less_than_or_equal_to: 180},
            allow_nil: true

  delegate :campaign, to: :ad_group

  before_save :set_default_transportation
  after_save :set_coordinate

  def tracking_data?
    CreativeTracking.collection.find("locations.#{id}" => {'$exists' => true, '$ne' => nil}).any?
  end

  def valid
    valid? && check_transportation
  end

  def errors_messages
    errors.full_messages.join(', ')
  end

  private

  def check_transportation
    if check_target_destination_latlng
      return true if transportation.blank?
      TRANSPORTATION.include?(transportation)
    else
      true
    end
  end

  def check_target_destination_latlng
    dest_lat.present? && dest_lng.present?
  end

  def set_default_transportation
    self.transportation = 'driving' if check_target_destination_latlng && transportation.blank?
  end

  def set_coordinate
    params = {
      campaign_id: campaign.id,
      ad_group_id: ad_group.id,
      radius: radius,
      coord: {type: 'Point', coordinates: [longitude, latitude]},
      location_id: id,
      location_name: name,
      message: message || '',
      transportation_type: transportation || ''
    }
    coordinate = Coordinate.find_by(location_id: id)
    coordinate ? coordinate.update(params) : Coordinate.create(params)
  end
end
