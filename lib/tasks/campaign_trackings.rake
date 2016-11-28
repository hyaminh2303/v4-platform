namespace :v4_platform do
  task campaign_trackings: :environment do
    CampaignTracking.destroy_all

    Campaign.all.each do |campaign|
      to_date = Date.current
      from_date = to_date - 30.days
      while from_date <= to_date do
        data = views_click_landed(900)
        devices, clicked_devices = get_devices
        CampaignTracking.create(
          campaign_id: campaign.id,
          date: from_date,
          views: 123,
          clicks: 100,
          landed: 90
        )
        from_date += 1.day
      end
    end
  end

  task convert_total_camapaigns: :environment do
    Campaign.where(views: nil).update_all(views: 0, clicks: 0, landed: 0)
    campaign_trackings_pipeline = [
      {'$group' => {
        _id: '$campaign_id',
        views: {'$sum' => '$views'},
        clicks: {'$sum' => '$clicks'},
        landed: {'$sum' => '$landed'}
      }}
    ]
    CampaignTracking.collection.aggregate(campaign_trackings_pipeline,
                                  {
                                    "allowDiskUse": true,
                                    "cursor": { "batchSize": 20 }
                                  }).each do |campaign_tracking|
      Campaign.find(campaign_tracking['_id']).update(
        views: campaign_tracking['views'],
        clicks: campaign_tracking['clicks'],
        landed: campaign_tracking['landed']
      )
    end
  end
end
