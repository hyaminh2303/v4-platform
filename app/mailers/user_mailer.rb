class UserMailer < ApplicationMailer
  def reset_password(user_id)
    @user = User.find(user_id)
    mail(to: @user.email, subject: 'Reset password instructions')
  end

  def report_export(subject, urls, email)
    @urls = [urls].flatten
    mail(to: email, subject: subject)
  end

  def analytic_export(subject, url, email)
    @url = url
    mail(to: email, subject: subject)
  end
end
