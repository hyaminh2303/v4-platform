json.data do
  json.array! @carrier_trackings do |carrier_tracking|
    json.name carrier_tracking['_id']
    json.views carrier_tracking['value']['views']
    json.clicks carrier_tracking['value']['clicks']
    json.landed carrier_tracking['value']['landed']
    json.ctr carrier_tracking['value']['ctr']
    json.drop_out carrier_tracking['value']['drop_out']
  end
end
json.total do
  total_views = @carrier_trackings.map {|d| d['value']['views']}.reduce(:+) || 0
  total_clicks = @carrier_trackings.map {|d| d['value']['clicks']}.reduce(:+) || 0
  total_landed = @carrier_trackings.map {|d| d['value']['landed']}.reduce(:+) || 0

  json.views total_views
  json.clicks total_clicks
  json.landed total_landed
  json.ctr (total_clicks/total_views) rescue 0
  json.drop_out (1-total_landed/total_clicks) rescue 0
end
