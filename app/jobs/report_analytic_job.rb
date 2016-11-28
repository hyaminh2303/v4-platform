class ReportAnalyticJob < ActiveJob::Base
  def perform(campaign_id, email)
    AnalyticService.new(campaign_id, email).export
  end
end

