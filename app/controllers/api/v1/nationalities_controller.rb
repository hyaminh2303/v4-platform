module Api
  module V1
    class NationalitiesController < Api::V1::ApiController
      before_action :set_nationality, except: [:new, :create, :index]
      def index
        @nationalities = Nationality.search(params)
        @per_page = params[:per_page]
        @page = (params[:page] || 1).to_i
      end

      def edit
        set_nationality
      end

      def update
        if @nationality.update(nationality_params)
          @nationality.reload
          render :show
        else
          render_fail @nationality.errors.full_messages
        end
      end

      def create
        @nationality = Nationality.new(nationality_fields: params[:nationality])
        if @nationality.save
          render_ok
        else
          render_fail @nationality.errors.full_messages
        end
      end

      def destroy
        @nationality.destroy
        render_ok
      end

      private

      def set_nationality
        @nationality = Nationality.find(params[:id])
      end

      def nationality_params
        params.permit(:name, :locales)
      end
    end
  end
end
