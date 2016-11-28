class CoordinateJob < ActiveJob::Base
  def perform(adgroup_id)
    ad_group = AdGroup.find_by(id: adgroup_id)

    WeatherSyncJob.perform_later([ad_group.id.to_s])

    ad_group.locations.each do |location|
      coord = Coordinate.find_by(location_id: location.id)
      if coord.present?
        if ad_group.target_destination
          distance_duration_params = GoogleMapService.new(
            lat: location.latitude,
            lng: location.longitude,
            dest_lat: location.dest_lat,
            dest_lng: location.dest_lng,
            mode: location.transportation
          ).distance_duration
        end

        time_zone = TimeService.new(
          lat: location.latitude,
          lng: location.longitude
        ).time_zone

        coord.update(time_zone.merge(distance_duration_params || {}))
      else
        logger.info "nothing to do. location was deleted #{location.try(:id)}"
      end
    end
  end
end
