require 'google/api_client'
require 'net/http'

class AnalyticService
  include CustomXlsxHelper

  DATE_HEADER = {
    'ga:date' => 'Date',
    'ga:sourceMedium' => 'Source / Medium',
    'ga:sessions' => 'Sessions',
    'ga:percentNewSessions' => '% New Session',
    'ga:newUsers' => 'New Users',
    'ga:bounceRate' => 'Bounce Rate',
    'ga:pageviewsPerSession' => 'Pages / Session',
    'ga:avgSessionDuration' => 'Avg.Session Duration'
  }

  PAGE_HEADER = {
    'ga:pagePath' => 'Page',
    'ga:sourceMedium' => 'Source / Medium',
    'ga:pageviews' => 'Pageviews',
    'ga:uniquePageviews' => 'Unique Pageviews',
    'ga:avgTimeOnPage' => 'Avg. Time on Page',
    'ga:bounceRate' => 'Bounce Rate'
  }

  def initialize(campaign_id, send_to_email)
    @campaign = Campaign.find(campaign_id)
    @send_to_email = send_to_email
    @profile_id =  @campaign.analytic_profile_id # ENV['ANALYTIC_PROFILE_ID']
    @email = ENV['ANALYTIC_EMAIL']
    @key = Google::APIClient::KeyUtils.load_from_pkcs12(File.join(Rails.root, ENV['ANALYTIC_P12']), 'notasecret')
    @access_token = fetch_access_token

    `mkdir -p tmp/analytics`
    path_tmp = File.join(Rails.root, 'tmp/analytics')
    @file_path = File.join(path_tmp, "#{@campaign.report_name('xlsx')}")
    @file_zip_path = "#{@file_path}.zip"
  end

  attr_reader :campaign, :profile_id, :email, :key, :access_token, :file_path, :file_zip_path, :send_to_email

  def export(options = {})
    options['start-date'] = (options['start-date'] || campaign.start_date).strftime('%Y-%m-%d')
    options['end-date'] = (options['end-date'] || campaign.end_date).strftime('%Y-%m-%d')
    options['max-results'] = options['max-results'] || 10000
    options['start-index'] = options['start-index'] || 1

    data_by_date = export_by_date(options) # [arr_obj,arr_obj]
    data_by_page = export_by_page(options) # [{<key>: arr_obj}]

    File.open(file_path, 'w') do |file|
      file.write(Api::V1::CampaignReportsController.new
      .render_to_string(template: "api/v1/analytics/report.xlsx.axlsx",
      layout: false, formats: [:axlsx], locals: {data_by_date: data_by_date, data_by_page: data_by_page}))
    end

    zipfile
    url = upload_s3
    send_mail(url)
    remove_tmp
  end


  def zipfile
    Zip::File.open(file_zip_path, Zip::File::CREATE) do |zipfile|
      zipfile.add(campaign.report_name('xlsx'), file_path)
    end
  end

  def send_mail(url)
    UserMailer.analytic_export("[V4-Analytic]: #{campaign.report_name('xlsx')}", url, send_to_email).deliver_now
  end

  def export_by_date(options)
    options = options.merge({'metrics' => 'ga:newUsers,ga:percentNewSessions,ga:sessions,ga:bounceRate,ga:avgSessionDuration,ga:pageviewsPerSession', 'dimensions' => 'ga:sourceMedium,ga:date', 'sort' => 'ga:date'})
    fetch(options)
  end

  def export_by_page(options)
    options = options.merge({'metrics' => 'ga:bounceRate,ga:pageviews,ga:uniquePageviews,ga:avgTimeOnPage', 'dimensions' => 'ga:sourceMedium,ga:pagePath', 'sort' => 'ga:pagePath'})
    results = fetch(options)

    merge_same_row_page(results)
  end

  def merge_same_row_page(results)
    merged = {}
    header = results[:headers]
    rerange_header = PAGE_HEADER.keys

    results[:rows].each do |row|
      # switch positions match with output HEADER
      rerange_row = []
      rerange_header.each do |name|
        i = header.index(name)
        rerange_row << row[i]
      end
      # ---

      key = key_unique_page_path(rerange_row, AnalyticService::PAGE_HEADER.keys)

      if merged[key].blank?
        merged[key] = [rerange_row]
      else
        merged[key] << rerange_row
      end
    end

    merged
  end

  def fetch(options)
    fetch_page([], options)
  end

  def upload_s3
    uploader = AnalyticReportUploader.new
    uploader.store!(File.open(file_zip_path))
    uploader.url
  end

  def remove_tmp
    `rm #{file_path}`
    `rm #{file_zip_path}`
  end

  def fetch_page(results, options)
    result = Net::HTTP.get(request_page_view_uri(options))
    result = JSON.parse(result)

    per_page = result["itemsPerPage"]
    total_result = result["totalResults"]
    current_index = result["query"]["start-index"]
    start_index = current_index + per_page

    results += result["rows"] || []

    if start_index > total_result
      headers = header_name(result)
      return {headers: headers, rows: results}
    else
      options['start-index'] = start_index
      return fetch_page(results, options)
    end
  end

  def header_name(result)
    headers = []
    types = []
    result['columnHeaders'].each do |col|
      headers << col['name']
    end
    return headers
  end

  def request_page_view_uri(options)
    URI.parse("https://www.googleapis.com/analytics/v3/data/ga?"\
      "ids=ga%3A#{profile_id}&access_token=#{access_token}&"\
      "#{CGI.unescape(options.to_query)}")
  end

  def fetch_access_token
    client = Google::APIClient.new(application_name: 'Service account demo', application_version: '0.0.1')

    # generate request body for authorization
    client.authorization = Signet::OAuth2::Client.new(
      token_credential_uri: 'https://accounts.google.com/o/oauth2/token',
      audience: 'https://accounts.google.com/o/oauth2/token',
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      issuer: email,
      signing_key: key
    )

    client.authorization.fetch_access_token!['access_token']
  rescue
    nil
  end
end
