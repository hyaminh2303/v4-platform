module Api
  module V1
    class CampaignReportsController < Api::V1::ApiController
      include CustomXlsxHelper
      before_action :load_campaign, only: [:export_device_ids, :export_raw_data, :export_analytic]

      def export_device_ids
        service = CampaignService.new(@campaign)
        file = service.device_ids
        send_data file, filename: service.report_file_name + '_DevicesID.csv'
      end

      def export_raw_data
        if detect_valid_date
          ReportJob.perform_later(@campaign.creatives.map { |c| c.id.to_s },
            @campaign.report_name(params[:start_date], params[:end_date]),
            current_user.email,
            @campaign.id.to_s,
            'Campaign',
            params[:start_date], params[:end_date])
          render text: "Successfully! Report Email will send to your email soon"
        else
          render text: "Date is invalid. Please try again!"
        end
      end

      def export_analytic
        if @campaign.analytic_profile_id.present?
          ReportAnalyticJob.perform_later(@campaign.id.to_s, current_user.email)
          render text: "Successfully! Report Email will send to your email soon"
        else
          render text: "Please setup Campaign Analytic Profile Id"
        end
      end

      private

      def detect_valid_date
        DateTime.strptime(params[:start_date], '%Y-%m-%d').is_a?(DateTime) &&
          DateTime.strptime(params[:end_date], '%Y-%m-%d').is_a?(DateTime)
      rescue
        false
      end

      def load_campaign
        @campaign = Campaign.find(params[:id])
      end
    end
  end
end
