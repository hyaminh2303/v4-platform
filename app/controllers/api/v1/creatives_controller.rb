module Api
  module V1
    class CreativesController < Api::V1::ApiController
      before_action :load_creative, except: [:create, :index]

      def preview
        proxy_url = "#{ENV['BANNER_GENERATOR_URL']}/preview"\
                    "?creative_id=#{@creative.id}"\
                    "&#{URI.parse(request.url).query}"

        result = Net::HTTP.get_response(URI.parse(proxy_url))
        send_data result.body, type: result.content_type, disposition: 'inline'
      end

      def show
      end

      def index
        @ad_group = AdGroup.find(params[:ad_group_id])
        @creative_summary = CreativeSummary.new(@ad_group.creatives).fetch
      end

      def create
        @creative = Creative.new(create_params)
        if @creative.save
          render :show
        else
          render_fail @creative.errors.full_messages
        end
      end

      def update
        if @creative.update(edit_params)
          @creative.update_temperature if update_temperature?
          @creative.reload
          render :show
        else
          render_fail @creative.errors.full_messages
        end
      end

      def destroy
        if @creative.tracking_data?
          render_fail('Cannot delete this creative!')
        else
          @creative.destroy
          render_ok
        end
      end

      def enqueue
        uri = URI("#{ENV['BANNER_GENERATOR_URL']}/jobs")
        Net::HTTP.post_form(uri, creative_id: @creative.id.to_s)
        render_ok
      end

      def export_raw_data
        if detect_valid_date
          ReportJob.perform_later([@creative.id.to_s],
            @creative.report_name(params[:start_date], params[:end_date]),
            current_user.email,
            nil,
            nil,
            params[:start_date], params[:end_date])
          render text: "Successfully! Report Email will send to your email soon"
        else
          render text: "Date is invalid. Please try again!"
        end
      end

      private

      def detect_valid_date
        DateTime.strptime(params[:start_date], '%Y-%m-%d').is_a?(DateTime) &&
          DateTime.strptime(params[:end_date], '%Y-%m-%d').is_a?(DateTime)
      rescue
        false
      end

      def update_temperature?
        params["elements"].present?
      end

      def load_creative
        @creative = Creative.find(params[:id])
      end

      def create_params
        params.permit(:name, :landing_url, :ad_group_id, :creative_type, :banner)
      end

      def edit_params
        permited_params = params.permit(:name, :landing_url, :banner,
          :platform, :tracking_type, :client_impression_url_1,
          :client_impression_url_2, :client_impression_url_3,
            elements: [:text, :x, :y, :font, :font_size, :color, :font_weight, :font_style,
                       :time_format, :time_zone, :element_type, :time_zone, :time_format, :box_width, :text_align,
                       weather_conditions: [:operator, :value1, :value2, :message]])
        permited_params[:elements].map! do |e|
          e[:weather_conditions].map! do |w|
            WeatherCondition.new(w).as_json
          end if e[:weather_conditions]
          Element.new(e).as_json
        end if permited_params[:elements]
        permited_params
      end
    end
  end
end
