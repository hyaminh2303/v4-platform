module Api
  module V1
    class ProfilesController < Api::V1::ApiController
      def update_password
        @user = Authenticator.authenticate(current_user.email, params[:current_password])
        if @user && @user.update(password: params[:new_password], password_confirmation: params[:new_password])
          render_ok
        else
          render_fail('Current password does not match')
        end
      end

      def show
        @roles = Role.all
      end

      def update
        if current_user.update(update_params)
          render_ok
        else
          render_fail " - " + current_user.errors.full_messages.join('<br/> - ')
        end
      end

      private

      def update_params
        params.require('profile').permit(:name)
      end
    end
  end
end
