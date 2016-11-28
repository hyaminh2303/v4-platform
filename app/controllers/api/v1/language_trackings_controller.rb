module Api
  module V1
    class LanguageTrackingsController < Api::V1::ApiController
      def index
        ad_group = AdGroup.find(params[:ad_group_id])
        @language_trackings = LanguageService.new(ad_group).fetch_data
      end
    end
  end
end