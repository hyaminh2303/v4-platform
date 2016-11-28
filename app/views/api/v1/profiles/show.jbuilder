json.roles do
  json.array! @roles, :id, :name
end

json.user do
  json.(current_user, :id, :name, :email, :role_id, :role_name, :role_key)
end