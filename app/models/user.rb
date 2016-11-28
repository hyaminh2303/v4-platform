require 'utils'

class User
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  include Pagination
  include ActiveModel::SecurePassword

  has_secure_password

  field :name, type: String
  field :email, type: String
  field :password_digest, type: String
  field :api_secret, type: String
  field :reset_token, type: String
  field :reset_password_sent_at, type: Time

  field :status, type: String, default: 'enabled'

  has_many :campaigns, foreign_key: 'created_by_id'
  has_one :access_token
  belongs_to :role

  delegate :name, to: :role, prefix: true, allow_nil: true
  delegate :key, to: :role, prefix: true, allow_nil: true

  validates :email, email: true, uniqueness: true
  validates :name, :role, :email, presence: true

  validates :status, inclusion: {in: %w(enabled disabled)}, allow_nil: true

  before_create :assign_api_secret

  def self.search(params)
    any_of({name: /.*#{params[:query]}.*/},
            email: /.*#{params[:query]}.*/)
  end

  def can_delete?
    campaigns.blank?
  end

  def admin?
    role == Role.admin
  end

  def super_admin?
    role == Role.super_admin
  end

  def reset_token_expired?
    reset_password_sent_at <= 1.day.ago
  end

  def reset_user_password
    new_password = Utils.generate_password
    update(password: new_password, password_confirmation: new_password)
  end

  private

  def assign_api_secret
    self.api_secret = Utils.generate_api_secret
  end
end
