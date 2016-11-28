class Recovery
  attr_accessor :token, :user

  EmailNotFoundError = Class.new(StandardError)
  InvalidTokenError = Class.new(StandardError)

  delegate :errors, to: :user, allow_nil: true

  def self.create(email)
    new.create(email)
  end

  def initialize(token = nil)
    @token = token
    @user = User.find_by(reset_token: @token)
  end

  def valid?
    @token && @user && !@user.reset_token_expired?
  end

  def create(email)
    @user = User.find_by(email: email)
    raise EmailNotFoundError unless @user

    @token = Utils.generate_reset_token
    @user.update!(reset_token: @token, reset_password_sent_at: Time.zone.now)

    UserMailer.reset_password(@user.id.to_s).deliver_later
  end

  def update_password(password)
    raise InvalidTokenError unless valid?
    @user.update!(password: password, password_confirmation: password, reset_password_sent_at: nil, reset_token: nil)
  end
end
