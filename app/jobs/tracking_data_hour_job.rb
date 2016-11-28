class TrackingDataHourJob < ActiveJob::Base
  def perform(current_time = nil)
    TrackingDataHourService.new(current_time).aggregate
  end
end
