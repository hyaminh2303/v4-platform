class Creative
  include Mongoid::Document
  include Trackable

  ACCEPTED_DIMENSIONS = [
    {width: 320, height: 50},
    {width: 300, height: 250},
    {width: 728, height: 90},
    {width: 120, height: 600},
    {width: 468, height: 60},
    {width: 216, height: 36},
    {width: 120, height: 20},
    {width: 168, height: 28},
    {width: 320, height: 480},
    {width: 768, height: 1024},
    {width: 1024, height: 768},
    {width: 480, height: 320}
  ].freeze

  PLATFORMS = {
    datalift: 'datalift',
    pocket_math: 'pocket_math'
  }.freeze

  TRACKING_TYPES = {
    tracking_link: 'tracking_link',
    ad_tag: 'ad_tag'
  }.freeze

  field :name, type: String
  field :landing_url, type: String
  field :creative_type, type: String
  field :platform, type: String
  field :tracking_type, type: String
  field :width, type: Integer
  field :height, type: Integer
  field :banner_url, type: String
  field :client_impression_url_1, type: String, default: ''
  field :client_impression_url_2, type: String, default: ''
  field :client_impression_url_3, type: String, default: ''
  field :elements, type: Array, default: []
  field :status, type: String
  field :total_banners, type: Integer, default: 0
  field :processed_banners, type: Integer, default: 0
  field :views, type: Integer, default: 0
  field :clicks, type: Integer, default: 0
  field :landed, type: Integer, default: 0

  index(ad_group_id: 1)

  attr_accessor :ctr, :drop_out

  belongs_to :ad_group
  belongs_to :campaign

  delegate :locations, to: :ad_group
  delegate :name, to: :campaign, prefix: true
  delegate :name, to: :ad_group, prefix: true

  mount_uploader :banner, CreativeUploader

  validates :name, :landing_url, :creative_type, :ad_group, presence: true
  validates :platform, inclusion: {in: PLATFORMS.map { |_, v| v }}, allow_nil: true
  validates :tracking_type, inclusion: {in: TRACKING_TYPES.map { |_, v| v }}, allow_nil: true

  validate :check_dimensions
  validates :client_impression_url_1, url: {allow_blank: true}
  validates :client_impression_url_2, url: {allow_blank: true}
  validates :client_impression_url_3, url: {allow_blank: true}

  before_save :set_campaign
  after_save :set_banner_info

  %w(dynamic static).each do |name|
    define_method "#{name}?" do
      creative_type == name
    end
  end

  def check_dimensions
    return if banner_cache.nil?
    banner_dimension = {width: banner.width, height: banner.height}
    errors.add :banner, " is invalid size." unless ACCEPTED_DIMENSIONS.include?(banner_dimension)
  end

  def client_impression_urls
    [client_impression_url_1,
     client_impression_url_2,
     client_impression_url_3]
  end

  def data_tracking
    TrackingService.new(creative: self).generate
  end

  def tracking_link?
    tracking_type == TRACKING_TYPES[:tracking_link]
  end

  def coordinates
    Coordinate.where(ad_group_id: ad_group_id)
  end

  def having_temperature_element?
    return false if elements.blank?

    elements.each do |element|
      return true if element[:element_type] == 'weather'
    end

    false
  end

  def update_temperature
    WeatherSyncJob.perform_later([ad_group_id.to_s]) if having_temperature_element?
  end

  def report_name(start_date, end_date)
    campaign_name = campaign.name.tr(' ', '_').tr('/', '_')
    creative_name = name.downcase.tr(' ', '_').tr('/', '_')
    date = Date.current.strftime('%Y_%m_%d')
    "#{campaign_name}_[CR]#{creative_name}_#{start_date}_#{end_date}.csv"
  end

  private

  def set_banner_info
    set(banner_url: banner.url, width: banner.width, height: banner.height) if banner.height && banner.width
  end

  def set_campaign
    self.campaign = ad_group.campaign
  end

  def banner=(obj)
    super(obj)
    self.elements = dynamic? ? [{
      text: 'Location',
      x: 1,
      y: 1,
      font: 'Arial',
      font_size: 13,
      color: '#ffffff',
      font_weight: 'normal',
      font_style: 'normal',
      box_width: '',
      text_align: 'left'
    }] : []
  end
end
