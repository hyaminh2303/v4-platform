module Api
  module V1
    class TimeFormatsController < Api::V1::ApiController
      def index
        @time_formats = TimeFormat.all
      end
    end
  end
end
