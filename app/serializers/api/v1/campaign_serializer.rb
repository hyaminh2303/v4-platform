class Api::V1::CampaignSerializer < ActiveModel::Serializer
  attributes :id, :name, :start_date, :end_date, :campaign_type, :total_records , :total_pages

  def total_records
    total = 0
    object.campaign_trackings.where(:date.gte => instance_options[:date].beginning_of_day, :date.lte => instance_options[:date].end_of_day).each do |track|
      total += track.views + track.clicks + track.landed
    end

    total
  end

  def total_pages
    total = 0
    per_page = 1000
    object.campaign_trackings.where(:date.gte => instance_options[:date].beginning_of_day, :date.lte => instance_options[:date].end_of_day).each do |track|
      total += track.views + track.clicks + track.landed
    end

    (total.to_f / per_page.to_f).ceil
  end
end
