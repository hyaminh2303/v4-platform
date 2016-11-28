class TrackingService
  include ApplicationHelper

  def initialize(creative: '', adgroup: '')
    @creative = creative
    @adgroup = adgroup
  end

  attr_reader :creative, :adgroup

  DATALIFT_MACRO = {
    lat: '{GPS_LAT}',
    lng: '{GPS_LON}',
    device_os: '{DEVICE_OS_NAME}',
    device_id: '{DEVICE_PLATFORM_ID}',
    model_name: '{MODEL_NAME}',

    campaign: '{CAMPAIGN}',
    creative: '{CREATIVE}',

    app_name: '{APP_NAME}',
    exchange: '{EXCHANGE_NAME}',
    carrier_name: '{CARRIER_NAME}',

    country_name: '{COUNTRY_NAME}',
    state_name: '{STATE_NAME}',

    timestamp: '{TIMESTAMP}',
    user_ip: '{USER_IP}',
    country_code: '{COUNTRY_CODE}',
    app_id: '{APP_ID}',
    click_url: '{CLICK_URL}',
    conversion_id: '{CONVERSION_ID}'
  }.map { |key, value| "#{key}=#{value}" }.join('&')

  POCKET_MATH_MACRO = {
    lat: '${lat_qp}',
    lng: '${lon_qp}',
    device_os: '${device_os_qp}',
    device_id: '${device_identifier_qp}',
    model_name: '${device_model_qp}',
    app_name: '${source_id_qp}',
    exchange: '${exchange_qp}',
    carrier_name: '${device_isp_qp}',
    timestamp: '${timestamp_qp}',
    user_ip: '${ip_add_qp}',
    country_code: '${postal_code_qp}',
    click_url: '${click_url_qp}',
    conversion_id: '${imp_id_qp}',
    device_identifier_type: '${device_identifier_type_qp}',
    gender: '${gender_qp}',
    target_category: '${target_category_qp}',
    device_category: '${device_category_qp}',
    app_or_web: '${app_or_web_qp}'
  }.map { |key, value| "#{key}=#{value}" }.join('&')

  EVENT_TYPES = {
    impression: 'imp',
    click: 'click'
  }.freeze

  def generate
    return {impression: '', click: '', ad_tag: ''} if creative.platform.blank?
    generate_tracking_urls.merge(ad_tag: generate_ad_tag(creative.platform))
  end

  def generate_ad_tag(platform='pocket_math')
    url = "#{ENV['TRACKING_URL']}/tr/adrequest?platform=#{encode(platform)}&creative_id=#{creative.id}&#{macro(platform)}"
    nocscript_url = "#{ENV['TRACKING_URL']}/imp?platform=#{encode(platform)}&creative_id=#{creative.id}&#{macro(platform)}"
    tracking_links = creative.client_impression_urls.reject(&:empty?).map do |link|
      "<img src='#{link}' width='1px' height='1px'>"
    end

    <<-SCRIPT
#{tracking_links.join("\n")}
<div id="#{creative.id}"></div>
<script type="text/javascript">
  (function(){
    var protocol = window.top.location && window.top.location.protocol;
    var yads = document.createElement('script');
    yads.type = 'text/javascript';
    yads.src = 'https://#{url}';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(yads, node);
  })();
</script>
<noscript>
  <img src="https://#{nocscript_url}" style="display:none;"/>
</noscript>
    SCRIPT
  end

  def generate_tracking_urls
    if creative.tracking_link?
      impression = tracking_url(:imp)
      click = "#{tracking_url(:clk)}&redirect=#{CGI.escape(creative.landing_url)}"

      {impression: impression, click: click}
    else
      {impression: '', click: ''}
    end
  end

  def generate_ad_tag_adgroup(platform=:pocket_math)
    url = "#{ENV['TRACKING_URL']}/tr/adrequest?platform=#{encode(platform)}&adgroup_id=#{adgroup.id}&condition_type=#{adgroup.condition_type}&#{macro(platform)}"
    nocscript_url = "#{ENV['TRACKING_URL']}/imp?platform=#{encode(platform)}&adgroup_id=#{adgroup.id}&condition_type=#{adgroup.condition_type}&adgroup_id=#{adgroup.id}&#{macro(platform)}"

    <<-SCRIPT
<div id="#{adgroup.id}"></div>
<script type="text/javascript">
  (function(){
    var protocol = window.top.location && window.top.location.protocol;
    var yads = document.createElement('script');
    yads.type = 'text/javascript';
    yads.src = 'https://#{url}';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(yads, node);
  })();
</script>
<noscript>
  <img src="https://#{nocscript_url}" style="display:none;"/>
</noscript>
    SCRIPT
  end

  private

  def tracking_url(type)
    "https://#{ENV['TRACKING_URL']}/#{type}?platform=#{encode(creative.platform)}&creative_id=#{creative.id}&#{macro(creative.platform.to_sym)}"
  end

  def macro(platform=:pocket_math)
    {
      datalift: DATALIFT_MACRO,
      pocket_math: POCKET_MATH_MACRO
    }[platform.to_sym]
  end
end
