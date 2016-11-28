json.chart(@summary[:chart]) do |f|
  json.views f[:views]
  json.clicks f[:clicks]
  json.landed f[:landed]
  json.date f[:date]
end
json.campaign_options do
  json.array! @campaign_options do |campaign_option|
    json.id campaign_option[0]
    json.name campaign_option[1]
  end
end
json.all @summary[:all]

json.device_os do
  @summary[:device_os].each do |key, value|
    operating_system = @operating_systems.select { |a| a.code.to_s == key.to_s }.first
    name = operating_system.nil? ? 'Unknown' : operating_system.name
    json.set! name do
      json.views value[:views]
      json.clicks value[:clicks]
      json.ctr value[:ctr]
      json.landed value[:landed]
      json.drop_out value[:drop_out]
    end
  end
end

json.platforms do
  @summary[:platforms].each do |key, value|
    platform = @platforms.select { |a| a.code.to_s == key.to_s }.first
    name = platform.nil? ? 'Unknown' : platform.name
    json.set! name do
      json.views value[:views]
      json.clicks value[:clicks]
      json.ctr value[:ctr]
      json.landed value[:landed]
      json.drop_out value[:drop_out]
    end
  end
end

json.countries do
  @summary[:countries].each do |c|
    country = @countries.select { |a| a._id.to_s == c.first.to_s }.first
    key = country.nil? ? 'Unknown' : country.name
    json.set! key do
      json.views c.last[:views]
      json.clicks c.last[:clicks]
      json.ctr c.last[:ctr]
      json.landed c.last[:landed]
      json.drop_out c.last[:drop_out]
    end
  end
end
