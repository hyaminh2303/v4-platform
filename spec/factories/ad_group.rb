FactoryGirl.define do
  factory :ad_group do |c|
    c.name { Faker::Name.name }
    c.start_date { Time.current - 10.days }
    c.end_date { Time.current + 10.days }
    c.target { Faker::Number.between(10, 9999) }
    c.campaign do
      create(:campaign, start_date: Time.current - 20.days,
                        end_date: Time.current + 20.days)
    end
    after(:build) do |ad_group|
      ad_group.locations << build_list(:location, 1)
    end
  end
end
