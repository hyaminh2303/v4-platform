class ExchangeTrackingService
  MAP_FUNCTION = '
    function() {
      for (var exchange in this.exchanges){
        var new_platforms = {}
        for (var platform in this.exchanges[exchange].platforms){
          new_platforms[platform] = {
            clicks: this.exchanges[exchange].platforms[platform].clicks || 0,
            views: this.exchanges[exchange].platforms[platform].views || 0,
            landed: this.exchanges[exchange].platforms[platform].landed || 0
          }
        }
        emit(exchange, {
          views: this.exchanges[exchange].views || 0,
          clicks: this.exchanges[exchange].clicks || 0,
          landed: this.exchanges[exchange].landed || 0,
          platforms: new_platforms})
      }
    }
  '.freeze

  REDUCE_FUNCTION = '
    function(group_by, documents) {
      var result = {views: 0, clicks: 0, landed: 0, platforms: {}}
      documents.forEach(function(document) {
        result.views += document.views
        result.clicks += document.clicks
        result.landed += document.landed
        for(var platform in document.platforms){
          result.platforms[platform] = result.platforms[platform] || { views: 0, clicks: 0, landed: 0 }


          result.platforms[platform].views += document.platforms[platform].views
          result.platforms[platform].clicks += document.platforms[platform].clicks
          result.platforms[platform].landed += document.platforms[platform].landed
        }
      });

      return result;
    }
  '.freeze

  FINALIZE_FUNCTION = '
    function(group_by, result) {
      result.ctr = result.views == 0 ? 0 : result.clicks / result.views
      result.drop_out = result.clicks == 0 ? 0 : 1 - (result.landed / result.clicks)
      for (var key in result.platforms) {
        result.platforms[key].views = result.platforms[key].views || 0
        result.platforms[key].clicks = result.platforms[key].clicks || 0
        result.platforms[key].landed = result.platforms[key].landed || 0
        result.platforms[key].ctr = result.platforms[key].views == 0 ?
          0 : (result.platforms[key].clicks / result.platforms[key].views)
        result.platforms[key].drop_out = result.platforms[key].clicks == 0 ?
          0 : 1 - (result.platforms[key].landed / result.platforms[key].clicks)
      }
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
