module Api
  module V1
    class LocationTrackingsController < Api::V1::ApiController
      def index
        @locations = AdGroup.find(params[:ad_group_id]).locations
        @location_trackings = LocationTrackingService.new(params[:ad_group_id]).fetch_data
      end
    end
  end
end
