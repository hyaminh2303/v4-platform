json.events do
  json.array! @events do |event|
    json.carrier_name event.carriername

    json.user_ip event.userip

    json.latitude event.latitude
    json.longitude event.longitude

    json.device_os event.deviceos
    json.device_id event.deviceid
    # json.device_type 'device type'
    # json.device_model 'device model'

    json.app_name event.appname

    json.exchange_name event.exchange

    json.country_code event.countrycode

    json.creative_id event.creativeid
    json.creative_type event.creative.try(:creative_type)
    json.creative_width event.creative.try(:width)
    json.creative_height event.creative.try(:height)

    json.language_name event.language

    browser_name = event.requestheaders['User-Agent'].try(:first)
    browser_version = browser_name.present? ? browser_name.split(' ').select{ |b| b.include?('Version') }.first : nil
    json.browser_name browser_name
    json.browser_version browser_version

    json.campaign_name event.creative_campaign.try(:name)
    json.campaign_id event.creative_campaign.try(:id)

    json.geofence_name event.nearest_location.try(:location_name)
    json.geofence_radius event.nearest_location.try(:radius)
    json.geofence_lat event.nearest_location.try(:lat)
    json.geofence_lng event.nearest_location.try(:lng)

    json.timestamp event.timestamp.strftime('%Y-%m-%d %H:%M:%S')
  end
end
json.total_page @total_page