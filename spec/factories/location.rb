FactoryGirl.define do
  factory :location do |c|
    c.name { Faker::Name.name }
    c.latitude { Faker::Address.latitude }
    c.longitude { Faker::Address.longitude }
    c.radius Faker::Number.between(1, 100)
    c.message { 'message' }
  end
end
