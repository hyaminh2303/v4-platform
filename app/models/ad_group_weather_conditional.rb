class AdGroupWeatherConditional
  include Mongoid::Document

  field :condition_code, type: :string
  field :is_default, type: :boolean, default: false

  belongs_to :ad_group
  belongs_to :creative
end