json.data do
  json.array! @groups.each do |group|
    json.id group.id
    json.name group.name
    json.campaign @campaign.name
    json.start_date group.start_date
    json.end_date group.end_date
    json.language_setting group.language_setting

    ad_group_tracking = @ad_group_trackings
                          .select { |a| a['_id'] == group.id }
                          .first || {'views' => 0, 'clicks' => 0, 'landed' => 0, 'ctr' => 0, 'drop_out' => 1}
    json.views ad_group_tracking['views']
    json.clicks ad_group_tracking['clicks']
    json.landed ad_group_tracking['landed']
    json.ctr ad_group_tracking['ctr']
    json.drop_out (1 - ad_group_tracking['drop_out'])
  end
end

json.total do
  total_views = @ad_group_trackings.map{|a| a['views']}.reduce(:+) || 0
  total_clicks = @ad_group_trackings.map{|a| a['clicks']}.reduce(:+) || 0
  total_landed = @ad_group_trackings.map{|a| a['landed']}.reduce(:+) || 0

  json.views total_views
  json.clicks total_clicks
  json.landed total_landed
  json.ctr (total_clicks / total_views.to_f) rescue 0
  json.drop_out (1 - total_landed/total_clicks.to_f) rescue 0
end