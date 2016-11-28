require 'rails_helper'

describe AccessToken do
  describe '#generate' do
    it "returns a user's token" do
      user = create(:user)
      token = AccessToken.generate_for(user)

      expect(token.value).to eq(user.access_token.value)
    end
  end
end
