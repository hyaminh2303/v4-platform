class TrackingDataHourService
  def initialize(current_time = nil)
    current_time ||= Time.current

    time_fetch = current_time - 1.hour

    @date = current_time.to_date
    @hour = current_time.hour
  end

  attr_reader :date, :hour

  def aggregate
    loop do
      first_aggregate_creative_tracking_hour = CreativeTrackingHour.any_of({:date.lt => date, aggregate_fail: nil},
        {:date => date, :hour.lt => hour, aggregate_fail: nil}).first

      break if first_aggregate_creative_tracking_hour.blank?

      aggregate_each(first_aggregate_creative_tracking_hour)
    end
  end

  def aggregate_each(creative_tracking_hour)
    id = creative_tracking_hour.id
    campaign_id = creative_tracking_hour.campaign_id
    ad_group_id = creative_tracking_hour.ad_group_id
    creative_id = creative_tracking_hour.creative_id
    aggre_date = creative_tracking_hour.date
    aggre_hour = creative_tracking_hour.hour

    is_ok = upsert_campaign_trackings(creative_tracking_hour, aggre_date, campaign_id)
    is_ok = upsert_creative_trackings(creative_tracking_hour, aggre_date, campaign_id, ad_group_id, creative_id) if is_ok

    clear_creative_tracking_hour(id) if is_ok

    detect_mark_aggregated_fail(creative_tracking_hour, is_ok)
  end

  def detect_mark_aggregated_fail(creative_tracking_hour, is_ok)
    unless is_ok
      creative_tracking_hour.update(aggregate_fail: true)
    end
  end

  # 1 record once. => return to get status
  def upsert_campaign_trackings(creative_tracking_hour, date, campaign_id)
    attributes = get_attr_upsert_campaign(creative_tracking_hour.attributes)

    campaign_tracking = CampaignTracking.where(campaign_id: BSON::ObjectId.from_string(campaign_id.to_s), date: date)
    if campaign_tracking.present?
      inc, add_to_set = build_upsert_attributes({}, {}, attributes)
      result =  campaign_tracking.update("$inc" => inc, "$addToSet" => add_to_set).ok?

      upsert_campaign(campaign_id, creative_tracking_hour) if result
      return result
    else
      result = CampaignTracking.create(attributes.merge({
        campaign_id: BSON::ObjectId.from_string(campaign_id.to_s), date: date})).valid?

      upsert_campaign(campaign_id, creative_tracking_hour) if result
      return result
    end

  # rescue
  #   false
  end

  # 1 record once. => return to get status
  def upsert_creative_trackings(creative_tracking_hour, date, campaign_id, ad_group_id, creative_id)
    attributes =  get_attr_upsert_creative(creative_tracking_hour.attributes)

    creative_tracking = CreativeTracking.where(creative_id: BSON::ObjectId.from_string(creative_id.to_s), date: date)
    if creative_tracking.present?
      inc, add_to_set = build_upsert_attributes({}, {}, attributes)
      result = creative_tracking.update({"$inc" => inc, "$addToSet" => add_to_set}).ok?

      upsert_creative(creative_id, creative_tracking_hour) if result
      return result
    else
      result = CreativeTracking.create(attributes.merge({
        campaign_id: BSON::ObjectId.from_string(campaign_id.to_s),
        ad_group_id: BSON::ObjectId.from_string(ad_group_id.to_s),
        creative_id: BSON::ObjectId.from_string(creative_id.to_s),
        date: date})).valid?

      upsert_creative(creative_id, creative_tracking_hour) if result
      return result
    end

  # rescue
  #   false
  end

  def upsert_campaign(campaign_id, creative_tracking_hour)
    Campaign.where(id: campaign_id).update({
      "$inc" => {
        views: creative_tracking_hour.views,
        clicks: creative_tracking_hour.clicks,
        landed: creative_tracking_hour.landed
      }
    })
  end

  def upsert_creative(creative_id, creative_tracking_hour)
    Creative.where(id: creative_id).update({
      "$inc" => {
        views: creative_tracking_hour.views,
        clicks: creative_tracking_hour.clicks,
        landed: creative_tracking_hour.landed
      }
    })
  end

  def clear_creative_tracking_hour(id)
    CreativeTrackingHour.find(id).destroy
  end

  def get_attr_upsert(attributes)
    delete_keys = %w(_id campaign_id ad_group_id creative_id date hour aggregate_fail)
    new_attributes = attributes
    new_attributes.delete_if {|key, _| delete_keys.include?(key) || is_i?(key) }
  end

  def get_attr_upsert_campaign(attributes)
    delete_keys = %w(_id campaign_id ad_group_id creative_id date hour exchanges languages carrier_names app_names post_views aggregate_fail)
    new_attributes = attributes
    new_attributes.delete_if {|key, _| delete_keys.include?(key) || is_i?(key) }
  end

  def get_attr_upsert_creative(attributes)
    delete_keys = %w(_id campaign_id ad_group_id creative_id date hour post_views)
    attributes.delete_if {|key, _| delete_keys.include?(key) || is_i?(key) }
  end

  def is_i?(str)
    !!(str =~ /\A[-+]?[0-9]+\z/)
  end

  def build_upsert_attributes(inc = {}, add_to_set = {}, attributes = {}, prefix_key = "")
    attributes.each do |k,v|
      if v.is_a?(Integer) || v.is_a?(Float)
        inc[merge_key_upsert(prefix_key, k)] = v
      elsif v.is_a?(Array)
        arr = (add_to_set[k].try(:[], "$each") || []) | v
        add_to_set[merge_key_upsert(prefix_key, k)] = {'$each' => arr}
      elsif v.is_a?(Hash)
        inc, add_to_set = build_upsert_attributes(inc, add_to_set, v, merge_key_upsert(prefix_key, k))
      else
        inc[merge_key_upsert(prefix_key, k)] = v
      end
    end

    return inc, add_to_set
  end

  def merge_key_upsert(key1, key2)
    return '' if key1.blank? && key2.blank?

    return "#{key1}.#{key2}" if key1.present? && key2.present?

    "#{key1}#{key2}"
  end














  def self.recalculate_campaign_tracking_data(date_has_data)
    CampaignTracking.where(date: date_has_data).pluck(:campaign_id).uniq.each do |campaign_id|
      campaign = Campaign.find(campaign_id)

      views_clicks_landed = CampaignTracking.where(campaign_id: campaign_id).inject({views: 0, clicks: 0, landed: 0}){
        |r, t| {views:  r[:views] + t.views,
                clicks: r[:clicks] + t.clicks,
                landed: r[:landed] + t.landed}
      }

      campaign.update({
        views: views_clicks_landed[:views],
        clicks: views_clicks_landed[:clicks],
        landed: views_clicks_landed[:landed]
      })
    end
  end

  def self.recalculate_creative_tracking_data(date_has_data)
    CreativeTracking.where(date: date_has_data).pluck(:creative_id).uniq.each do |creative_id|
      creative = Creative.find(creative_id)

      views_clicks_landed = CreativeTracking.where(creative_id: creative_id).inject({views: 0, clicks: 0, landed: 0}){
        |r, t| {views:  r[:views] + t.views,
                clicks: r[:clicks] + t.clicks,
                landed: r[:landed] + t.landed}
      }

      creative.update({
        views:  views_clicks_landed[:views],
        clicks: views_clicks_landed[:clicks],
        landed: views_clicks_landed[:landed]
      })
    end
  end

end

