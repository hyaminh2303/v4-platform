require 'csv'

namespace :seed do
  task all: [:os, :platform, :country, :category, :font, :time_data, :import_locale]
  task v4: [:add_guest_role]

  task os: :environment do
    OperatingSystem.delete_all

    OperatingSystem.create!([
                   {name: 'Android', code: 'android'},
                   {name: 'iOS', code: 'ios'},
                   {name: 'Windows Phone', code: 'windows_phone'},
                   {name: 'Windows', code: 'windows'},
                   {name: 'Blackberry', code: 'blackberry'},
                   {name: 'RIM', code: 'rim'},
                   {name: 'Unknown', code: 'unknown'},
               ])
  end

  task platform: :environment do
    Platform.delete_all
    Platform.create!([
                   {name: 'PocketMath', code: 'pocket_math'},
                   {name: 'DataLift', code: 'datalift'},
               ])
  end

  task country: :environment do
    Country.delete_all
    file_path = Rails.root.join('lib', 'tasks', 'data_countries.csv')
    CSV.foreach(file_path, headers: true) do |row|
      Country.create(
        name: row['name'],
        code: row['code'],
        latitude: row['latitude'],
        longitude: row['longitude'])
    end
    Country.create(name: '', code: 'UNKNOWN', latitude: '', longitude: '')
  end

  task category: :environment do
    Category.delete_all

    file = File.read(Rails.root.join('lib', 'tasks', 'data_categories.json'))
    h_categories = JSON.parse(file)
    h_categories.each do |c|
      parent_category = Category.create(name: c['name'], category_code: c['category_code'])
      c['childrents'].each do |child_category|
        parent_category.categories.create(name: child_category['name'], category_code: child_category['category_code'])
      end
    end
  end

  task font: :environment do
    Font.destroy_all
    ['Sans Serif', 'Serif', 'Fixed Width', 'Wide', 'Narrow', 'Comic Sans MS', 'Garamond', 'Georgia', 'Tahoma', 'Trebuchet MS', 'Verdana', 'Arial'].each do |font_name|
      Font.create(name: font_name)
    end
  end

  task fix_coord: :environment do
    AdGroup.all.each do |adgroup|
      adgroup.locations.each do |location|
        location.save
      end
    end
  end

  task time_data: :environment do
    TimeFormat.destroy_all
    format_path = Rails.root.join('lib', 'tasks', 'data_time_format.csv')
    CSV.foreach(format_path, headers: true) do |row|
      TimeFormat.create(js_format: row['js_format'], go_format: row['go_format'])
    end
  end

  task import_locale: :environment do
    Locale.destroy_all
    locales_path = Rails.root.join('lib', 'tasks', 'locales.csv')
    CSV.foreach(locales_path, headers: true) do |row|
      Locale.find_or_create_by(code: row['code'], name: row['name'])
    end
  end
end
