class Authenticator
  def self.authenticate_with_token(token)
    access_token = AccessToken.find_by(value: token)

    return access_token.user if access_token && access_token.user.status == UserStatus::ACTIVE && !access_token.expired?
    nil
  end

  def self.authenticate(username, password)
    user = User.find_by(email: username)

    if user && user.authenticate(password)
      AccessToken.generate_for(user)
      return user
    end
    nil
  end
end
