json.data do
  json.array! @nationalities[:data] do |nationality|
    json.id nationality['_id']
    json.name nationality['name']
    json.locales nationality['locales']
  end
end

json.per_page @per_page
json.page @page
json.total @nationalities[:total]
