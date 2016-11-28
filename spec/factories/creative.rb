FactoryGirl.define do
  factory :creative do |c|
    c.name { Faker::Name.name }
    c.landing_url { Faker::Internet.url }
    c.creative_type { 'static' }
    c.platform 'datalift'
    c.tracking_type 'tracking_link'
    c.client_impression_url_1 { Faker::Internet.url }
    c.client_impression_url_2 { Faker::Internet.url }
    c.client_impression_url_3 { Faker::Internet.url }

    c.association :ad_group
  end
end
