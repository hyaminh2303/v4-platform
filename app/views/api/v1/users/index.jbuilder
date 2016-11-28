json.data do
  json.array! @users, :id, :name, :email, :role_name, :created_at, :status
end

json.total @total
json.per_page @per_page
json.page @page
