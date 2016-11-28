class Api::ApplicationController < ActionController::Base
  include Pundit
  include Authenticable

  helper_method :current_user
  # protect_from_forgery with: :null_session
  protect_from_forgery only: []

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  MAX_RECORDS = 100

  protected

  def render_ok
    render json: {}
  end

  def render_fail(message = '')
    render json: {message: message}, status: :unprocessable_entity
  end

  def offset
    page = [params[:page].to_i, 1].max
    (page - 1) * limit
  end

  def limit
    [params[:limit].present? ? params[:limit].to_i : MAX_RECORDS, MAX_RECORDS].min
  end

  def sort_by
    params[:sort_by]
  end

  def sort_dir
    params[:sort_dir]
  end

  def user_not_authorized
    render_fail
  end
end
