module Api
  module V1
    class UsersController < Api::V1::ApiController
      before_action :load_user, except: [:create, :index, :new]
      before_action -> { authorize(current_user) }

      def index
        load_users
      end

      def new
        @roles = Role.all
      end

      def edit
        @roles = Role.all
      end

      def show
      end

      def destroy
        if @user.present? && @user.can_delete?
          @user.destroy
          render_ok
        else
          render_fail
        end
      end

      def create
        @user = User.new(new_user_params)
        if @user.save
          render :show
        else
          render_fail " - " + @user.errors.full_messages.join('<br/> - ')
        end
      end

      def update
        if @user.update(edit_user_params)
          render_ok
        else
          render_fail " - " + @user.errors.full_messages.join('<br/> - ')
        end
      end

      def reset_user_password
        if @user.reset_user_password
          render json: {password: @user.password}
        else
          render_fail @user.errors.full_messages
        end
      end

      private

      def load_user
        @user = User.find(params[:id])
      end

      def load_users
        @users = User.search(params)
        @users = @users.order(sort_by => sort_dir) if sort_by.present?
        @users = @users.page(params[:page], params[:per_page])

        @total = @users.total
        @per_page = @users.per_page
        @page = (params[:page] || 1).to_i
      end

      def new_user_params
        params.permit(:name, :email, :password, :role_id, :status)
      end

      def edit_user_params
        params.permit(:name, :email, :role_id, :status)
      end
    end
  end
end
