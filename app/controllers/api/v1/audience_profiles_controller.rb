module Api
  module V1
    class AudienceProfilesController < Api::V1::ApiController
      def index
        @events = Event.limit 1
      end

      def fetch_campaigns
        @campaigns = Campaign.all
        @campaigns = @campaigns.order(params[:sort_by] => params[:sort_dir]) if params[:sort_by] && params[:sort_dir]
      end

      def fetch_events
        creative_ids = Creative.where(campaign_id: { '$in': params[:campaign_ids] }).pluck(:id)

        all_campaign_event = Event.where(creativeid: { '$in': creative_ids })

        @events = all_campaign_event.order(id: :asc)
                                    .offset(params[:page].to_i*params[:per_page].to_i)
                                    .limit(params[:per_page])

        @total_page = (all_campaign_event.size/params[:per_page].to_f).ceil
      end
    end
  end
end