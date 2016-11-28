#encoding: UTF-8
namespace :v4_platform do
  task nationality: :environment do
    file = Rails.root.join('lib', 'tasks', 'nationality.csv')
    CSV.foreach(file, headers: true) do |row|
      if row['name'].present? && row['accuracy'].present?
        accuracy = row['accuracy'].gsub('%', '').to_f
        nationality = Nationality.find_or_create_by(name: row['name'])
        locale = Locale.find_by(name: row['locale']).try(:code) || row['locale']
        nationality.locales[locale.to_sym] = accuracy
        nationality.save
      end
    end
  end
end
