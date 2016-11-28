class Category
  include Mongoid::Document

  field :name, type: String
  field :category_code, type: String

  has_many :categories, class_name: 'Category'
  belongs_to :parent, class_name: 'Category'
end
