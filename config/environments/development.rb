Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = true

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  # config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Asset digests allow you to set far-future HTTP expiration dates on all assets,
  # yet still be able to expire them through the digest params.
  config.assets.digest = true

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = { :address => 'localhost', :port => 1025 }
  config.action_mailer.default_url_options = { host: 'localhost:3000' }

  # Optional, Rails sets the default to :info
  config.log_level = :debug

  # Optional, Rails 4 defaults to true in development and false in production
  #config.autoflush_log = true

  # # Optional, use a URI to configure. Useful on Heroku
  # config.logstash.uri = 'localhost'

  # Optional. Defaults to :json_lines. If there are multiple outputs,
  # they will all share the same formatter.
  #config.logstash.formatter = :json_lines

  # Optional, max number of items to buffer before flushing. Defaults to 50
  #config.logstash.buffer_max_items = 50

  # Optional, max number of seconds to wait between flushes. Defaults to 5
  #config.logstash.buffer_max_interval = 5

  # Optional, defaults to '0.0.0.0'
  #config.logstash.host = 'localhost'

  # Optional, defaults to :udp.
  #config.logstash.type = :tcp

  # Required, the port to connect to
  #config.logstash.port = 5228

  # config.logstash.ssl_enable = true
  # config.logstash.ssl_certificate = "/etc/pki/tls/certs/logstash-beats.crt"

  # # Required
  # config.logstash.type = :file
  # # Optional, defaults to Rails log path
  # config.logstash.path = 'log/development.log'
  # config.lograge.enabled = true
  # config.lograge.formatter = Lograge::Formatters::Logstash.new

end
