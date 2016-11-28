class FixEventJob < ActiveJob::Base
  def perform(from_date_str, to_date_str)
    from_date = DateTime.strptime(from_date_str, '%Y-%m-%d')
    to_date = DateTime.strptime(to_date_str, '%Y-%m-%d')

    FixEventService.fix_invalid_click(from_date, to_date)
  end
end
