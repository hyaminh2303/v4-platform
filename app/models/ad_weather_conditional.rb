class AdWeatherConditional
  include Mongoid::Document

  field :condition_code, type: :string

  belongs_to :ad_group
  belongs_to :creative
end