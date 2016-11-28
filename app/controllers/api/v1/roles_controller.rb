module Api
  module V1
    class RolesController < Api::V1::ApiController
      # GET /roles
      def index
        @roles = Role.all
      end
    end
  end
end
