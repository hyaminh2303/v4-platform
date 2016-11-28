class Nationality
  include Mongoid::Document

  field :name, type: String
  field :locales, type: Hash, default: {}


  def self.search(params)
    params[:query] ||= ''
    params[:page] ||= 1
    params[:per_page] ||= ENV['MAX_RECORD'].to_i
    params[:sort_by] = (params[:sort_by].blank? ? 'name' : params[:sort_by])
    params[:sort_dir] = (params[:sort_dir] == 'desc' ? 'desc' : 'asc')
    skip_record = (params[:page].to_i * params[:per_page].to_i) - params[:per_page].to_i
    result = Nationality.where(name: /#{params[:query]}/i)
             .order(params[:sort_by] => params[:sort_dir])
             .limit(params[:per_page])
             .skip(skip_record)

    { data: result, total: result.count }
  end

  def nationality_fields=(params)
    new_locales = {}
    self.name = params[:name]
    params[:locales].each do |locale|
      new_locales[locale['code']] = locale['accuracy']
    end
    self.locales = new_locales
  end
end
