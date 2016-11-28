# encoding: UTF-8
require 'csv'
require 'zip'

class ReportService
  include ApplicationHelper
  FILE_PATH_LOCAL = 'tmp/reports'.freeze

  def initialize(creative_ids, file_name, email, export_obj_id, export_obj_type, start_date, end_date)
    @creative_ids = creative_ids
    @file_name = file_name
    path_tmp = File.join(Rails.root, FILE_PATH_LOCAL)
    `mkdir -p #{path_tmp}`
    @file_path = File.join(path_tmp, @file_name)
    @file_zip_path = "#{@file_path}.zip"
    @email = email
    @export_obj = get_export_obj(export_obj_id, export_obj_type)

    @start_date = DateTime.strptime(start_date, '%Y-%m-%d')
    @end_date = DateTime.strptime(end_date, '%Y-%m-%d') + 1.day
  end

  attr_reader :export_obj, :creative_ids, :file_path, :file_zip_path, :file_name, :email,
    :start_date, :end_date

  def get_export_obj(id, class_name)
    return nil if id.blank?

    case class_name
    when 'Campaign'
      Campaign.find(id)
    when 'AdGroup'
      AdGroup.find(id)
    else
      nil
    end
  end

  def fetch
    if is_export_final?
      send_mail(export_obj.archive_rawdata_urls)
    else
      fetch_from_data
    end
  end

  def fetch_from_data
    raw_data
    zipfile
    url = upload_s3
    send_mail(url)
    remove_tmp
  end

  def zipfile
    Zip::File.open(file_zip_path, Zip::File::CREATE) do |zipfile|
      zipfile.add(file_name, file_path)
    end
  end

  def send_mail(url)
    UserMailer.report_export("[V4-RawData]: #{file_name}", url, email).deliver_now
  end

  def remove_tmp
    `rm #{file_path}`
    `rm #{file_zip_path}`
  end

  def raw_data
    types = %w(adrequest click landed)
    events = Event.where(creativeid: {:$in => creative_ids},
                         type: {:$in => types},
                         :timestamp.gte => start_date,
                         :timestamp.lte => end_date)

    header_columns = ['Type',
                      'Platform',
                      'Creative ID',
                      'Timestamp',
                      'Latitude',
                      'Longitude',
                      'Appname',
                      'Device OS',
                      'Device Model',
                      'User IP',
                      'Device ID',
                      'Exchange',
                      'Carrier Name',
                      'Languages',
                      'Point of interest',
                      'Conversion ID',
                      'Device Identifier Type',
                      'Error Type',
                      'Gender',
                      'Target Category',
                      'Device Category',
                      'App or Web']
    CSV.open(file_path, "wb") do |csv|
      csv << header_columns
      events.each do |e|
        csv << [e.type,
                e.platform,
                e.creativeid,
                force_utf8(e.timestamp),
                force_utf8(e.latitude),
                force_utf8(e.longitude),
                force_utf8(e.appname),
                force_utf8(e.deviceos),
                force_utf8(e.modelname),
                force_utf8(get_event_userip(e)),
                force_utf8(e.deviceid),
                force_utf8(e.rawdata.try(:[], :exchange)),
                force_utf8(e.carriername),
                force_utf8(e.language),
                force_utf8(e.nearestlocationname),
                e.conversionid,
                e.deviceidentifiertype,
                e.error_type_str,
                force_utf8(e.gender),
                force_utf8(e.targetcategory),
                force_utf8(e.devicecategory),
                force_utf8(e.apporweb)]
      end
    end
  end

  def upload_s3
    uploader = ReportUploader.new
    uploader.store!(File.open(file_zip_path))
    uploader.url
  end

  def force_utf8(content)
    content = content.to_s.encode('UTF-8', invalid: :replace, undef: :replace, replace: 'invalid data')
    content = content.gsub('\t||\r', '').gsub(/\n(\s*\n)+/, '<br>').gsub(/[\,,\;]/, '.')
    content
  end

  def is_export_final?
    export_obj.present? && export_obj.finalize? &&
    export_obj.start_date <= start_date && export_obj.end_date >= (end_date - 1.day)
  end
end
