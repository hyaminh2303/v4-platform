class OsTrackingService
  MAP_FUNCTION = %{ function(){
                      for (var key in this.device_os) {
                        var new_document = {}
                        new_document[key] = { views: this.device_os[key].views || 0,
                                              clicks: this.device_os[key].clicks || 0,
                                              landed: this.device_os[key].landed || 0 }
                        emit({ad_group_id: this.ad_group_id}, new_document)
                      }
                     }
                   }.freeze
  REDUCE_FUNCTION = %{ function(key, collect_values){
                        var result = {}
                        collect_values.forEach(function(tHash) {
                          for (var key in tHash){
                            if(!result[key])
                              result[key] = {views: 0, clicks: 0, landed: 0}
                            result[key].views += tHash[key].views || 0
                            result[key].clicks += tHash[key].clicks || 0
                            result[key].landed += tHash[key].landed || 0
                          }
                        })
                        return result;
                      }
                    }.freeze
  FINALIZE_FUNCTION = %{ function(key, values){
                          for (var key in values){
                            if(values[key].views == 0 || values[key].clicks == 0) {
                              values[key].ctr = 0;
                              values[key].drop_out = 0;
                            } else {
                              values[key].ctr = values[key].clicks / values[key].views ;
                              values[key].drop_out = 1 - values[key].landed/values[key].clicks;
                            }
                          }
                          return values;
                        }
                      }.freeze

  def initialize(ad_group_id = {})
    @ad_group_id = ad_group_id
  end

  def fetch_data
    r = CreativeTracking.where(ad_group_id: @ad_group_id)
                        .map_reduce(MAP_FUNCTION, REDUCE_FUNCTION)
                        .finalize(FINALIZE_FUNCTION).out(inline: 1)
    summarize(r.to_a)
  end

  private

  def summarize(stats)
    summary = {views: 0, clicks: 0, ctr: 0, drop_out: 0, landed: 0}
    result = []
    if stats.any?
      stats[0][:value].each do |os|
        result << {
          os: os[0],
          views: os[1][:views],
          clicks: os[1][:clicks],
          ctr: os[1][:ctr],
          drop_out: os[1][:drop_out],
          landed: os[1][:landed]
        }
        summary_views_clicks_landed(summary, os[1])
      end
      summary_ctr_drop_out(summary)
    end
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
