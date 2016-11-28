module Pagination
  extend ActiveSupport::Concern

  included do
    class << self
      def page(p_page = 1, p_limit = ENV['MAX_RECORD'].to_i)
        @k_limit = f_limit(p_limit)
        skip(f_offset(p_page))
          .limit(@k_limit)
      end

      def total
        count
      end

      def per_page
        @k_limit
      end

      private

      def f_offset(p_page)
        p_page = [p_page.to_i, 1].max
        (p_page - 1) * @k_limit
      end

      def f_limit(p_limit)
        max = ENV['MAX_RECORD'].to_i
        [p_limit.present? ? p_limit.to_i : max, max].min
      end
    end
  end
end
