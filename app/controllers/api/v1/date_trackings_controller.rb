module Api
  module V1
    class DateTrackingsController < Api::V1::ApiController
      def index
        @data_tracking, @summary = DateTrackingService.new(params[:ad_group_id]).fetch_data
      end
    end
  end
end
