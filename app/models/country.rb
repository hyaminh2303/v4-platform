class Country
  include Mongoid::Document

  field :name, type: String
  field :code, type: String
  field :latitude, type: Float
  field :longitude, type: Float
  index(name: 1, code: 1)

  default_scope -> { where(:code.ne => 'UNKNOWN') }
end
