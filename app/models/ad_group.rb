class AdGroup
  include Mongoid::Document
  include Pagination
  include Trackable

  DISTANCE_CONTIONS = { less_than: 'Less than', greater_than: 'Greater than', between: 'Between' }

  field :name, type: String
  field :start_date, type: Date, default: proc {
    campaign.try(:start_date) ||
      Date.current
  }
  field :end_date, type: Date, default: proc {
    campaign.try(:end_date) ||
      Date.current
  }
  field :target_destination, type: Boolean, default: false
  field :language_setting, type: String, default: 'en'
  field :archive_rawdata_urls, type: Array, default: []
  field :archived, type: Boolean, default: false
  field :condition_type,  type: String # weather, distance
  has_many :ad_group_weather_conditionals
  has_many :ad_group_distance_conditionals

  index(campaign_id: 1)

  belongs_to :campaign
  belongs_to :country
  has_many :creatives
  embeds_many :locations, cascade_callbacks: true

  delegate :name, to: :country, prefix: true, allow_nil: true
  delegate :code, to: :country, prefix: true, allow_nil: true
  delegate :name, to: :campaign, prefix: true, allow_nil: true

  validates :name, :start_date, :end_date, presence: true
  validates :locations, presence: true, on: :create

  validates :start_date, date: {
    after_or_equal_to: proc do |a|
      a.campaign.start_date
    end,
    before_or_equal_to: proc do |a|
      [a.campaign.end_date,
       a.end_date].min
    end
  }

  validates :end_date, date: {
    after_or_equal_to: proc do |a|
      [a.campaign.start_date,
       a.start_date].max
    end,
    before_or_equal_to: proc do |a|
      a.campaign.end_date
    end
  }

  def finalize?
    end_date < Date.current - (ENV['ARCHIVE_DAYS'].to_i + 1).days && archive_rawdata_urls.present?
  end

  def report_name(start_date, end_date)
    campaign_name = campaign.name.tr(' ', '_').tr('/', '_')
    ad_group_name = name.downcase.tr(' ', '_').tr('/', '_')
    "#{campaign_name}_[AD]#{ad_group_name}_#{start_date}_#{end_date}.csv"
  end

  def having_temperature_element?
    creatives.each do |creative|
      return true if creative.having_temperature_element?
    end

    false
  end

  def add_locations(location_params)
    LocationService.new(nil, target_destination, self, location_params).locations_from_params
  end

  def add_ad_group_weather_conditionals(condition_params)
    AdGroupWeatherConditionalService.new(self, condition_params).add_ad_group_weather_conditionals
  end

  def add_ad_group_distance_conditionals(condition_params)
    AdGroupDistanceConditionalService.new(self, condition_params).add_ad_group_distance_conditionals
  end

  class << self
    def search(params)
      ad_groups = AdGroup.all
      ad_groups = ad_groups.any_of(name: /.*#{params[:query]}.*/i) if params[:query]
      ad_groups
    end

    def summary(_params)
      # condition = {campaign_id: BSON::ObjectId(params[:campaign_id])}
      # condition['name'] = {"$regex" => /.*#{params[:query]}.*/i} if params[:query].present?
      # pipeline = ["$match" => condition]
      # pipeline << GROUP_COLLECTION
      # result = collection.aggregate(pipeline).first
      # result.present? ? result : {views: 0, clicks: 0,
      #                             ctrs: 0, landed: 0, drop_out: 0}
      {views: 0, clicks: 0, ctrs: 0, landed: 0, drop_out: 0}
    end

    def available
      where(:start_date.lte => Time.current, :end_date.gte => Time.current)
    end
  end
end
