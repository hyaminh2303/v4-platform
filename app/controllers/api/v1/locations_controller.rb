module Api
  module V1
    class LocationsController < Api::V1::ApiController
      def check_locations
        location_service = LocationService.new(params[:attachment], params[:is_target_location])
        if location_service.valid_data?
          @locations = location_service.parse_locations
        else
          @locations = []
          @message = 'The input file is of invalid format.'
        end
      end
    end
  end
end
