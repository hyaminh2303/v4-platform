class AdGroupTrackingService
  def initialize(campaign)
    @campaign = campaign
  end

  def fetch_data
    condition = {
      campaign_id: @campaign.id
    }
    pipeline = [
      {:$match => condition},
      {:$group => {_id: "$ad_group_id",
                   views: {:$sum => '$views'},
                   clicks: {:$sum => '$clicks'},
                   landed: {:$sum => '$landed'}
                  }
      },
      :$project => {views: 1, clicks: 1, landed: 1,
                    ctr: {
                      :$cond => [
                        {:$eq => ["$views", 0]},
                        0,
                        {:$divide => ["$clicks", "$views"]}
                      ]},
                    drop_out: {
                      :$cond => [
                        {
                          :$and => [
                            {:$eq => ["$clicks", 0]},
                            {:$eq => ["$landed", 0]}
                          ]
                        },
                        1,
                        {
                          :$cond => [
                            {:$eq => ["$clicks", 0]},
                            1,
                            {:$divide => ["$landed", "$clicks"]}
                          ]
                        }
                      ]
                    }
      }
    ]
    CreativeTracking.collection.aggregate(pipeline,
      {
        "allowDiskUse": true,
        "cursor": { "batchSize": 20 }
      })
  end
end
