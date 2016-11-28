# encoding: UTF-8

class LocationAdGroupBreakdownService
  def initialize(ad_group, total_fake_view, total_fake_click)
    @ad_group = ad_group
    @locations = ad_group.locations
    @total_fake_click = total_fake_click.to_f
    @total_fake_view = total_fake_view.to_f

    @total_real_click = 0
    @total_real_view = 0
  end

  attr_reader :ad_group, :locations, :total_fake_view, :total_fake_click,
    :total_real_click, :total_real_view

  def fetch
    data = LocationTrackingService.new(ad_group.id).fetch_data

    return [] if locations.blank?

    result = []
    ratio_data(data).each do |v|
      result << {
        id: v[:id],
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
  def ratio_data(real_data)
    result = []
    total_view_not_fix = 0
    total_click_not_fix = 0

    real_data.each do |row|
      v = row['value'].symbolize_keys
      @total_real_view += v.fetch(:views, 0)
      @total_real_click += v.fetch(:clicks, 0)
    end

    real_data.each do |row|
      v = row['value'].symbolize_keys

      r = {
        id: row['_id'],
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
    calculate_fix_data(locations.count, total_view_not_fix, total_click_not_fix)

    result
  end

  def calculate_fix_data(amount_location, total_view_not_fix, total_click_not_fix)
    @int_fix_view = ((total_fake_view - total_view_not_fix) / amount_location).to_i
    @int_fix_click = ((total_fake_click - total_click_not_fix) / amount_location).to_i

    @owe_fix_view = (total_fake_view - total_view_not_fix) % amount_location
    @owe_fix_click = (total_fake_click - total_click_not_fix) % amount_location
  end

  # a1 => a2 16 56  40 56
  # b1 => b2    10     10
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
