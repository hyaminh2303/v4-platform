class Platform
  include Mongoid::Document

  field :name, type: String
  field :code, type: String

  index(name: 1, code: 1)
end
