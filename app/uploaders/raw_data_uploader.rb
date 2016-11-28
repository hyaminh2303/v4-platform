# encoding: utf-8

class RawDataUploader < CarrierWave::Uploader::Base
  storage :fog

  def store_dir
    'raws'
  end
end
