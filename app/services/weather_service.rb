class WeatherService
  WEATHER_ICONS = {
    '01d' => 'clear sky',
    '01n' => 'clear sky',
    '02d' => 'few clouds',
    '02n' => 'few clouds',
    '03d' => 'scattered clouds',
    '03n' => 'scattered clouds',
    '04d' => 'broken clouds',
    '04n' => 'broken clouds',
    '09d' => 'shower rain',
    '09n' => 'shower rain',
    '10d' => 'rain',
    '10n' => 'rain',
    '11d' => 'thunderstorm',
    '11n' => 'thunderstorm',
    '13d' => 'snow',
    '13n' => 'snow',
    '50d' => 'mist',
    '50n' => 'mist'
  }

  def initialize(params)
    params = CGI.unescape({
      lat: params[:lat],
      lon: params[:lng],
      units: 'metric', # imperial
      appid: ENV['WEATHER_API_KEY'],
      lang: params[:lang] || 'en'
    }.to_query)

    @uri = URI("http://api.openweathermap.org/data/2.5/weather?#{params}")
  end

  attr_reader :uri, :weather

  def temperature
    fetch_api

    return {} unless result_ok?

    {
      temperature: weather.fetch('main').fetch('temp').to_f,
      weather_condition: weather.fetch('weather').first.fetch('description'),
      weather_code: get_weather_code(weather.fetch('weather').first.fetch('icon'))
    }
  end

  def fetch_api
    @weather = Net::HTTP.get(uri)
    @weather = JSON.parse(@weather)
  end

  def result_ok?
    weather.fetch('main').fetch('temp').present?
  end

  def get_weather_code(img_str)
    WEATHER_ICONS[img_str]
  end
end
