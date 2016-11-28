class CoordianteEventService
  def fetch(campaign_ids)
    adgroups = AdGroup.where(:campaign_id.in => campaign_ids)

    i = 1
    adgroups.each do |adgroup|
      Event.where(coord: nil, :creativeid.in => adgroup.creatives.pluck(:id), type: 'adrequest').each do |event|
        coord = {type: "Point", coordinates: [event.longitude, event.latitude]}
        event.update(coord: coord)
        puts "update #{i} #{coord}"
        i += 1
      end
    end

    'done'
  end
end
