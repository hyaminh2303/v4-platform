class ReportJob < ActiveJob::Base
  def perform(creative_ids, campaign_name, email, export_obj = nil, class_name = nil, start_date = nil, end_date = nil)
    ReportService.new(creative_ids, campaign_name, email, export_obj, class_name, start_date, end_date).fetch
  end
end
