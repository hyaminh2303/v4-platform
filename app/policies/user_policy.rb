class UserPolicy < ApplicationPolicy
  def index?
    user.present? && user.super_admin?
  end

  def new?
    user.present? && user.super_admin?
  end

  def create?
    user.present? && user.super_admin?
  end

  def edit?
    user.present? && user.super_admin?
  end

  def update?
    user.present? && user.super_admin?
  end

  def toggle_status?
    user.present? && user.super_admin?
  end

  def destroy?
    user.present? && user.super_admin?
  end

  def show?
    user.present? && user.super_admin?
  end

  def reset_user_password?
    user.present? && user.super_admin?
  end
end
