namespace :users do
  task :fix_status => :environment do
    User.where(status: 'enable').update_all(status: 'enabled')
    User.where(status: 'disable').update_all(status: 'disabled')
  end
end
