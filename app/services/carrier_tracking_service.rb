class CarrierTrackingService
  MAP_FUNCTION = '
    function() {
      for (var carrier_name in this.carrier_names) {
        emit(carrier_name, {
          views: this.carrier_names[carrier_name].views || 0,
          clicks: this.carrier_names[carrier_name].clicks || 0,
          landed: this.carrier_names[carrier_name].landed || 0
        })
      }
    }
  '.freeze

  REDUCE_FUNCTION = '
    function(carrier_name, carrier_name_data) {
      var result = { views: 0, click: 0, landed: 0 }
      carrier_name_data.forEach(function(data) {
        result.views += data.views
        result.clicks += data.clicks
        result.landed += data.landed
      })
      return result
    }
  '.freeze

  FINALIZE_FUNCTION = '
    function(group_by, result) {
      result.ctr = result.views == 0 ? 0 : result.clicks / result.views
      result.drop_out = result.clicks == 0 ? 0 : 1 - (result.landed / result.clicks)
      return result
    }
  '.freeze

  def initialize(ad_group)
    @ad_group = ad_group
  end

  def fetch_data
    CreativeTracking.where(ad_group_id: @ad_group.id)
        .map_reduce(MAP_FUNCTION, REDUCE_FUNCTION)
        .finalize(FINALIZE_FUNCTION)
        .out(inline: 1).to_a
  end
end