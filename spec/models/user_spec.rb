require 'rails_helper'

describe User do
  describe '#current_token' do
    it "returns user's token" do
      user = FactoryGirl.create(:user)
      AccessToken.generate_for(user)
      expect(user.access_token).to_not be_nil
    end

    context 'when token is expired' do
      it 'does not return a token' do
        user = FactoryGirl.create(:user)
        AccessToken.generate_for(user, Time.zone.now - 1.hour)
        expect(user.access_token.expired?).to be true
      end
    end
  end

  describe 'module paginate' do
    before(:each) do
      @max = ENV['MAX_RECORD'].to_i
      (1..@max).each do |i|
        create(:user, name: "name #{i}", email: "user#{i}@yoose.com")
      end
    end
    context 'no params input' do
      it 'return list users' do
        users = User.page
        expect(users.to_a.size).to eq(ENV['MAX_RECORD'].to_i)
      end
    end
    context 'with params page/per_page' do
      it 'return list users' do
        total = ENV['MAX_RECORD'].to_f
        max = ENV['MAX_RECORD'].to_i
        users = User.page(1)
        expect(users.to_a.size).to eq(total)
        users = User.page(2)
        expect(users.to_a.size).to eq(0)

        u = create(:user)
        users = User.page(2)
        expect(users.to_a.size).to eq(1)
        expect(users).to eq([u])
        u.destroy

        users = User.page(1, 5)
        expect(users.to_a.size).to eq([5, max].min)

        users = User.page(2, 5)
        expect(users.to_a.size).to eq([5, max].min)
      end
    end
  end

  describe 'module sortable' do
    before(:each) do
      @max = ENV['MAX_RECORD'].to_i
      (1..@max).each do |i|
        create(:user, name: "name #{i}", email: "user#{i}@yoose.com")
      end
    end
  end
end
