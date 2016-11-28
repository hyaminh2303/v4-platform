class Api::V1::DashboardController < Api::V1::ApiController
  def index
    # 1/ chart line: where by campaign_id, start_date, end_date THEN group by campaign_id, date
    # 2/ total BY client
    @summary = DashboardSummary.new(params).fetch
    @campaign_options = Campaign.where(:id.in => @summary[:campaign_ids]).pluck(:id, :name)
    @operating_systems = OperatingSystem.all
    @platforms = Platform.all
    @countries = Country.all
  end
end
