class Api::V1::ApiController < Api::ApplicationController
  before_action :authenticate_with_token

  def auth_status
    render_ok
  end
end
