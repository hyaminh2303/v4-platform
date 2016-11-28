require 'uuid'

module Utils
  def self.generate_api_secret
    UUID.new.generate.delete('-')
  end

  def self.generate_reset_token
    UUID.new.generate.delete('-')
  end

  def self.generate_password
    SecureRandom.hex(4)
  end
end
