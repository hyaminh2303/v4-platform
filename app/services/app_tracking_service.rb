#ad_group = AdGroup.find('5768b9fbe9a2cb47423228a0'); AppTrackingService.new(ad_group).fetch_data
class AppTrackingService
  MAP_FUNCTION = '
    function() {
      for (var app_name in this.app_names) {
        emit(app_name, {
          views: this.app_names[app_name].views || 0,
          clicks: this.app_names[app_name].clicks || 0,
          landed: this.app_names[app_name].landed || 0
        })
      }
    }
  '.freeze

  REDUCE_FUNCTION = '
    function(app_name, app_name_data) {
      var result = { views: 0, clicks: 0, landed: 0 }
      app_name_data.forEach(function(data) {
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