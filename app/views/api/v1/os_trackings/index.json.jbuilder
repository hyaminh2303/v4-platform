json.data do
  json.array! @data_tracking do |data|
    operating_system = @operating_systems.select { |a| a.code.to_s == data[:os].to_s }.first
    name = operating_system.nil? ? 'Unknown' : operating_system.name
    json.os name
    json.views data[:views]
    json.clicks data[:clicks]
    json.ctr data[:ctr]
    json.landed data[:landed]
    json.drop_out data[:drop_out]
  end
end

json.summary @summary
