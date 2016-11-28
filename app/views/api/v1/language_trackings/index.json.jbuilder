json.data do
  json.array! @language_trackings do |language_tracking|
    json.name language_tracking[:name]
    json.views language_tracking[:views]
    json.clicks language_tracking[:clicks]
    json.landed language_tracking[:landed]
    json.ctr language_tracking[:ctr]
    json.drop_out language_tracking[:drop_out]
  end
end
json.total do
  total_views = @language_trackings.map {|d| d[:views]}.reduce(:+) || 0
  total_clicks = @language_trackings.map {|d| d[:clicks]}.reduce(:+) || 0
  total_landed = @language_trackings.map {|d| d[:landed]}.reduce(:+) || 0

  json.views total_views
  json.clicks total_clicks
  json.landed total_landed
  json.ctr (total_clicks/total_views) rescue 0
  json.drop_out (1-total_landed/total_clicks) rescue 0
end
