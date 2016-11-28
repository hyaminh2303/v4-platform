module Authenticable
  attr_accessor :current_user

  def authenticated?
    current_user
  end

  def authenticate_with_token
    token = params[:token] || request.headers["X-API-TOKEN"]
    @current_user = Authenticator.authenticate_with_token(token)

    if @current_user.blank?
      render text: "HTTP Token: Access denied.\n", status: :unauthorized
    end
  end
end
