require 'rails_helper'

describe Recovery do
  describe '#create' do
    context 'when user exists' do
      it 'create token and send mail to user' do
        user = create(:user)
        expect(user.reset_token).to be_nil

        Recovery.create(user.email)
        user.reload

        expect(user.reset_token).not_to be_nil
      end
    end

    context 'when user is not exists' do
      it 'raise an exception' do
        expect { Recovery.create('not_exist@yoose.com') }.to raise_error Recovery::EmailNotFoundError
      end
    end
  end

  describe '.valid?' do
    before(:each) do
      @user = create(:user)
      Recovery.create(@user.email)
      @user.reload
    end

    it 'return true if token is valid' do
      token = @user.reset_token

      recovery = Recovery.new(token)

      expect(recovery.valid?).to be_truthy
    end

    it 'return false if token is expired' do
      token = @user.reset_token
      @user.update(reset_password_sent_at: 10.days.ago)

      recovery = Recovery.new(token)

      expect(recovery.valid?).to be_falsey
    end
  end
end
