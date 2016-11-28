module Api
  module V1
    class SessionsController < Api::V1::ApiController
      skip_before_action :authenticate_with_token

      def create
        @user = if params[:token]
                  Authenticator.authenticate_with_token(params[:token])
                else
                  Authenticator.authenticate(params[:username], params[:password])
                end
        if @user
          render :show
        else
          render json: {}, status: :forbidden
        end
      end
    end
  end
end
