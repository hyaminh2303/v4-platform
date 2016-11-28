# encoding: utf-8

class ArchiveRawdataUploader < CarrierWave::Uploader::Base
  storage :fog

  attr_accessor :extend_path

  def store_dir
    "archive_rawdatas/#{extend_path.try(:parameterize)}"
  end
end
