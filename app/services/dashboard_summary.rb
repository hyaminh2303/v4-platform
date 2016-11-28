class DashboardSummary
  include HashHelper
  include ApplicationHelper

  def initialize(params)
    @params = params
  end

  attr_reader :params

  MAP = %{
      function(){
                      var platforms = {}
                      for (var key in this.platforms) {
                        platforms[key] = { views: this.platforms[key].views || 0,
                                              clicks: this.platforms[key].clicks || 0,
                                              landed: this.platforms[key].landed || 0 }
                      }
                      var device_os = {}
                      for (var key in this.device_os) {
                        device_os[key] = { views: this.device_os[key].views || 0,
                                              clicks: this.device_os[key].clicks || 0,
                                              landed: this.device_os[key].landed || 0 }
                      }
                      var countries = {}
                      for (var key in this.countries) {
                        countries[key] = { views: this.countries[key].views || 0,
                                              clicks: this.countries[key].clicks || 0,
                                              landed: this.countries[key].landed || 0 }
                      }
        emit( this.date, {views: this.views || 0, clicks: this.clicks || 0,
                           landed: this.landed || 0, country_ids: this.country_id || [],
                           campaign_ids: this.campaign_id || [],
                           platforms: platforms, countries: countries,
                           device_os: device_os})
      }
    }.freeze

  REDUCE = %{
      function(key, collect_values){
        result = {views: 0, clicks: 0, landed: 0, campaign_ids: [], device_os: {}, platforms: {}, countries: {}};

        collect_values.forEach(function(collect_value) {
          result.views += collect_value.views || 0;
          result.clicks += collect_value.clicks || 0;
          result.landed += collect_value.landed || 0;

          result.campaign_ids = result.campaign_ids.concat(collect_value.campaign_ids || [])
          // sum device_os -------------
          // {os: {views: 0, clicks: 0, landed: 0}, android: {views: 0, clicks: 0, landed: 0}}
          var device_os = collect_value.device_os || {}
          for (var key in device_os){
            if(!result.device_os[key])
              result.device_os[key] = {views: 0, clicks: 0, landed: 0}

            result.device_os[key].views += device_os[key].views || 0;
            result.device_os[key].clicks += device_os[key].clicks || 0;
            result.device_os[key].landed += device_os[key].landed || 0;
          }

          // sum platforms -------------
          // {pocketmath: { views: 0, clicks: 0, landed: 0}, datalift: { views: 0, clicks: 0, landed: 0}}
          var platforms = collect_value['platforms'] || {}
          for (var key in platforms){
            if(!result.platforms[key])
              result.platforms[key] = {views: 0, clicks: 0, landed: 0}

            result.platforms[key].views += platforms[key].views || 0;
            result.platforms[key].clicks += platforms[key].clicks || 0;
            result.platforms[key].landed += platforms[key].landed || 0;
          }

          // sum countries -------------
          // {vn: { views: 0, clicks: 0, landed: 0}, us: { views: 0, clicks: 0, landed: 0}}
          var countries = collect_value.countries || {}
          for (var key in countries){
            if(!result.countries[key])
              result.countries[key] = {views: 0, clicks: 0, landed: 0}

            result.countries[key].views += countries[key].views || 0;
            result.countries[key].clicks += countries[key].clicks || 0;
            result.countries[key].landed += countries[key].landed || 0;
          }
        })

        return result;
      }
    }.freeze

  def fetch
    if params[:campaign_ids].present?
      result = CampaignTracking.where(:campaign_id.in => params[:campaign_ids].split(',')
                                                         .map { |id| BSON::ObjectId(id) },
                                      :date.gte => Date.strptime(params[:start_date],
                                                                 '%d %b %y').beginning_of_day,
                                      :date.lte => Date.strptime(params[:end_date],
                                                                 '%d %b %y').end_of_day)
                               .map_reduce(MAP, REDUCE).out(inline: 1).to_a
    else
      result = CampaignTracking.where(:date.gte => Date.strptime(params[:start_date],
                                                                 '%d %b %y').beginning_of_day,
                                      :date.lte => Date.strptime(params[:end_date],
                                                                 '%d %b %y').end_of_day)
                               .map_reduce(MAP, REDUCE).out(inline: 1).to_a
    end
    summarize(result)
  end

  def summarize(stats)
    summary = {
      campaign_ids: [],
      chart: [],
      all: {views: 0, clicks: 0, landed: 0},
      device_os: {},
      platforms: {},
      countries: {}
    }
    stats.each do |record|
      record = record.deep_symbolize_keys

      temp = {views: record[:value][:views],
              clicks: record[:value][:clicks],
              landed: record[:value][:landed]}
      summary[:chart] << temp.merge(date: record[:_id])
      summary[:all] = sum_hash(summary[:all], temp)
      summary[:device_os] = sum_hash(summary[:device_os], record[:value][:device_os])
      summary[:platforms] = sum_hash(summary[:platforms], record[:value][:platforms])
      summary[:countries] = sum_hash(summary[:countries], record[:value][:countries])
      summary[:campaign_ids] += [record[:value][:campaign_ids]].flatten if params[:campaign_ids].blank?
    end

    summary[:all][:ctr] = devide_include_zero(summary[:all][:clicks],
                                              summary[:all][:views])
    if summary[:all][:clicks].zero? && summary[:all][:landed].zero?
      summary[:all][:drop_out] = 0
    else
      summary[:all][:drop_out] = 1 - devide_include_zero(summary[:all][:landed],
                                                         summary[:all][:clicks])
    end

    summary[:device_os] = calculate_ctr_drop_out(summary[:device_os])
    summary[:platforms] = calculate_ctr_drop_out(summary[:platforms])
    summary[:countries] = calculate_ctr_drop_out(summary[:countries])

    # restruct campaign_ids
    if params[:campaign_ids].blank?
      summary[:campaign_ids].uniq!
    else
      campaign_ids_select = Campaign.where(:id.in => params[:campaign_ids].split(',')
                                                         .map { |id| BSON::ObjectId(id) }).pluck(:id)
      summary[:campaign_ids] = CampaignTracking.where(:date.gte => Date.strptime(params[:start_date],
                                                           '%d %b %y').beginning_of_day,
                                                      :date.lte => Date.strptime(params[:end_date],
                                                           '%d %b %y').end_of_day).pluck(:campaign_id)

      summary[:campaign_ids] = (summary[:campaign_ids] + campaign_ids_select).uniq
    end

    summary
  end

  # ctr for hash plaforms, device_os, countries
  def calculate_ctr_drop_out(stat)
    return {} if stat.blank?

    stat.each do |key, _|
      stat[key][:ctr] = devide_include_zero(stat[key][:clicks], stat[key][:views])
      if stat[key][:clicks].zero? && stat[key][:landed].zero?
        stat[key][:drop_out] = 0
      else
        stat[key][:drop_out] = 1 - devide_include_zero(stat[key][:landed],
                                                       stat[key][:clicks])
      end
    end

    stat
  end
end
