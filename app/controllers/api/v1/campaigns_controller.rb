class Api::V1::CampaignsController < Api::V1::ApiController
  before_action :load_campaign, only: [:show, :destroy, :edit, :update, :generate_location_report]

  def generate_location_report
    service = LocationBreakdownService.new(@campaign, params)
    send_data service.fetch, filename: service.file_name
  end

  def index
    @campaigns = CampaignService.search(params)

    @per_page = params[:per_page]
    @page = (params[:page] || 1).to_i
  end

  def create
    @campaign = current_user.campaigns.build(campaign_params)
    if @campaign.save
      render :show
    else
      render_fail
    end
  end

  def show
  end

  def destroy
    if @campaign.tracking_data?
      render_fail
    else
      @campaign.destroy
      render_ok
    end
  end

  def new
    @categories = Category.where(parent_id: nil)
  end

  def edit
    @categories = Category.where(parent_id: nil)
  end

  def update
    if @campaign.update(campaign_params)
      render :show
    else
      render_fail
    end
  end

  def options
    @campaigns = Campaign.pluck(:id, :name)
  end

  private

  def load_campaign
    @campaign = Campaign.find(params[:id])
  end

  def campaign_params
    params.permit(:name, :campaign_type, :start_date, :end_date, :category_id, :analytic_profile_id)
  end
end
