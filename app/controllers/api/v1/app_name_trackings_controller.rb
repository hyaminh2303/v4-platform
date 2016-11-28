module Api
  module V1
    class AppNameTrackingsController < Api::V1::ApiController
      def index
        ad_group = AdGroup.find(params[:ad_group_id])
        @app_trackings = AppTrackingService.new(ad_group).fetch_data
      end
    end
  end
end