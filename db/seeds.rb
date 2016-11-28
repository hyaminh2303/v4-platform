%w(admin super_admin).each do |key|
  Role.create(name: key.titleize, key: key) if Role.find_by(key: key).nil?
end

user = User.find_by(email: 'admin@yoose.com')

user = User.create!(name: 'Yoose', email: 'admin@yoose.com', password: '123456', password_confirmation: '123456', role: Role.find_by(key: 'super_admin')) if user.nil?

user.update(role: Role.find_by(key: 'super_admin'))


