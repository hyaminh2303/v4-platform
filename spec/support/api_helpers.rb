module ApiHelpers
  def with_auth_token(url, user, params = {}, headers = {})
    access_token = AccessToken.generate_for(user)

    [url,
     params,
     headers.merge(HTTP_AUTHORIZATION: ActionController::HttpAuthentication::Token.encode_credentials(access_token.value))]
  end
end
