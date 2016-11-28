class Event
  include Mongoid::Document

  field :latitude, type: Float
  field :longitude, type: Float
  field :deviceos, type: String
  field :deviceid, type: String
  field :modelname, type: String
  field :campaign, type: String
  field :creative, type: String
  field :appname, type: String
  field :exchange, type: String
  field :carriername, type: String
  field :country, type: String
  field :statename, type: String
  field :timestamp, type: DateTime
  field :userip, type: String
  field :countrycode, type: String
  field :appid, type: String
  field :clickurl, type: String
  field :conversionid, type: String
  field :deviceidentifiertype, type: String
  field :nearestlocationname, type: String
  field :gender, type: String
  field :targetcategory, type: String
  field :devicecategory, type: String
  field :apporweb, type: String

  field :type, type: String
  field :platform, type: String
  field :creativeid, type: String
  field :rawdata, type: Object
  field :isvalid, type: Boolean, default: true
  field :language, type: String
  field :errortype, type: String
  field :distance, type: Float
  field :coord, type: Hash
  field :fingerprint, type: String
  field :requestheaders, type: Object
  # === Error Priority ===
  # invalid_platform
  # testing_request
  # invalid_latlng
  # invalid_click_request
  # duplicated_request
  # invalid_date

  delegate :campaign, :ad_group, to: :creative, allow_nil: true, prefix: true

  index(coord: '2dsphere', creativeid: 1, type: 1, isvalid: 1)
  index(creativeid: 1, type: 1, isvalid: 1, timestamp: 1)

  def test?
    if param_test?(appname) || param_test?(userip) || param_test?(deviceos) || param_test?(deviceid)
      return true
    end

    false
  end

  def param_test?(value)
    value.try(:first) == '{' && value.try(:last) == '}'
  end

  def error_type_str
    return '' if isvalid
    errortype.try(:titleize) || 'Unknown'
  end

  def nearest_location
    Coordinate.where(ad_group_id: creative.try(:ad_group_id),
                     coord: {
                         '$near'=> {
                             '$geometry' => {
                                 type: 'Point',
                                 coordinates: [longitude, latitude]
                             }
                         }
                     })[0]
  end

  def creative
    Creative.find(creativeid)
  end
end
