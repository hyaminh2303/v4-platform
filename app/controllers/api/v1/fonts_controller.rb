module Api
  module V1
    class FontsController < Api::V1::ApiController
      def index
        @fonts = Font.all
      end
    end
  end
end
