class RawDataService
  attr_reader :file_path_tmp, :campaign, :run_time, :file_name, :extend_path

  def initialize(campaign, run_time, file_name, extend_path = '')
    @campaign = campaign
    @run_time = run_time
    @extend_path = extend_path
    @file_name = file_name
    @run_time = run_time

    path_tmp = File.join(Rails.root, 'tmp/raws')
    @file_path_tmp = File.join(path_tmp, file_name)
    `mkdir -p #{path_tmp}`
  end

  def log
    dump_data
    upload_s3
    remove_tmp
  end

  private

  def dump_data
    `mongodump -h #{ENV['MONGO_HOST1']} -d #{ENV['MONGO_DATABASE_NAME']} -c events -q '{creativeid: { $in: #{campaign.creative_ids.map(&:to_s)} }}' --archive=#{file_path_tmp} --gzip`
  end

  def upload_s3
    uploader = ArchiveRawdataUploader.new
    uploader.extend_path = extend_path
    uploader.store!(File.open(file_path_tmp))
  end

  def remove_tmp
    `rm #{file_path_tmp}`
  end

  def file_name
    filename = campaign.name.downcase.tr(' ', '_').tr('/', '_').tr("'", '').tr('"', '')
    date = run_time.strftime('%Y_%m_%d_%H_%M_%S')
    "#{filename}_#{date}.gz"
  end
end
