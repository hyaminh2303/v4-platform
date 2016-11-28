json.categories do
  json.array! @categories, :id, :name
end

json.countries do 
  json.array! @countries, :id, :name
end