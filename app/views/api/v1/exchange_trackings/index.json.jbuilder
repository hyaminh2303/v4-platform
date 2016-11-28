json.data do
  json.array! @exchange_trackings do |exchange_tracking|
    json.name exchange_tracking['_id']
    json.views exchange_tracking['value']['views']
    json.clicks exchange_tracking['value']['clicks']
    json.landed exchange_tracking['value']['landed']
    json.ctr exchange_tracking['value']['ctr']
    json.drop_out exchange_tracking['value']['drop_out']

    json.platforms do
      json.array! exchange_tracking['value']['platforms'].each do |platform, value|
        json.name platform
        json.views value['views']
        json.clicks value['clicks']
        json.landed value['landed']
        json.ctr value['ctr']
        json.drop_out value['drop_out']
      end
    end
  end
end
json.total do
  total_views = @exchange_trackings.map {|d| d['value']['views']}.reduce(:+) || 0
  total_clicks = @exchange_trackings.map {|d| d['value']['clicks']}.reduce(:+) || 0
  total_landed = @exchange_trackings.map {|d| d['value']['landed']}.reduce(:+) || 0

  json.views total_views
  json.clicks total_clicks
  json.landed total_landed
  json.ctr  (total_clicks/total_views) rescue 0
  json.drop_out (1-total_landed/total_clicks) rescue 0
end