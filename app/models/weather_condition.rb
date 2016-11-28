class WeatherCondition
  include Mongoid::Document

  field :operator, type: String
  field :value1, type: Float
  field :value2, type: Float
  field :message, type: String
end
