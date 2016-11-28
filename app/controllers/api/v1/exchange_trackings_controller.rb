module Api
  module V1
    class ExchangeTrackingsController < Api::V1::ApiController
      def index
        ad_group = AdGroup.find(params[:ad_group_id])
        @exchange_trackings = ExchangeTrackingService.new(ad_group).fetch_data
      end
    end
  end
end
