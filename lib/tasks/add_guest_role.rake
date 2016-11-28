namespace :v4 do
  desc 'Add guest role'
  task add_guest_role: :environment do
    role = Role.find_or_create_by(name: 'Guest', key: 'guest')
    role.users.find_or_create_by(email: 'malna.polya@lynxanalytics.com', name: 'Guest', password: '123456')
  end
end