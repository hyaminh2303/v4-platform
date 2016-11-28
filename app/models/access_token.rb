class AccessToken
  include Mongoid::Document

  field :value, type: String
  field :expired_at, type: Time
  belongs_to :user

  validates :value, uniqueness: true

  TOKEN_DURATION = 24.hours

  def self.generate_for(user, expired_date = nil)
    # prevent reset access token api for account request rawdata
    return if user.access_token && user.access_token.try(:expired_at) > Time.current + 10.days

    data = user.email + user.api_secret
    token = OpenSSL::HMAC.hexdigest(OpenSSL::Digest::SHA256.new, user.api_secret, data)
    expired_at = expired_date || Time.zone.now + TOKEN_DURATION

    user.access_token.destroy if user.access_token
    user.create_access_token(value: token, expired_at: expired_at)
  end

  def expired?
    expired_at < Time.zone.now
  end
end
