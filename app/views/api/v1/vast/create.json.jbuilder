json.vast do
  json.ad_system @vast.ad_system rescue ""
  json.ad_title @vast.ad_title rescue ""
  json.description @vast.description rescue ""
  json.creative_type @vast.creative_type rescue ""
  json.has_companion_ad @vast.has_companion_ad == "1" rescue ""
  json.error_url @vast.error_urls[0].url || "" rescue ""
  json.impression_url @vast.impressions[0].url || "" rescue ""
  json.skipoffset @vast.linear_ads[0].skipoffset rescue ""
  json.duration @vast.linear_ads[0].duration rescue ""
  json.click_through @vast.linear_ads[0].click_through || @vast.non_linear_ads[0].non_linear_resources[0].click_through rescue ""
  json.click_tracking_url @vast.linear_ads[0].click_trackings[0].url || @vast.non_linear_ads[0].non_linear_resources[0].click_trackings[0].url rescue ""
  json.event @vast.linear_ads[0].tracking_events[0].event || @vast.non_linear_ads[0].tracking_events[0].event rescue ""
  json.tracking_event_url @vast.linear_ads[0].tracking_events[0].url || @vast.non_linear_ads[0].tracking_events[0].url rescue ""
  json.resource_url @vast.non_linear_ads[0].non_linear_resources[0].ad_resources[0].url rescue ""
  json.resource_type @vast.non_linear_ads[0].non_linear_resources[0].ad_resources[0].resource_type rescue ""
  json.com_resource_file ""
  json.com_resource_type @vast.companion_ads[0].ad_resources[0].resource_type rescue ""
  json.com_resource_url @vast.companion_ads[0].ad_resources[0].url rescue ""
  json.com_width @vast.companion_ads[0].width rescue ""
  json.com_height @vast.companion_ads[0].height rescue ""
  json.com_click_through @vast.companion_ads[0].click_through rescue ""
  json.com_click_tracking_url @vast.companion_ads[0].click_trackings[0].url rescue ""
  json.com_event @vast.companion_ads[0].tracking_events[0].event rescue ""
  json.com_tracking_event_url @vast.companion_ads[0].tracking_events[0].url rescue ""

  json.media_files_attributes do
    json.array! @vast.linear_ads[0].media_files do |media|
      json.url media.url
      json.width media.width
      json.height media.height
      json.media_type media.media_type
    end
  end
end

