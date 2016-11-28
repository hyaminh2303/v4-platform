class TimeFormat
  include Mongoid::Document

  field :js_format, type: String
  field :go_format, type: String
end
