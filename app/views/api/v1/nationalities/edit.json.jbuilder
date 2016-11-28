json.nationality do
  json.id @nationality.id
  json.name @nationality.name
  json.locales do
    json.array! @nationality.locales do |key, value|
      json.code key.to_s
      json.accuracy value.to_f
    end
  end
end
