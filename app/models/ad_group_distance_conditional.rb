class AdGroupDistanceConditional
  include Mongoid::Document

  field :condition, type: String # less_than, greater_than, between
  field :value1, type: Float
  field :value2, type: Float

  belongs_to :ad_group
  belongs_to :creative
end