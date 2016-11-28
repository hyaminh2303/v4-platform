json.categories do
  json.array! @categories, :id, :name
end

json.campaign do
  json.(@campaign, :id, :name, :start_date, :end_date, :campaign_type, :category_id, :analytic_profile_id)
end