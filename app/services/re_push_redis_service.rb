require "redis"

class RePushRedisService
  def initialize
    @redis = Redis.new(
      host: ENV['REDIS_HOST'],
      port: ENV['REDIS_PORT'],
      db: ENV['REDIS_DB']
    )
  end

  attr_reader :redis

  def push(creative_ids)
    creative_ids = [creative_ids].flatten
    reject_keys = %w(_id isvalid clicked landed)

    Event.where(:creativeid.in => creative_ids, isvalid: false).each do |event|
      next if event.test?
      param = event.attributes.reject { |k| reject_keys.include?(k) }
      param = map_key_redis(param)
      redis.lpush("events", param.merge("isvalid" => true).to_json)
      # event.destroy
    end

    'done'
  end

  # backup plan
  def clone_redis_to_db
    reject_keys = %w(host Host requestheaders clicked landed remoteaddr useragent raw countryname)
    redis_0 = Redis.new(
      host: ENV['REDIS_HOST'],
      port: ENV['REDIS_PORT'],
      db: 1
    )
    redis.lrange('events', 0, -1).each do |json|
      redis_0.lpush("events", json)
      param = revert_map_key_redis(JSON.parse(json))
      param = param.reject { |k| reject_keys.include?(k) }
      Event.create(param.symbolize_keys.merge(isvalid: false))
    end

    'done'
  end

  def revert_map_key_redis(param)
    param["deviceos"] = param["device_os"]
    param["deviceid"] = param["device_id"]
    param["modelname"] = param["model_name"]
    param["appname"] = param["app_name"]
    param["carriername"] = param["carrier_name"]
    param["countryname"] = param["country_name"]
    param["statename"] = param["state_name"]
    param["userip"] = param["user_ip"]
    param["countrycode"] = param["country_code"]
    param["appid"] = param["app_id"]
    param["clickurl"] = param["click_url"]
    param["deviceidentifiertype"] = param["device_identifier_type"]
    param["type"] = param["event_type"]
    param["creativeid"] = param["creative_id"]
    param["remoteaddr"] = param["remote_addr"]
    param["useragent"] = param["user_agent"]
    param["conversionid"] = param["conversion_id"]
    param["nearestlocationname"] = param["nearest_location_name"]

    param.delete("device_os")
    param.delete("device_id")
    param.delete("model_name")
    param.delete("app_name")
    param.delete("carrier_name")
    param.delete("country_name")
    param.delete("state_name")
    param.delete("user_ip")
    param.delete("country_code")
    param.delete("app_id")
    param.delete("click_url")
    param.delete("device_identifier_type")
    param.delete("event_type")
    param.delete("creative_id")
    param.delete("remote_addr")
    param.delete("user_agent")
    param.delete("conversion_id")
    param.delete("nearest_location_name")

    param
  end


  def map_key_redis(param)
    param["device_os"] = param["deviceos"]
    param["device_id"] = param["deviceid"]
    param["model_name"] = param["modelname"]
    param["app_name"] = param["appname"]
    param["carrier_name"] = param["carriername"]
    param["country_name"] = param["countryname"]
    param["state_name"] = param["statename"]
    param["user_ip"] = param["userip"]
    param["country_code"] = param["countrycode"]
    param["app_id"] = param["appid"]
    param["click_url"] = param["clickurl"]
    param["device_identifier_type"] = param["deviceidentifiertype"]
    param["event_type"] = param["type"]
    param["creative_id"] = param["creativeid"]
    param["remote_addr"] = param["remoteaddr"]
    param["user_agent"] = param["useragent"]
    param["conversion_id"] = param["conversionid"]
    param["nearest_location_name"] = param["nearestlocationname"]

    param.delete("deviceos")
    param.delete("deviceid")
    param.delete("modelname")
    param.delete("appname")
    param.delete("carriername")
    param.delete("countryname")
    param.delete("statename")
    param.delete("userip")
    param.delete("countrycode")
    param.delete("appid")
    param.delete("clickurl")
    param.delete("deviceidentifiertype")
    param.delete("type")
    param.delete("creativeid")
    param.delete("remoteaddr")
    param.delete("useragent")
    param.delete("conversionid")
    param.delete("nearestlocationname")

    param
  end
end
