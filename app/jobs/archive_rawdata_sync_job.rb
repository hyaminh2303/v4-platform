class ArchiveRawdataSyncJob < ActiveJob::Base
  def perform(campaign_ids = [])
    ArchiveRawdataService.new(campaign_ids).fetch
  end
end
