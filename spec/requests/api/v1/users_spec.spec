require 'rails_helper'
require 'support/api_helpers'
require 'uuid'

describe 'User API' do
  include ApiHelpers

  before(:each) do
    @max = ENV['MAX_RECORD'].to_i
    (1..@max - 2).each do |i|
      create(:user, name: "name #{i}", email: "user#{i}@yoose.com")
    end
    @super_admin = create(:user, role: create(:super_admin_role))
    @admin = create(:user)
  end

  describe 'GET /api/v1/users' do
    context 'login super admin' do
      context 'with page/per_page/query/sorting params' do
        it 'return list users' do
          get(*with_auth_token('/api/v1/users', @super_admin))
          expect(json['total']).to eq(1)
          expect(json['data'].count).to eq(@max)

          special_name = 'my special name user'
          special_email = 'my_special_email_user@gmail.com'
          special_name_user = create(:user, name: special_name)
          special_email_user = create(:user, email: special_email)

          get(*with_auth_token('/api/v1/users', @super_admin, query: special_name))
          expect(json['data'].count).to eq(1)
          expect(json['data'].first['id']).to eq(special_name_user.id.to_s)
          get(*with_auth_token('/api/v1/users', @super_admin, query: special_email))
          expect(json['data'].count).to eq(1)
          expect(json['data'].first['id']).to eq(special_email_user.id.to_s)

          per = 5
          users_order_asc_name_p1 = User.order(name: :asc).limit(per)
          users_order_desc_name_p1 = User.order(name: :desc).limit(per)
          users_order_asc_name_p2 = User.order(name: :asc).limit(per).skip(per)
          users_order_desc_name_p2 = User.order(name: :desc).limit(per).skip(per)

          get(*with_auth_token('/api/v1/users', @super_admin, sort_by: 'name', sort_dir: 'asc', per_page: per))
          expect(json['data'].map { |obj| obj['id'] }).to eq(users_order_asc_name_p1.map { |obj| obj.id.to_s })
          get(*with_auth_token('/api/v1/users', @super_admin, sort_by: 'name', sort_dir: 'desc', per_page: per))
          expect(json['data'].map { |obj| obj['id'] }).to eq(users_order_desc_name_p1.map { |obj| obj.id.to_s })

          get(*with_auth_token('/api/v1/users', @super_admin, sort_by: 'name', sort_dir: 'asc', page: 2, per_page: per))
          expect(json['data'].map { |obj| obj['id'] }).to eq(users_order_asc_name_p2.map { |obj| obj.id.to_s })
          get(*with_auth_token('/api/v1/users', @super_admin, sort_by: 'name', sort_dir: 'desc', page: 2, per_page: per))
          expect(json['data'].map { |obj| obj['id'] }).to eq(users_order_desc_name_p2.map { |obj| obj.id.to_s })
        end
      end
    end

    context 'login admin' do
      context 'with page/per_page/query/sorting params' do
        it 'return code 422' do
          get(*with_auth_token('/api/v1/users', @admin))
          expect(response.status).to eq(422)
        end
      end
    end
  end

  describe 'Delete /api/v1/users/:id' do
    context 'login super admin' do
      context 'delete user have no data' do
        it 'return success' do
          count = User.count
          temp_user = create(:user)
          count += 1
          expect(User.count).to eq(count)

          delete(*with_auth_token("/api/v1/users/#{temp_user.id}", @super_admin))
          expect(User.count).to eq(count - 1)
        end
      end
      context 'delete user have data campaigns' do
        it 'return code 422' do
          count = User.count
          temp_user = create(:user)
          temp_user.campaigns.create
          count += 1
          expect(User.count).to eq(count)

          delete(*with_auth_token("/api/v1/users/#{temp_user.id}", @super_admin))
          expect(User.count).to eq(count)
          expect(response.status).to eq(422)
        end
      end
    end
    context 'login admin' do
      context 'delete user have no data' do
        it 'return code 422' do
          count = User.count
          temp_user = create(:user)
          count += 1
          expect(User.count).to eq(count)

          delete(*with_auth_token("/api/v1/users/#{temp_user.id}", @admin))
          expect(response.status).to eq(422)
        end
      end
    end
  end
  describe 'PUT /api/v1/users/:id/toggle_status' do
    context 'login super admin' do
      context 'update valid status' do
        it 'return success' do
          temp_user = create(:user)

          put(*with_auth_token("/api/v1/users/#{temp_user.id}/toggle_status", @super_admin, status: 'disable'))
          expect(temp_user.reload.status).to eq('disable')
          put(*with_auth_token("/api/v1/users/#{temp_user.id}/toggle_status", @super_admin, status: 'enable'))
          expect(temp_user.reload.status).to eq('enable')
        end
      end
      context 'update invalid status' do
        it 'return code 422' do
          temp_user = create(:user)

          put(*with_auth_token("/api/v1/users/#{temp_user.id}/toggle_status", @super_admin, status: 'un valid params'))
          expect(temp_user.reload.status).to eq('enable')
          expect(response.status).to eq(422)
        end
      end
    end
    context 'login admin' do
      context 'update valid status' do
        it 'return code 422' do
          temp_user = create(:user)

          put(*with_auth_token("/api/v1/users/#{temp_user.id}/toggle_status", @admin, status: 'disable'))
          expect(response.status).to eq(422)
        end
      end
    end
  end

  describe 'GET /api/v1/users/:id' do
    context 'login super admin' do
      it 'returns a user details ' do
        user = FactoryGirl.create(:user)

        get(*with_auth_token("/api/v1/users/#{user.id}", @super_admin))
        expect(response).to be_success
        expect(json['name']).to eq(user.name)
      end
    end
    context 'login admin' do
      it 'return code 422' do
        user = FactoryGirl.create(:user)

        get(*with_auth_token("/api/v1/users/#{user.id}", @admin))
        expect(response.status).to eq(422)
      end
    end
  end

  describe 'POST /api/v1/users' do
    context 'login super admin' do
      it 'returns a new user' do
        params = attributes_for(:user)
        post(*with_auth_token('/api/v1/users', @super_admin, params))
        expect(json['id']).not_to be_nil
        expect(json['name']).to eq(params[:name])
      end
    end
    context 'login admin' do
      it 'returns a new user' do
        params = attributes_for(:user)
        params.delete('password_digest')
        params.delete('_id')
        params['password'] = 'password'
        params['api_secret'] = UUID.new.generate.delete('-')

        post(*with_auth_token('/api/v1/users', @admin, params))
        expect(response.status).to eq(422)
      end
    end
  end

  describe 'PUT /api/v1/users/:id' do
    context 'login super admin' do
      context 'update with valid params' do
        it 'return success' do
          user = FactoryGirl.create(:user)
          user.name = 'New name'

          put(*with_auth_token("/api/v1/users/#{user.id}", @super_admin, user.as_json))
          expect(response).to be_success
          get(*with_auth_token("/api/v1/users/#{user.id}", @super_admin))
          expect(json['name']).to eq(user.name)
        end
      end
      context 'update with invalid params' do
        it 'return unsuccessfully' do
          user = FactoryGirl.create(:user)
          user.email = ''

          put(*with_auth_token("/api/v1/users/#{user.id}", @super_admin, user.as_json))
          expect(response.status).to eq(422)
        end
      end
    end
    context 'login admin' do
      context 'update with valid params' do
        it 'return success' do
          user = FactoryGirl.create(:user)
          user.name = 'New name'
          put(*with_auth_token("/api/v1/users/#{user.id}", @admin, user.as_json))
          expect(response.status).to eq(422)
        end
      end
    end
  end
end
