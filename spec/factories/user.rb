FactoryGirl.define do
  factory :user do |c|
    c.name { Faker::Name.name }
    c.email { Faker::Internet.email }
    c.password { 'password' }
    c.password_confirmation { 'password' }
    c.status { 'enabled' }
    c.reset_token { nil }
    c.reset_password_sent_at { nil }
    c.role_id { Role.find_or_create_by(attributes_for(:role, :admin)).id }
  end
end
