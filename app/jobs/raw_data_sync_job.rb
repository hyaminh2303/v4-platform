class RawDataSyncJob < ActiveJob::Base
  def perform
    RawDataDailyService.new.log
  end
end
