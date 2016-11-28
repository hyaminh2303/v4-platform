class TimeService
  attr_reader :uri, :time

  def initialize(p)
    params = CGI.unescape({
      location: "#{p[:lat]},#{p[:lng]}",
      timestamp: Time.now.to_i,
      key: ENV['GOOGLE_API_KEY']
    }.to_query)

    @uri = URI("https://maps.googleapis.com/maps/api/timezone/json?#{params}")
  end

  def fetch_api
    ping_result = Net::HTTP.get(uri)
    @time = JSON.parse(ping_result)
  end

  def result_ok?
    time["timeZoneId"].present?
  end

  def time_zone
    fetch_api
    return {} unless result_ok?

    {time_zone: time["timeZoneId"]}
  end
end
