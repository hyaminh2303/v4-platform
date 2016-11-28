# export final rawdata from campaign
class ArchiveRawdataService
  def initialize(campaign_ids = [])
    @campaigns = if campaign_ids.present?
                   Campaign.where(:id.in => [campaign_ids].flatten)
                 else
                   Campaign.where(:end_date.lte => Date.current - (ENV['ARCHIVE_DAYS'].to_i + 1).days)
                 end

    @run_time = Time.current
  end

  attr_reader :campaigns, :run_time

  def fetch
    campaigns.each do |campaign|
      if campaign.archived == false
        c_archived_folder_name = archived_folder_name(campaign)
        start_date = campaign.start_date.strftime('%Y-%m-%d')
        end_date = campaign.end_date.strftime('%Y-%m-%d')

        url = export_raw(campaign, 'Campaign', start_date, end_date, file_name_campaign(campaign), c_archived_folder_name)
        update_archive(campaign, url)

        campaign.ad_groups.each do |adgroup|
          url = export_raw(adgroup, 'AdGroup', start_date, end_date, file_name_adgroup(adgroup), c_archived_folder_name)
          update_archive(adgroup, url)
        end

        dump_old_data(campaign, file_name_campaign(campaign), c_archived_folder_name)
        # destroy_old_event(campaign)
      end
    end

    'done'
  end

  private

  def export_raw(obj, class_name, start_date, end_date, file_name, c_archived_folder_name)
    report_obj = ReportService.new(obj.creative_ids, file_name, 'no-send-email', obj.id, class_name, start_date, end_date)
    report_obj.raw_data
    report_obj.zipfile
    url = upload_s3(report_obj.file_zip_path, c_archived_folder_name)
    report_obj.remove_tmp
    url
  end

  def archived_folder_name(obj)
    "#{parse_folder_name_str(obj.name)}__#{obj.id.to_s}"
  end

  def file_name_campaign(campaign)
    date = run_time.strftime('%Y_%m_%d_%H_%M_%S')
    "#{parse_folder_name_str(campaign.name)}_#{date}.csv"
  end
  def file_name_adgroup(adgroup)
    campaign_name = parse_folder_name_str(adgroup.campaign.name)
    file_name = parse_folder_name_str(adgroup.name)
    date = run_time.strftime('%Y_%m_%d_%H_%M_%S')
    "#{campaign_name}_AD_#{file_name}_#{date}.csv"
  end
  def parse_folder_name_str(name)
    name.downcase.tr(' /"\'', '_')
  end


  def upload_s3(file_zip_path, extend_path = '')
    uploader = ArchiveRawdataUploader.new
    uploader.extend_path = extend_path
    uploader.store!(File.open(file_zip_path))
    uploader.url
  end

  def destroy_old_event(campaign)
    Event.where(:creativeid.in => campaign.creative_ids).delete_all
  end

  def update_archive(obj, url)
    url = url.present? ? (obj.archive_rawdata_urls << url).flatten : []
    obj.update(
      archived: true,
      archive_rawdata_urls: url
    )
  end

  def dump_old_data(campaign, file_name, c_archived_folder_name)
    RawDataService.new(campaign, run_time, file_name, c_archived_folder_name).log
  end
end
