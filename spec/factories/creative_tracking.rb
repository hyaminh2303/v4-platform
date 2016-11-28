FactoryGirl.define do
  factory :creative_tracking do |c|
    c.date { Date.current }
    c.views 200
    c.clicks 180
    c.landed 180
    c.locations do
      {
        hcm: {
          views: 100,
          clicks: 90,
          landed: 90,
          platforms: {
            pocketmath: {
              views: 60,
              clicks: 50,
              landed: 50
            },
            bidstalk: {
              views: 40,
              clicks: 40,
              landed: 40
            }
          }
        },
        hanoi: {
          views: 100,
          clicks: 90,
          landed: 90,
          platforms: {
            pocketmath: {
              views: 60,
              clicks: 50,
              landed: 50
            },
            bidstalk: {
              views: 40,
              clicks: 40,
              landed: 40
            }
          }
        }
      }
    end

    c.platforms do
      {
        pocketmath: {
          views: 120,
          clicks: 100,
          landed: 100
        },
        bidstalk: {
          views: 80,
          clicks: 80,
          landed: 80
        }
      }
    end
    c.device_os do
      {
        android: {
          views: 110,
          clicks: 100,
          landed: 100
        },
        ios: {
          views: 90,
          clicks: 80,
          landed: 80
        }
      }
    end
    c.countries do
      {
        vn: {
          views: 200,
          clicks: 180,
          landed: 180
        }
      }
    end
  end
end
