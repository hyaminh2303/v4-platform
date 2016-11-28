class FixEventService
  def self.fix_invalid_click(from = Date.current, to = Date.current)
    from = from.beginning_of_day
    to = to.end_of_day
    date = from

    Campaign.available(from).each do |campaign|
      campaign.creatives.each do |creative|
        date = from
        while date <= to
          events = Event.where(creativeid: creative.id,
                               :type.in => ['click', 'landed'],
                               isvalid: false,
                               :timestamp.gte => date.beginning_of_day,
                               :timestamp.lte => date.end_of_day,
                               errortype: 'invalid_click_request')

          types = events.pluck(:type)

          click = types.count { |type| type == 'click' }
          landed = types.count { |type| type == 'landed' }

          creative_tracking = CreativeTracking.find_or_create_by(
                                creative_id: creative.id,
                                date: date.to_date)
          creative_tracking.update(clicks: creative_tracking.clicks + click,
                                   landed: creative_tracking.landed + landed)
          creative.update(
            clicks: (creative.clicks + click),
            landed:  (creative.landed + landed))

          campaign_tracking = CampaignTracking.find_or_create_by(
                                campaign_id: campaign.id,
                                date: date.to_date)
          campaign_tracking.update(clicks: campaign_tracking.clicks + click,
                                   landed: campaign_tracking.landed + landed)
          campaign.update(
            clicks: (campaign.clicks + click),
            landed:  (campaign.landed + landed))

          events.update_all(isvalid: true, errortype: nil)
          date += 1.day
        end
      end
    end
  end
end
