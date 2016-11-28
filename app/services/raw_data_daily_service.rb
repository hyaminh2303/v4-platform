class RawDataDailyService
  attr_reader :from, :to, :file_path

  def log(params = {})
    init(params)
    dump_data
    upload_s3
    remove_tmp
  end

  private

  def dump_data
    from_str = from.strftime("%Y-%m-%dT%H:%M:%S.%LZ")
    to_str = to.strftime("%Y-%m-%dT%H:%M:%S.%LZ")

    `mongodump -h #{ENV['MONGO_HOST1']} -d #{ENV['MONGO_DATABASE_NAME']} -c events -q '{timestamp: { $gte: ISODate("#{from_str}"), $lte: ISODate("#{to_str}") }}' --archive=#{file_path} --gzip`
  end

  def upload_s3
    uploader = RawDataUploader.new
    uploader.store!(File.open(file_path))
  end

  def remove_tmp
    `rm #{file_path}`
  end

  def init(params)
    @from = params[:from] || (Time.current - 1.day).beginning_of_day
    @to = params[:to] || @from.end_of_day
    file_name = "#{from.strftime('%Y-%m-%d')}.gz"
    path_tmp = File.join(Rails.root, 'tmp/raws')
    @file_path = File.join(path_tmp, file_name)
    `mkdir -p #{path_tmp}`
  end
end
