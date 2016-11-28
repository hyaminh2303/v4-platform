namespace :v4_platform do
  task create_trackings_data: :environment do
    CreativeTracking.delete_all
    Creative.delete_all
    AdGroup.delete_all
    CampaignTracking.delete_all
    Campaign.delete_all
    100.times do |i|
      p "Campaign: #{i}"
      campaign = Campaign.create! name: Faker::Name.name,
        start_date: Faker::Date.between(20.days.ago, Date.today),
        end_date: Faker::Date.between(Date.today, Date.today + 30),
        campaign_type: ['cpm', 'cpc'].sample,
        created_by: User.first,
        category: Category.all.sample

      40.times do
        locations = create_array_locations(10)
        ad_group = campaign.ad_groups.create! name: Faker::Name.name,
          start_date: campaign.start_date + 1,
          end_date: campaign.end_date - 1,
          target: Faker::Number.between(9000,10000),
          country: Country.all.sample,
          locations: locations

        begin_date = campaign.start_date
        while begin_date <= campaign.end_date do            
          create_trackings_data(CampaignTracking, campaign, ad_group, '', locations, begin_date)
          begin_date += 1.day
        end

        10.times do
          creative = ad_group.creatives.create! name: Faker::Name.name,
            landing_url: Faker::Internet.url,
            creative_type: 'static',
            platform: ['datalift', 'pocket_math'].sample,
            tracking_type: 'tracking_link',
            client_impression_url_1: Faker::Internet.url,
            client_impression_url_2: Faker::Internet.url,
            client_impression_url_3: Faker::Internet.url

          from_date = ad_group.start_date
          to_date = ad_group.end_date
          while from_date <= to_date do            
            create_trackings_data(CreativeTracking, campaign, ad_group, creative.id, locations, from_date)
            from_date += 1.day
          end
        end
      end
    end
  end
end

def get_devices
  num = rand(20..50)
  devices = Faker::Hipster.words(num)
  clicked_devices = devices.split(devices[num/2])
  [ devices, clicked_devices[0] ]
end

def views_click_landed(max_view)
  data = {}
  data[:views] = rand(100..max_view)
  data[:clicks] = data[:views] - rand(0..30)
  data[:landed] = data[:views] - rand(31..35)

  distance_click_view = data[:views] - data[:clicks]
  distance_landed_click = data[:clicks] - data[:landed]
  distance_rand = rand(10..20)

  # platforms
  data[:b_views] = (data[:views] / 2) + distance_rand
  data[:b_clicks] = (data[:clicks] / 2) + distance_rand + rand(0..distance_click_view/2)
  data[:b_landed] = (data[:landed] / 2) + distance_rand + rand(0..distance_landed_click/2)

  data[:p_views] = data[:views] - data[:b_views]
  data[:p_clicks] = data[:clicks] - data[:b_clicks]
  data[:p_landed] = data[:landed] - data[:b_landed]

  # devices os
  data[:i_views] = (data[:views] / 2) + distance_rand
  data[:i_clicks] = (data[:clicks] / 2) + distance_rand + rand(0..distance_click_view/2)
  data[:i_landed] = (data[:landed] / 2) + distance_rand + rand(0..distance_landed_click/2)

  data[:a_views] = data[:views] - data[:i_views]
  data[:a_click] = data[:clicks] - data[:i_clicks]
  data[:a_landed] = data[:landed] - data[:i_landed]

  # country
  data[:vn_views] = (data[:views] / 2) + distance_rand
  data[:vn_clicks] = (data[:clicks] / 2) + distance_rand + rand(0..distance_click_view/2)
  data[:vn_landed] = (data[:landed] / 2) + distance_rand + rand(0..distance_landed_click/2)

  data[:us_views] = data[:views] - data[:vn_views]
  data[:us_click] = data[:clicks] - data[:vn_clicks]
  data[:us_landed] = data[:landed] - data[:vn_landed]

  data
end

def create_array_locations(n)
  locations = []
  n.times do
    location = Location.new name: Faker::Address.street_address,
      latitude: Faker::Address.latitude,
      longitude: Faker::Address.longitude,
      radius: 1000,
      message: Faker::Hipster.sentence(1)
    locations << location
  end
  locations
end

def create_trackings_data(model, campaign, ad_group, creative, locations, from_date)
  data = views_click_landed(900)
  devices, clicked_devices = get_devices
  hash_data = {
    campaign_id: campaign.id,
    ad_group_id: ad_group.id,
    creative_id: creative,
    date: from_date,
    views: data[:views],
    clicks: data[:clicks],
    landed: data[:landed],
    devices: devices,
    clicked_devices: clicked_devices,
    device_os: {
      ios: { views: data[:i_views], clicks: data[:i_clicks], landed: data[:i_landed] },
      android: { views: data[:a_views], clicks: data[:a_clicks], landed: data[:a_landed] }
    },
    platforms: {
      pocketmath:{ views: data[:p_views], clicks: data[:p_clicks], landed: data[:p_landed] },
      bidstalk:{ views: data[:b_views], clicks: data[:b_clicks], landed: data[:b_landed] }
    },
    countries: {
      vn: { views: data[:vn_views], clicks: data[:vn_clicks], landed: data[:vn_landed] },
      us: { views: data[:us_views], clicks: data[:us_click], landed: data[:us_landed] }
    },
    locations: {}.tap { |hash|
      locations.each do |location|
        hash[location.id.to_s] = {
          views: rand(0..data[:views]/2),
          clicks: rand(0..data[:clicks]/2),
          landed: rand(0..data[:landed]/2),
          platforms: {
            pocketmath: {
                views: rand(0..100),
                clicks: rand(0..100),
                landed: rand(0..100)
            },
            bidstalk:{
                views: rand(0..100),
                clicks: rand(0..100),
                landed: rand(0..100)
            }
          }
        }
      end
    }
  }
  if model == CampaignTracking
    hash_data.delete(:ad_group_id)
    hash_data.delete(:creative_id)
  end
  model.create(hash_data)
end