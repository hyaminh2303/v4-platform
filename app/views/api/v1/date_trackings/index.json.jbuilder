json.data do
  json.array! @data_tracking do |data|
   json.date data[:date]
   json.views data[:views]
   json.clicks data[:clicks]
   json.ctr data[:ctr]
   json.drop_out data[:drop_out]
   json.landed data[:landed]

   json.platforms do
      json.array! data[:platforms].each do |platform, value|
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

json.summary @summary