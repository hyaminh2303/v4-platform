json.creative_types do
  json.array! @creative_types.each do |c|
    json.label c == 'preroll' ? 'Pre-roll' : c.capitalize
    json.value c
  end
end

json.media_types do
  json.array! @media_types do |k, v|
    json.label k
    json.value v
  end
end

json.events do
  json.array! @tracking_events do |k, v|
    json.label k
    json.value v
  end
end
