module Trackable
  extend ActiveSupport::Concern

  included do
    has_many :creative_trackings

    def tracking_data?
      creative_trackings.present?
    end
  end
end
