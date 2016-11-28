# encoding: UTF-8
require 'csv'

class LocationBreakdownService
  def initialize(campaign, params)
    @campaign = campaign
    @params = params.symbolize_keys
  end

  attr_reader :campaign, :params

  def fetch
    result = if params[:type] == 'campaign'
               fetch_campaign
             else
               fetch_ad_groups.values
             end

    return 'No data available' if result.blank?

    header_columns = %w(Name
                        Latitude
                        Longitude
                        Views
                        Clicks
                        Countrycode)

    file = CSV.generate do |csv|
      csv << header_columns
      result.each do |v|
        csv << [
          v[:name],
          v[:latitude],
          v[:longitude],
          v[:views],
          v[:clicks],
          v[:country_code]
        ]
      end
    end
    file
  end

  def fetch_ad_groups
    result = []
    ad_groups = []
    params[:groups].each do |id, param|
      param = param.symbolize_keys
      ad_group = AdGroup.find(id)
      ad_groups << ad_group
      result += LocationAdGroupBreakdownService.new(ad_group, param[:total_view], param[:total_click]).fetch
    end

    locations = ad_groups.inject([]) { |a, e| a + e.locations }
    merge_adgroup_locations(result, locations)
  end

  def fetch_campaign
    LocationCampaignBreakdownService.new(campaign, params[:total_view], params[:total_click]).fetch
  end

  def file_name
    if params[:type] != 'adgroup'
      "location_breakdown_#{campaign.name}.csv"
    else
      adgroup = AdGroup.find_by(id: params[:groups].keys[0].to_s)
      "location_breakdown_#{campaign.name}_#{adgroup.name}.csv"
    end
  end

  private

  def merge_adgroup_locations(data, locations)
    result = {}
    locations.each do |location|
      track = data.find { |t| t[:id] == location.id.to_s } || {}
      key = "#{location.name}-#{location.latitude}-#{location.longitude}"
      result[key] = sum_location(location.name, location.ad_group.country_code,
                                   location.latitude, location.longitude,
                                   result[key], track)
    end

    result
  end

  def sum_location(name, country_code, lat, lng, track1, track2)
    track1 = track1.try(:symbolize_keys) || {}
    track2 = track2.try(:symbolize_keys) || {}

    if track1.blank?
      return {
        name: name,
        country_code: country_code,
        views: track2.fetch(:views, 0),
        clicks: track2.fetch(:clicks, 0),
        latitude: lat,
        longitude: lng
      }
    end

    {
      name: name,
      country_code: country_code,
      views: track1.fetch(:views, 0) + track2.fetch(:views, 0),
      clicks: track1.fetch(:clicks, 0) + track2.fetch(:clicks, 0),
      latitude: lat,
      longitude: lng
    }
  end
end
