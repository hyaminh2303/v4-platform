json.data do
  json.array! @locations do |location|
    location_tracking = @location_trackings.find{ |t| t["_id"] == location.id.to_s }

    if location_tracking.present?
      json.id location_tracking['_id']
      json.name location.name
      json.views location_tracking['value']['views']
      json.clicks location_tracking['value']['clicks']
      json.landed location_tracking['value']['landed']
      json.ctr location_tracking['value']['ctr']
      json.drop_out location_tracking['value']['drop_out']

      json.platforms do
        json.array! location_tracking['value']['platforms'].each do |platform, value|
          json.name platform
          json.views value['views']
          json.clicks value['clicks']
          json.landed value['landed']
          json.ctr value['ctr']
          json.drop_out value['drop_out']
        end
      end
    else
      json.id location.id.to_s
      json.name location.name
      json.views 0
      json.clicks 0
      json.landed 0
      json.ctr 0
      json.drop_out 0
      json.platforms []
    end
  end
end
json.total do
  total_views = @location_trackings.map {|d| d['value']['views']}.reduce(:+) || 0
  total_clicks = @location_trackings.map {|d| d['value']['clicks']}.reduce(:+) || 0
  total_landed = @location_trackings.map {|d| d['value']['landed']}.reduce(:+) || 0

  json.views total_views
  json.clicks total_clicks
  json.landed total_landed
  json.ctr  (total_clicks/total_views) rescue 0
  json.drop_out (1-total_landed/total_clicks) rescue 0
end