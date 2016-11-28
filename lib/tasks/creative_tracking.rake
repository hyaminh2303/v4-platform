namespace :v4_platform do
  task convert_total_creatives: :environment do
    Creative.where(views: nil).update_all(views: 0, clicks: 0, landed: 0)
    creative_trackings_pipeline = [
      {'$group' => {
        _id: '$creative_id',
        views: {'$sum' => '$views'},
        clicks: {'$sum' => '$clicks'},
        landed: {'$sum' => '$landed'}
      }}
    ]
    CreativeTracking.collection.aggregate(creative_trackings_pipeline,
                                  {
                                    "allowDiskUse": true,
                                    "cursor": { "batchSize": 20 }
                                  }).each do |creative_tracking|

      Creative.find(creative_tracking['_id']).update(
        views: creative_tracking['views'],
        clicks: creative_tracking['clicks'],
        landed: creative_tracking['landed']
      )
    end
  end
end
