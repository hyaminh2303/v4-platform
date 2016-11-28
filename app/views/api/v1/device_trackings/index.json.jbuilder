json.data do
  json.array! @device_trackings do |device_tracking|
    json.date device_tracking['_id']
    json.views device_tracking['value']['views']
    json.clicks device_tracking['value']['clicks']
    json.devices device_tracking['value']['number_devices']
    json.clicked_devices device_tracking['value']['number_clicked']
    json.platforms do
      json.array! device_tracking['value']['platforms'].each do |platform, value|
        json.name platform
        json.views value['views']
        json.clicks value['clicks']
        json.clicked_devices value['number_clicked']
        json.devices value['number_devices']
      end
    end
  end
end
json.total do
  json.views @device_trackings.map {|d| d['value']['views']}.reduce(:+)
  json.clicks @device_trackings.map {|d| d['value']['clicks']}.reduce(:+)
  json.clicked_devices @device_trackings.map {|d| d['value']['number_clicked']}.reduce(:+)
  json.devices @device_trackings.map {|d| d['value']['number_devices']}.reduce(:+)
end