json.campaign @campaign, :id, :name, :start_date, :end_date
json.ad_group do
  json.id @group.id
  json.name @group.name
  json.campaign_id @group.campaign_id
  json.start_date @group.start_date
  json.end_date @group.end_date
  json.country_id @group.country_id
  json.target_destination @group.target_destination
  json.language_setting @group.language_setting
  json.locations do
    json.array! @group.locations
  end
  json.exist_data_location_ids @exist_data_location_ids
  json.condition_type @group.condition_type
  json.ad_group_weather_conditionals do
    json.array! @group.ad_group_weather_conditionals
  end
  json.ad_group_distance_conditionals do
    json.array! @group.ad_group_distance_conditionals
  end
  json.banner_weather_options adgroup_weather_options
  json.banner_distance_options AdGroup::DISTANCE_CONTIONS.map{|d| { key: d[0], label: d[1] }}
  json.creatives do
    json.array! @group.creatives
  end
end

json.countries do
  json.array! @countries, :id, :name
end

json.adtag_script @adtag_script