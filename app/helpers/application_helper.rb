module ApplicationHelper
  ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  ENCODING = "w9OhBqm0PncZUeLdKW8YvDRCgNfb7FJtiHT52rxoAkaslXpEujSyGI64VzQ31M"

  def encode(text)
    return text.to_s.tr(ALPHABET, ENCODING)
  end

  def decode(text)
    return text.to_s.tr(ENCODING, ALPHABET)
  end

  def devide_include_zero(num1, num2)
    return 0 if num2.zero?
    num1.to_f / num2.to_f
  end

  def get_event_userip(event)
    return event.userip if event.userip.present?
    event.requestheaders['X-Forwarded-For']

  rescue
    ''
  end

  def status_css(status)
    {
      expired: 'expired-campaign',
      running: 'running-campaign',
      pendding: 'pendding-campaign'
    }[status]
  end

  def status(start_date, end_date)
    if start_date <= Date.current && end_date >= Date.current
      :running
    elsif start_date > Date.current
      :pendding
    else
      :expired
    end
  end

  def adgroup_weather_options
    [
      {code: 'clear sky', icon: public_image('weathers/01d.png')},
      {code: 'few clouds', icon: public_image('weathers/02d.png')},
      {code: 'scattered clouds', icon: public_image('weathers/03d.png')},
      {code: 'broken clouds', icon: public_image('weathers/04d.png')},
      {code: 'shower rain', icon: public_image('weathers/09d.png')},
      {code: 'rain', icon: public_image('weathers/10d.png')},
      {code: 'thunderstorm', icon: public_image('weathers/11d.png')},
      {code: 'snow', icon: public_image('weathers/13d.png')},
      {code: 'mist', icon: public_image('weathers/50d.png')}
    ]
  end

  def public_image(path)
    "http://#{ENV['DASHBOARD_API_HOST']}/#{path}"
  end
end
