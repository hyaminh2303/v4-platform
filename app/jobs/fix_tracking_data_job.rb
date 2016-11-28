class FixTrackingDataJob < ActiveJob::Base
  def perform(date_has_data_str)
    date_has_data = DateTime.strptime(date_has_data_str, '%Y-%m-%d')

    TrackingDataHourService.recalculate_campaign_tracking_data(date_has_data)
    TrackingDataHourService.recalculate_creative_tracking_data(date_has_data)
  end
end
