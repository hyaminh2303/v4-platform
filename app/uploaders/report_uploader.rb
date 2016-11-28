# encoding: utf-8

class ReportUploader < CarrierWave::Uploader::Base
  storage :fog

  def store_dir
    'reports'
  end
end
