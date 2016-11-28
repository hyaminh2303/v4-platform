class WeatherSyncJob < ActiveJob::Base
  def perform(ad_group_ids = [])
    ad_groups = get_ad_groups(ad_group_ids)

    ad_groups.each do |ad_group|
      if ad_group.present? &&
        (ad_group.condition_type == 'weather' ||
         ad_group.having_temperature_element?)
        Coordinate.where(ad_group_id: ad_group.id).each do |coord|
          if coord.present?
            temperature = WeatherService.new(
              lat: coord.lat,
              lng: coord.lng,
              lang: ad_group.language_setting
            ).temperature

            coord.update(temperature)
            logger.info "update temperature ad #{coord.ad_group_id}: coord #{coord.id}"
          else
            logger.info "coord not found"
          end
        end
      else
        logger.info "nothing to do. ad_group have no element temperature"
      end
    end
  end

  def get_ad_groups(ad_group_ids)
    if ad_group_ids.blank?
      AdGroup.available
    else
      AdGroup.available.where(:id.in => ad_group_ids)
    end
  end
end
