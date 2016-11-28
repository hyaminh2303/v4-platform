json.data do
  json.array! @app_trackings do |app_tracking|
    json.name app_tracking['_id']
    json.views app_tracking['value']['views']
    json.clicks app_tracking['value']['clicks']
    json.landed app_tracking['value']['landed']
    json.ctr app_tracking['value']['ctr']
    json.drop_out app_tracking['value']['drop_out']
  end
end
json.total do
  total_views = @app_trackings.map {|d| d['value']['views']}.reduce(:+) || 0
  total_clicks = @app_trackings.map {|d| d['value']['clicks']}.reduce(:+) || 0
  total_landed = @app_trackings.map {|d| d['value']['landed']}.reduce(:+) || 0

  json.views total_views
  json.clicks total_clicks
  json.landed total_landed
  json.ctr (total_clicks/total_views) rescue 0
  json.drop_out (1-total_landed/total_clicks) rescue 0
end
