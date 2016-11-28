require 'csv'
class LocationService
  def initialize(file, is_target_location, ad_group = nil, location_params = nil)
    @file = file
    @ad_group = ad_group
    @is_target_location = to_bool(is_target_location)
    @location_params = location_params
    @file_encoding = get_file_encode(@file.path) unless @file.nil?
  end

  def locations_from_params
    destroy_location_without_tracking_data
    @location_params.each do |param|
      param = param.permit(:name, :latitude, :longitude, :radius, :dest_lat, :dest_lng, :transportation, :message)
      location = find_location(param[:latitude], param[:longitude])
      if location.present?
        location.assign_attributes(param.as_json)
      else
        @ad_group.locations << Location.new(param)
      end
    end
  end

  def import_from_csv
    return unless valid_data?
    destroy_location_without_tracking_data

    parse_locations.select(&:valid).each do |valid_location|
      location = find_location(valid_location.latitude, valid_location.longitude)
      if location.present?
        location.assign_attributes(valid_location.as_json)
      else
        @ad_group.locations << valid_location
      end
    end
  end

  def parse_locations
    locations = []
    CSV.foreach(@file.path, headers: true, encoding: @file_encoding) do |row|
      location_params = {}
      row.to_hash.each { |k, v| location_params.merge!(k.downcase => v) }
      location = Location.new(location_params)
      locations << location
    end
    locations
  end

  def valid_data?
    return false unless valid_file?
    csv_counted_columns = CSV.read(@file.path, encoding: @file_encoding).first.count
    @is_target_location ? csv_counted_columns >= 7 : csv_counted_columns <= 5
  end

  private

  def valid_file?
    @file.respond_to?(:read) && @file.original_filename.include?('.csv') && file_exist?
  end

  def file_exist?
    !@file.is_a?(String)
  end

  def find_location(lat, lng)
    @ad_group.locations.find_by(latitude: lat, longitude: lng)
  end

  def destroy_location_without_tracking_data
    location_ids = @ad_group.locations.map { |l| l.id if l.tracking_data? }

    @ad_group.locations.not_in(id: location_ids).destroy_all
    Coordinate.where(ad_group_id: @ad_group.id).not_in(location_id: location_ids).destroy_all
  end

  def to_bool(s)
    return true if s == true || s == 'true'
    false
  end

  def get_file_encode(path)
    CharlockHolmes::EncodingDetector.detect(File.read(path))[:encoding]
  end
end
