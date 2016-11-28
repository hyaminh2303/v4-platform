json.(@user, :id, :name, :email, :role_name, :role_key)
json.auth_token @user.access_token.value
