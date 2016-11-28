class Role
  include Mongoid::Document

  field :name, type: String
  field :key, type: String

  validates :name, :key, presence: true

  has_many :users

  class << self
    def admin
      find_by(key: 'admin')
    end

    def super_admin
      find_by(key: 'super_admin')
    end

    def guest
      find_by(key: 'guest')
    end
  end
end
