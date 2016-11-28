module Api
  module V1
    class CarrierNameTrackingsController < Api::V1::ApiController
      def index
        ad_group = AdGroup.find(params[:ad_group_id])
        @carrier_trackings = CarrierTrackingService.new(ad_group).fetch_data
      end
    end
  end
end