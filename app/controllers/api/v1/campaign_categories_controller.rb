module Api
  module V1
    class CampaignCategoriesController < Api::V1::ApiController
      def index
        @categories = CampaignCategory.all
      end
    end
  end
end
