require 'sidekiq-cron'

Sidekiq.configure_server do |config|
  redis_port = ENV['REDIS_PORT'] || 6379
  redis_host = ENV['REDIS_HOST'] || 'localhost'
  config.redis = { url: "redis://#{redis_host}:#{redis_port}" }

  schedule_file = File.expand_path("../../../config/scheduler.yml",__FILE__)
  if File.exists?(schedule_file)
    Sidekiq::Cron::Job.load_from_hash YAML.load_file(schedule_file)
  end
end

Sidekiq.configure_client do |config|
  redis_port = ENV['REDIS_PORT'] || 6379
  redis_host = ENV['REDIS_HOST'] || 'localhost'
  config.redis = { url: "redis://#{redis_host}:#{redis_port}" }
end