json.campaign @campaign, :id, :name, :start_date, :end_date
json.ad_group do
  json.name @group.name
  json.campaign_id @group.campaign_id
  json.start_date @group.start_date
  json.end_date @group.end_date
  json.target_destination @group.target_destination
  json.locations @group.locations
  json.language_setting @group.language_setting
  json.banner_weather_options adgroup_weather_options
  json.creatives do
    json.array! @group.creatives
  end
end

json.countries do
  json.array! @countries, :id, :name
end

json.adtag_script @adtag_script