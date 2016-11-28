FactoryGirl.define do
  factory :campaign do |c|
    c.name { Faker::Name.name }
    c.start_date { Time.current - 20.days }
    c.end_date { Time.current + 20.days }
  end
end
