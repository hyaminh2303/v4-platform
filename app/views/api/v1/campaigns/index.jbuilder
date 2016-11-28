json.data do
  json.array! @campaigns[:data] do |campaign|
    json.id campaign['_id']
    json.name campaign['name']
    status = status(campaign['start_date'], campaign['end_date'])
    json.status_css status_css(status)
    json.start_date campaign['start_date']
    json.end_date campaign['end_date']
    json.campaign_type campaign['campaign_type']
    json.views campaign['views']
    json.clicks campaign['clicks']
    json.landed campaign['landed']
    json.ctr campaign['ctr']
    json.drop_out (1 - (campaign['drop_out'] || 1))
  end
end

json.total @campaigns[:stats].try(:[], :count)
json.per_page @per_page
json.page @page

json.summary do
  total_views = @campaigns[:stats].try(:[], :views)
  total_clicks = @campaigns[:stats].try(:[], :clicks)
  total_landed = @campaigns[:stats].try(:[], :landed)

  json.views total_views
  json.clicks total_clicks
  json.landed total_landed
  json.ctr (total_clicks / total_views.to_f) rescue 0
  json.drop_out (1 - (total_landed.to_f / total_clicks)) rescue 0
end
