class OperatingSystem
  include Mongoid::Document

  field :name, type: String
  field :code, type: String

  validates :code, presence: true
  index(name: 1, code: 1)
end
