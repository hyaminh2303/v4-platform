class GoogleMapService
  def initialize(params)
    @input_hash = {
      units: 'metric', # imperial: mile
      origins: format_latlng(params[:lat], params[:lng]),
      destinations: format_latlng(params[:dest_lat], params[:dest_lng]),
      key: ENV['GOOGLE_API_KEY'],
      mode: parse_mode(params[:mode])
    }
  end

  attr_reader :input_hash

  def build_uri(params)
    URI("https://maps.googleapis.com/maps/api/distancematrix/json?#{CGI.unescape(params.to_query)}")
  end

  def parse_mode(mode)
    return 'driving' if mode.blank?
    return 'transit' if mode == 'public transit'
    mode
  end

  def distance_duration
    result = fetch_api(input_hash)
    if result_ok?(result)
      {
        transportation_distance: result.fetch('distance').fetch('text'),
        transportation_duration: result.fetch('duration').fetch('text')
      }
    elsif result_not_found?(result) && !default_mode?
      @input_hash[:mode] = 'driving'
      distance_duration
    else
      {
        transportation_distance: "",
        transportation_duration: ""
      }
    end
  end

  def default_mode?
    input_hash[:mode] == 'driving'
  end

  def result_not_found?(result)
    result.present? && result.fetch('status') == 'ZERO_RESULTS' rescue false
  end

  def format_latlng(lat, lng)
    "#{lat},#{lng}"
  end

  def fetch_api(params)
    resp = Net::HTTP.get(build_uri(params))
    resp = JSON.parse(resp)

    resp.fetch('rows').first.fetch('elements').first rescue nil
  end

  def result_ok?(result)
    result.present? && result.fetch('status') == 'OK' rescue false
  end
end
