# encoding: utf-8

class CreativeUploader < CarrierWave::Uploader::Base
  attr_accessor :avatar, :avatar_cache
  # Include RMagick or MiniMagick support:
  include CarrierWave::RMagick
  # include CarrierWave::MiniMagick

  attr_reader :width, :height
  before :cache, :capture_size

  storage :fog

  def store_dir
    'banners'
  end

  def cache_dir
    '/tmp/v4-dashboard/banners'
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # Create different versions of your uploaded files:
  # version :thumb do
  #   process :resize_to_fit => [50, 50]
  # end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(jpeg gif png jpg)
  end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  def filename
    "#{@model.id}.#{file.extension}" if original_filename
  end

  def capture_size(file)
    img = ::Magick::Image.read(file.path).first
    @width = img.columns
    @height = img.rows
  end
end
