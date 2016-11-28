source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.6'
gem 'jbuilder', '~> 2.0'
gem 'bcrypt', '~> 3.1.7'
gem 'mongoid', '>= 5.1.3'
gem 'rack-cors', :require => 'rack/cors'
gem 'uuid'
gem 'passenger'
gem 'lograge'
gem 'email_validator'
gem 'haml'
gem 'haml-rails', '~> 0.9.0'
gem 'pundit'
gem 'carrierwave-mongoid', :require => 'carrierwave/mongoid'
gem 'fog'
gem 'rmagick', require: 'rmagick'
gem 'dotenv-rails'
gem 'validate_url'
gem 'date_validator', '~> 0.9.0'
gem 'logstash-logger'
gem 'logstash-event'
gem 'sidekiq'
gem 'sinatra'
gem "sidekiq-cron", "~> 0.4.0"
gem 'google-api-client', '0.8'
gem 'nokogiri'
gem 'activemodel-associations'
gem 'charlock_holmes'
gem 'vast_generator', git: 'https://yoosedev:GqQJ3rAQcz@bitbucket.org/yoose/vast_generator.git', :branch => "v4-vast"
gem 'rubyzip', '~> 1.1.0'
gem 'axlsx', '2.1.0.pre'
gem 'axlsx_rails'
gem 'redis', '~>3.2'
gem 'active_model_serializers', '~> 0.10.2'
gem "rack-timeout"

group :development, :test do
  gem 'mailcatcher', '~> 0.6.4'
  gem 'byebug'
  gem 'rubocop'
  gem 'pry-rails'
  gem 'faker'
end

group :test do
  gem 'sqlite3'
  gem 'rspec-rails'
  gem 'factory_girl_rails'
  # gem 'database_cleaner'
  gem 'database_cleaner', :git => 'https://github.com/DatabaseCleaner/database_cleaner.git'
end

group :development do
  gem 'foreman'
  gem 'capistrano', '3.4.0'
  gem 'capistrano-rails'
  # Access an IRB console o n exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  # gem 'spring'
end

