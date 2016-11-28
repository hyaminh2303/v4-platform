class CoordinateEventJob < ActiveJob::Base
  def perform(campaign_ids)
    CoordianteEventService.new.fetch(campaign_ids)
  end
end
