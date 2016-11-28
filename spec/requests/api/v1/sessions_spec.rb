require 'rails_helper'

describe 'Authentication API' do
  let(:username) { 'ok@test.com' }
  let(:password) { 'password' }

  before(:each) do
    create(:user, email: username, password: password, password_confirmation: password)
  end

  describe 'POST /login' do
    context 'when successful' do
      it 'returns a user with auth token' do
        post '/api/v1/login', username: username, password: password
        expect(json['auth_token']).not_to be_nil
      end
    end

    context 'when failure' do
      it 'returns forbidden error' do
        post '/api/v1/login', username: username, password: :failed
        expect(response).to be_forbidden
      end
    end
  end
end
