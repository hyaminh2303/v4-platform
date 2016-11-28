module Api
  module V1
    class OsTrackingsController < Api::V1::ApiController
      def index
        @data_tracking, @summary = OsTrackingService.new(params[:ad_group_id]).fetch_data
        @operating_systems = OperatingSystem.all
      end
    end
  end
end
