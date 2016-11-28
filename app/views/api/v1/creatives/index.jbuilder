json.data do
  json.array! @creative_summary[:creatives],
    :id, :name, :landing_url, :banner_url, :ad_group_id, :creative_type, :platform, :tracking_type,
    :client_impression_url_1, :client_impression_url_2, :client_impression_url_3, :data_tracking,
    :views, :clicks, :landed, :ctr, :drop_out, :elements, :locations, :processed_banners, :total_banners, :width, :height
end

json.summary @creative_summary[:summary]
