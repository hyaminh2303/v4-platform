class DeviceTrackingService
  MAP_FUNCTION = '
    function() {
      emit(this.date, {
                        views: this.views || 0,
                        clicks: this.clicks || 0,
                        devices: this.devices || [],
                        clicked_devices: this.clicked_devices || [],
                        platforms: this.platforms || {}})
    }
  '.freeze

  REDUCE_FUNCTION = '
    function(date, values) {
      var result = {views: 0, clicks: 0, platforms: {}, devices: [], clicked_devices: []}
      values.forEach(function(tHash) {
        result.views += tHash.views
        result.clicks += tHash.clicks
        result.devices = result.devices.concat(tHash.devices)
        result.clicked_devices = result.clicked_devices.concat(tHash.clicked_devices)
        for (var key in tHash.platforms) {
          result.platforms[key] = result.platforms[key] || {views: 0, clicks: 0, devices: [], clicked_devices: []}

          result.platforms[key].views = result.platforms[key].views || 0
          result.platforms[key].views += tHash.platforms[key].views || 0

          result.platforms[key].clicks = result.platforms[key].clicks || 0
          result.platforms[key].clicks += tHash.platforms[key].clicks || 0

          result.platforms[key].devices = result.platforms[key].devices.concat(tHash.platforms[key].devices || [])

          result.platforms[key].clicked_devices = result.platforms[key]
                                                        .clicked_devices
                                                        .concat(tHash.platforms[key].clicked_devices || [])
        }
      });

      return result;
    }
  '.freeze

  FINALIZE_FUNCTION = '
    function(key, result) {
      result.number_devices = result.devices.length
      result.number_clicked = result.clicked_devices.length
      for (var key in result.platforms) {
        result.platforms[key].views = result.platforms[key].views || 0
        result.platforms[key].clicks = result.platforms[key].clicks || 0
        result.platforms[key].number_devices = result.platforms[key].devices ? result.platforms[key].devices.length : 0
        result.platforms[key].number_clicked = result.platforms[key]
                                                     .clicked_devices ? result.platforms[key].clicked_devices.length : 0
      }
      return result
    }
  '.freeze

  def initialize(group_id)
    @group_id = group_id
  end

  def fetch_data
    CreativeTracking.where(ad_group_id: @group_id)
                    .map_reduce(MAP_FUNCTION, REDUCE_FUNCTION)
                    .finalize(FINALIZE_FUNCTION).out(inline: 1).to_a
  end
end
