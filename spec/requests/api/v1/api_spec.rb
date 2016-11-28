require 'rails_helper'

describe 'API Authentication' do
  context 'when auth_token is valid' do
    it 'returns successful with code 200' do
      user = create(:user)
      access_token = AccessToken.generate_for(user)

      get '/api/v1/auth_status',
          nil,
          HTTP_AUTHORIZATION: ActionController::HttpAuthentication::Token.encode_credentials(access_token.value)

      expect(response.status).to eq(200)
    end
  end

  context 'when auth_token is invalid' do
    it 'returns error with code 401' do
      get '/api/v1/auth_status'
      expect(response.status).to eq(401)
    end
  end
end
