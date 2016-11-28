class Element
  include Mongoid::Document
  field :text, type: String
  field :x, type: Integer
  field :y, type: Integer
  field :color, type: String
  field :font, type: String
  field :font_size, type: Integer
  field :font_weight, type: String
  field :font_style, type: String
  field :element_type, type: String
  field :time_zone, type: String
  field :time_format, type: String
  field :weather_conditions, type: Array, default: []
  field :box_width, type: Integer
  field :text_align, type: String

  def initialize(*args)
    args.map! { |hash| hash.each_pair{ |k, v| hash[k] = nil if v == 'null'} }
    super
  end
end
