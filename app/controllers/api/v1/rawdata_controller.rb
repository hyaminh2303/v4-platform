class Api::V1::RawdataController < Api::V1::ApiController
  include ApplicationHelper
  RAWDATA_TYPES = %w(adrequest click landed)

  def campaigns
    @date = get_date(params[:date])
    @campaigns = Campaign.available(@date)
    render json: @campaigns, each_serializer: Api::V1::CampaignSerializer, date: @date
  end

  def events
    per_page = 1000
    date = get_date(params[:date])
    @campaign = Campaign.find(params[:campaign_id])
    if @campaign.blank? || !@campaign.is_available?(date)
      render_fail('Invalid Campaign')
      return
    end

    params[:page] = params[:page].present? ? params[:page].to_i : 1
    @rawdata = Event.where(:creativeid.in => @campaign.creative_ids,
      :type.in => RAWDATA_TYPES,
      isvalid: true,
      :timestamp.gte => date.beginning_of_day,
      :timestamp.lte =>  date.end_of_day)
      .offset((params[:page]-1) * per_page.to_i)
      .limit(per_page)

    render json: {
      campaign_id: @campaign.id,
      campaign_name: @campaign.name,
      page: params[:page],
      data: ActiveModelSerializers::SerializableResource.new(@rawdata, each_serializer: Api::V1::EventSerializer).as_json
    }

  rescue
    render_fail('Something went wrong')
  end

  def get_date(date)
    date = params[:date].present? ? Date.strptime(params[:date], '%Y-%m-%d') :
                                    Date.current - 1.day
  end
end


