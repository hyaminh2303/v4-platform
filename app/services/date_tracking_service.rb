class DateTrackingService
  MAP_FUNCTION = %{ function(){
                      var new_document = {}
                      for (var key in this.platforms) {
                        new_document[key] = { views: this.platforms[key].views || 0,
                                              clicks: this.platforms[key].clicks || 0,
                                              landed: this.platforms[key].landed || 0 }
                      }
                      emit({date: this.date},
                           {
                              platforms: new_document,
                              views: this.views || 0, clicks: this.clicks || 0, landed: this.landed || 0
                      })
                    }
                  }.freeze
  REDUCE_FUNCTION = %{ function(key, values){
                        var result = {views: 0, clicks: 0, landed: 0, platforms: {}}
                        values.forEach(function(hashData){
                          result.views += hashData.views
                          result.clicks += hashData.clicks
                          result.landed += hashData.landed
                          var platforms = hashData.platforms || {}
                          for (var k in platforms){
                            if(!result.platforms[k])
                              result.platforms[k] = {views: 0, clicks: 0, landed: 0}

                            result.platforms[k].views += platforms[k].views
                            result.platforms[k].clicks += platforms[k].clicks
                            result.platforms[k].landed += platforms[k].landed
                          }
                        })
                        return result;
                      }
                    }.freeze
  FINALIZE_FUCTION = %{ function(key, value){
                          value.ctr = value.views == 0 ? 0 : ( value.clicks / value.views );
                          value.drop_out = value.clicks == 0 ? 0 : (1 - value.landed/value.clicks);

                          var platforms = value.platforms || {}
                          for (var k in platforms){
                            if(value.platforms[k].clicks == 0 || value.platforms[k].views == 0){
                              value.platforms[k].ctr = 0
                              value.platforms[k].drop_out = 0
                            } else {
                              value.platforms[k].ctr = value.platforms[k].clicks / value.platforms[k].views;
                              value.platforms[k].drop_out = 1 - value.platforms[k].landed/value.platforms[k].clicks;
                            }
                          }
                          return value;
                        }
                      }.freeze

  def initialize(ad_group_id = {})
    @ad_group_id = ad_group_id
  end

  def fetch_data
    r = CreativeTracking.where(ad_group_id: @ad_group_id)
                        .map_reduce(MAP_FUNCTION, REDUCE_FUNCTION)
                        .finalize(FINALIZE_FUCTION).out(inline: 1)
    summarize(r.to_a)
  end

  private

  def summarize(stats)
    result = []
    summary = {views: 0, clicks: 0, ctr: 0, drop_out: 0, landed: 0}
    stats.each do |date|
      result << {
        date: date[:_id][:date],
        views: date[:value][:views],
        clicks: date[:value][:clicks],
        ctr: date[:value][:ctr],
        drop_out: date[:value][:drop_out],
        landed: date[:value][:landed],
        platforms: date[:value][:platforms]
      }
      summary_views_clicks_landed(summary, date[:value])
    end
    summary_ctr_drop_out(summary)
    [result, summary]
  end

  def summary_views_clicks_landed(summary, data)
    summary[:views] += data[:views].to_i
    summary[:clicks] += data[:clicks].to_i
    summary[:landed] += data[:landed].to_i
  end

  def summary_ctr_drop_out(summary)
    return {} if summary.blank?
    if summary[:clicks] == 0 || summary[:views] == 0
      summary[:ctr] = 0
      summary[:drop_out] = 0
    else
      summary[:ctr] = summary[:clicks].to_f / summary[:views].to_f
      summary[:drop_out] = 1 - summary[:landed].to_f / summary[:clicks].to_f
    end
  end
end
