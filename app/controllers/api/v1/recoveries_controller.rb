module Api
  module V1
    class RecoveriesController < Api::V1::ApiController
      skip_before_action :authenticate_with_token

      def create
        Recovery.create(params[:email])
        render_ok
      rescue Recovery::EmailNotFoundError
        render_fail('Email does not exist')
      end

      def show
        token = params[:id]
        if Recovery.new(token).valid?
          render_ok
        else
          render_fail('Invalid token')
        end
      end

      def update
        recovery = Recovery.new(params[:id])
        recovery.update_password(params[:password])

        render_ok
      rescue Recovery::InvalidTokenError
        render_fail('Invalid token')
      rescue Mongoid::Errors::Validations
        render_fail(message: recovery.errors.full_messages)
      end
    end
  end
end
