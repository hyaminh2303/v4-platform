# encoding: utf-8

class AnalyticReportUploader < CarrierWave::Uploader::Base
  storage :fog

  def store_dir
    'analytics'
  end
end
