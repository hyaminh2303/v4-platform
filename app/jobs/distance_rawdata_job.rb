class DistanceRawdataJob < ActiveJob::Base
  def perform(campaign_ids)
    DistanceRawdataService.new.fetch(campaign_ids)
  end
end
