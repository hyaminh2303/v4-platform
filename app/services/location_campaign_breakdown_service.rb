
# encoding: UTF-8

class LocationCampaignBreakdownService
  def initialize(campaign, total_fake_view, total_fake_click)
    @campaign = campaign
    ad_groups = @campaign.ad_groups
    @locations = ad_groups.inject([]) { |a, e| a + e.locations }
    @total_fake_click = total_fake_click.to_f
    @total_fake_view = total_fake_view.to_f

    @total_real_click = 0
    @total_real_view = 0
  end

  attr_reader :campaign, :locations, :total_fake_view, :total_fake_click,
    :total_real_click, :total_real_view

  def fetch
    data = LocationTrackingService.new(campaign.ad_groups.pluck(:id)).fetch_data

    return [] if locations.blank?

    result = []
    ratio_data(data).each do |v|
      v = v.symbolize_keys
      result << {
        name: v[:name],
        latitude: v[:latitude],
        longitude: v[:longitude],
        views: ratio_fix_view(v[:views]),
        clicks: ratio_fix_click(v[:clicks]),
        country_code: v[:country_code]
      }
    end

    result
  end

  private

  def merge_locations(data)
    result = {}
    locations.each do |location|
      track = data.find { |t| t['_id'] == location.id.to_s } || {}
      key = "#{location.name}-#{location.latitude}-#{location.longitude}"
      result[key] = sum_location(location.name, location.ad_group.country_code,
                                   location.latitude, location.longitude,
                                   result[key], track.fetch('value', {}))
    end

    result
  end

  def sum_location(name, country_code, lat, lng, track1, track2)
    track1 = track1.try(:symbolize_keys) || {}
    track2 = track2.try(:symbolize_keys) || {}

    @total_real_view += track2.fetch(:views, 0)
    @total_real_click += track2.fetch(:clicks, 0)

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

  # 3 locations:
  # l1: 8
  # l2: 7
  # l3: 5
  # real: 21 views
  # fake: 200 views
  # r1: 8*200 => 1600 / 21 => 76
  # r2: 7*200 => 1400 / 21 => 66
  # r2: 5*200 => 1000 / 21 => 47
  # con lai 11 fake. rai deu` 3 location: 4-4-3
  def ratio_data(data)
    real_data = merge_locations(data)

    result = []
    amount_location = locations.count
    total_view_not_fix = 0
    total_click_not_fix = 0

    real_data.each do |_, v|
      v = v.symbolize_keys
      r = {
        name: v[:name],
        latitude: v[:latitude],
        longitude: v[:longitude],
        views: ratio(v[:views], total_real_view, total_fake_view),
        clicks: ratio(v[:clicks], total_real_click, total_fake_click),
        country_code: v[:country_code]
      }
      result << r
      total_view_not_fix += r[:views]
      total_click_not_fix += r[:clicks]
    end

    calculate_fix_data(amount_location, total_view_not_fix, total_click_not_fix)

    result
  end

  def calculate_fix_data(amount_location, total_view_not_fix, total_click_not_fix)
    @int_fix_view = ((total_fake_view - total_view_not_fix) / amount_location).to_i
    @int_fix_click = ((total_fake_click - total_click_not_fix) / amount_location).to_i

    @owe_fix_view = (total_fake_view - total_view_not_fix) % amount_location
    @owe_fix_click = (total_fake_click - total_click_not_fix) % amount_location
  end

  # a1 => a2
  # b1 => b2
  def ratio(value_a1, value_a2, value_b2)
    (value_a1 * value_b2 / value_a2).to_i rescue 0
  end

  def ratio_fix_view(view)
    @owe_fix_view -= 1
    view + @int_fix_view + (@owe_fix_view >= 0 ? 1 : 0)
  end

  def ratio_fix_click(click)
    @owe_fix_click -= 1
    click + @int_fix_click + (@owe_fix_click >= 0 ? 1 : 0)
  end
end
