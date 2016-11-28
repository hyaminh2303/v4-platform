module Api
  module V1
    class AdGroupsController < Api::V1::ApiController
      before_action :load_ad_group, only: [:edit, :update, :destroy, :export_raw_data]

      def index
        load_ad_groups
      end

      def new
        @campaign = load_campaign
        @group = AdGroup.new(campaign: @campaign)
        @countries = Country.all
        @adtag_script = {
          pocket_math: TrackingService.new(adgroup: @group).generate_ad_tag_adgroup(:pocket_math),
          datalift: TrackingService.new(adgroup: @group).generate_ad_tag_adgroup(:datalift)
        }
      end

      def edit
        @campaign = @group.campaign
        @countries = Country.all
        @exist_data_location_ids = CreativeTracking.where(ad_group: @group).pluck(:locations).map(&:keys).flatten
        @adtag_script = {
          pocket_math: TrackingService.new(adgroup: @group).generate_ad_tag_adgroup(:pocket_math),
          datalift: TrackingService.new(adgroup: @group).generate_ad_tag_adgroup(:datalift)
        }
      end

      def show
        @group = AdGroup.find(params[:id])
      end

      def create
        @campaign = load_campaign
        @group = @campaign.ad_groups.new(new_ad_group_params)
        @group.add_locations(params[:locations])
        if @group.save
          CoordinateJob.perform_later(@group.id.to_s)
          render :show
        else
          render_fail @group.errors.full_messages.join('<br/>')
        end
      end

      def update
        @group.add_locations(params[:locations])
        @group.add_ad_group_weather_conditionals(params[:ad_group_weather_conditionals])
        @group.add_ad_group_distance_conditionals(params[:ad_group_distance_conditionals])
        if @group.update(edit_ad_group_params)
          CoordinateJob.perform_later(@group.id.to_s)
          render :show
        else
          render_fail @group.errors.full_messages
        end
      end

      def destroy
        if @group.tracking_data?
          render_fail
        else
          @group.destroy
          render_ok
        end
      end

      def export_raw_data
        if detect_valid_date
          ReportJob.perform_later(@group.creatives.map { |c| c.id.to_s },
            @group.report_name(params[:start_date], params[:end_date]),
            current_user.email,
            @group.id.to_s,
            'AdGroup',
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

      def load_campaign
        Campaign.find(params[:campaign_id])
      end

      def load_ad_group
        @group = AdGroup.find(params[:id])
      end

      def load_ad_groups
        @campaign = load_campaign

        @groups = @campaign.ad_groups.search(params)
        @ad_group_trackings = AdGroupTrackingService.new(@campaign).fetch_data.to_a
      end

      def new_ad_group_params
        params.permit(:name, :start_date, :end_date, :campaign_id, :country_id,
          :target_destination, :language_setting)
      end

      def edit_ad_group_params
        params.permit(:name, :start_date, :end_date, :id, :country_id, :target_destination, :language_setting, :condition_type)
      end
    end
  end
end
