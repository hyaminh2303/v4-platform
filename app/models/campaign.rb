class Campaign
  include Mongoid::Document
  include Pagination
  include Trackable

  field :name, type: String
  field :start_date, type: Date
  field :end_date, type: Date
  field :campaign_type, type: String
  field :archive_rawdata_urls, type: Array, default: []
  field :views, type: Integer, default: 0
  field :clicks, type: Integer, default: 0
  field :landed, type: Integer, default: 0
  field :archived, type: Boolean, default: false
  field :analytic_profile_id, type: String

  index(start_date: 1, end_date: 1)

  attr_accessor :ctr, :drop_out

  belongs_to :created_by, class_name: 'User'
  belongs_to :category

  has_many :ad_groups
  has_many :creatives
  has_many :campaign_trackings

  def self.available(date)
    where(:start_date.lte => date, :end_date.gte => date)
  end

  def report_name(start_date, end_date, file_type = 'csv')
    filename = name.downcase.tr(' ', '_').tr('/', '_')
    "#{filename}_#{start_date}_#{end_date}.#{file_type}"
  end

  def finalize?
    end_date < Date.current - (ENV['ARCHIVE_DAYS'].to_i + 1).days && archive_rawdata_urls.present?
  end

  def is_available?(date)
    start_date <= date && end_date >= date
  end

  class << self
    def search(params)
      campaigns = Campaign.all
      campaigns = campaigns.any_of(name: /.*#{params[:query]}.*/i) if params[:query]
      campaigns
    end
  end
end
