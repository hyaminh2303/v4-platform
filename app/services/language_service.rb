class LanguageService
  MAP_FUNCTION = '
    function() {
      for (var languages in this.languages) {
        emit(languages, {
          views: this.languages[languages].views || 0,
          clicks: this.languages[languages].clicks || 0,
          landed: this.languages[languages].landed || 0
        })
      }
    }
  '.freeze

  REDUCE_FUNCTION = '
    function(languages, language_data) {
      var result = { views: 0, clicks: 0, landed: 0 }
      language_data.forEach(function(data) {
        result.views += data.views
        result.clicks += data.clicks
        result.landed += data.landed
      })
      return result
    }
  '.freeze

  def initialize(ad_group)
    @ad_group = ad_group
  end

  def fetch_data
    creative_trackings = CreativeTracking.where(ad_group_id: @ad_group.id)
        .map_reduce(MAP_FUNCTION, REDUCE_FUNCTION)
        .out(inline: 1).to_a

    prepare_data(creative_trackings)
  end

  def prepare_data(tracking_data)
    creative_trackings = []
    tracking_data.map! { |data|
      {
          name: Locale.find_by(code: /^#{data['_id']}$/i).try(:name) || data['_id'],
          views: data['value']['views'],
          clicks: data['value']['clicks'],
          landed: data['value']['landed']
      }
    }.group_by { |data|
      data[:name]
    }.each do |key, value|
      views = value.inject(0) { |sum, hash| sum + hash[:views]}
      clicks = value.inject(0) { |sum, hash| sum + hash[:clicks]}
      landed = value.inject(0) { |sum, hash| sum + hash[:landed]}
      creative_trackings << {
          name: key,
          views: views,
          clicks: clicks,
          landed: landed,
          ctr: (clicks/views rescue 0),
          drop_out: (1 - landed/clicks rescue 0)
      }
    end
    creative_trackings
  end
end
