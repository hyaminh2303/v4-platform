module Api
  module V1
    class DeviceTrackingsController < Api::V1::ApiController
      def index
        @device_trackings = DeviceTrackingService.new(params[:ad_group_id]).fetch_data
      end
    end
  end
end
