class Api::V1::EventSerializer < ActiveModel::Serializer
  attributes :id, :type, :creativeid, :language, :deviceidentifiertype, :rawdata, :requestheaders
end
