module ControllerHelpers
  delegate :current_user, to: :controller

  def authenticate_request
    allow(controller).to receive(:authenticate_with_token)

    user = create(:user)
    controller.current_user = user
  end
end
