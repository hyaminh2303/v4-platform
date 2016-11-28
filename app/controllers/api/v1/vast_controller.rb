module Api
  module V1
    class VastController < Api::V1::ApiController
      def index
        @creative_types = Vast::CREATIVE_TYPES
        @media_types = VastGenerator::MediaFile::MEDIA_TYPES
        @tracking_events = VastGenerator::TrackingEvent::EVENTS
        @resource_type = VastGenerator::AdResource::RESOURCE_TYPES
      end

      def create
        vast_file = params['vast_file']
        if vast_file
          @vast = VastParserService.parse(vast_file)
        else
          new_params = restructure_params(params)
          @vast = Vast.new(new_params)
          need_commit_to_s3 = to_bool(params['need_commit_to_s3'])
          @vast.generate(need_commit_to_s3, params['file_name'])
          if @vast.errors.present?
            render text: 'Errors.', status: :unprocessable_entity
          elsif need_commit_to_s3
            render text: @vast.url
          else
            render xml: @vast.xml
          end
        end
      end

      private

      def restructure_params(params)
        new_params = {
          'ad_system' => params['ad_system'],
          'ad_title' => params['ad_title'],
          'description' => params['description'],
          'creative_type' => params['creative_type'],
          'error_urls_attributes' => {
            '0' => {
              'url' => params['error_url']
            }
          },
          'impressions_attributes' => {
            '0' => {
              'url' => params['impression_url']
            }
          }
        }
        new_params = if overlay_ad?(params['creative_type'])
                       new_params.merge(non_linear_params(params))
                     else
                       new_params.merge(linear_params(params))
                     end
        new_params = new_params.merge(companion_ads(params)) if to_bool(params['has_companion_ad'])
        new_params
      end

      def to_bool(s)
        return true if s == true || s == 'true'
        false
      end

      def overlay_ad?(type)
        type == 'overlay'
      end

      def linear_params(params)
        {
          'linear_ads_attributes' => {
            '0' => {
              'skipoffset' => params['skipoffset'],
              'duration' => params['duration'],
              'click_through' => params['click_through'],
              'click_trackings_attributes' => {
                '0' => {
                  'url' => params['click_tracking_url']
                }
              },
              'media_files_attributes' => media_files_attributes(params["media_files_attributes"][0]),
              'tracking_events_attributes' => {
                '0' => {
                  'event' => params['event'],
                  'url' => params['tracking_event_url']
                }
              }
            }
          }
        }
      end

      def media_files_attributes(data)
        info = {}
        data.each do |key, value|
          element = {
            key => {
              'media_type' => value[0]['media_type'],
              'url' => value[0]['url'],
              'width' => value[0]['width'],
              'height' => value[0]['height'],
              'media' => value[0]['media']
            }
          }
          info = info.merge(element)
        end
        info
      end

      def non_linear_params(params)
        {
          'non_linear_ads_attributes' => {
            '0' => {
              'tracking_events_attributes' => {
                '0' => {
                  'event' => params['event'],
                  'url' => params['tracking_event_url']
                }
              },
              'non_linear_resources_attributes' => {
                '0' => {
                  'width' => params['width'],
                  'height' => params['height'],
                  'click_through' => params['click_through'],
                  'ad_resources_attributes' => {
                    '0' => {
                      'resource_type' => params['resource_type'],
                      'url' => params['resource_url'],
                      'media' => params['media_file']
                    }
                  },
                  'click_trackings_attributes' => {
                    '0' => {
                      'url' => params['click_tracking_url']
                    }
                  }
                }
              }
            }
          }
        }
      end

      def companion_ads(params)
        {
          'companion_ads_attributes' => {
            '0' => {
              'width' => params['com_width'],
              'height' => params['com_height'],
              'click_through' => params['com_click_through'],
              'click_trackings_attributes' => {
                '0' => {
                  'url' => params['com_click_tracking_url']
                }
              },
              'tracking_events_attributes' => {
                '0' => {
                  'event' => params['com_event'],
                  'url' => params['com_tracking_event_url']
                }
              },
              'ad_resources_attributes' => {
                '0' => {
                  'resource_type' => params['com_resource_type'],
                  'url' => params['com_resource_url'],
                  'media' => params['com_resource_file']
                }
              }
            }
          }
        }
      end

      def vast_params
        params.require(:vast).permit(:ad_system, :ad_title, :description, :creative_type, :has_companion_ad,
                                     impressions_attributes: [:url],
                                     error_urls_attributes: [:url],
                                     linear_ads_attributes: [
                                       :skipoffset, :duration, :click_through,
                                       click_trackings_attributes: [:url],
                                       media_files_attributes: [:url, :width, :height, :media, :media_type],
                                       tracking_events_attributes: [:event, :url]
                                     ],
                                     companion_ads_attributes: [
                                       :width, :height, :click_through,
                                       click_trackings_attributes: [:url],
                                       ad_resources_attributes: [:resource_type, :url, :media],
                                       tracking_events_attributes: [:event, :url]
                                     ],
                                     non_linear_ads_attributes: [
                                       non_linear_resources_attributes: [
                                         :width, :height, :click_through,
                                         click_trackings_attributes: [:url],
                                         ad_resources_attributes: [:resource_type, :url, :media]
                                       ],
                                       tracking_events_attributes: [:event, :url]
                                     ])
      end
    end
  end
end
