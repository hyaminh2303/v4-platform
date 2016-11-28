class DistanceRawdataService
  def fetch(campaign_ids)
    adgroups = AdGroup.where(:campaign_id.in => campaign_ids)

    i = 1
    adgroups.each do |adgroup|
      Event.or({distance: nil}, {nearestlocationname: nil}).where(:creativeid.in => adgroup.creatives.pluck(:id), type: 'adrequest').each do |event|
        pipeline = []
        pipeline << {
          "$geoNear" => {
            near: {type: "Point", coordinates: [event.longitude, event.latitude]},
            distanceField: "distance",
            limit: 1,
            spherical: true,
            query: {ad_group_id: BSON::ObjectId(adgroup.id.to_s)}
          }
        }
        nearest = aggregate(pipeline).to_a[0]
        event.update(nearestlocationname: nearest["location_name"], distance: nearest.try(:[], "distance"))
        puts "update #{i} #{nearest['distance']}"
        i += 1
      end
    end

    'done'
  end

  private

  def aggregate(pipeline)
    Coordinate.collection.aggregate(pipeline,
      {
        "allowDiskUse": true,
        "cursor": { "batchSize": 20 }
      })
  end
end
