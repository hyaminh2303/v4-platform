# require 'rails_helper'
# require 'support/api_helpers'
# require 'support/hash_helpers'

# describe 'Dashboard API' do
#   include ApiHelpers
#   include HashHelpers

#   before(:each) do
#     @admin = create(:user)
#     @campaign1 = create(:campaign, created_by: @admin)
#     @ad_group1 = create(:ad_group, campaign: @campaign1)
#     @creative1 = create(:creative, campaign: @campaign1, ad_group: @ad_group1)
#     @yesterday_creative_tracking1 = create(:creative_tracking, campaign: @campaign1,
#                                                                ad_group: @ad_group1,
#                                                                creative: @creative1,
#                                                                date: Date.current - 1.day)
#     @today_creative_tracking1 = create(:creative_tracking, campaign: @campaign1,
#                                                            ad_group: @ad_group1,
#                                                            creative: @creative1,
#                                                            date: Date.current)

#     @campaign2 = create(:campaign, created_by: @admin)
#     @ad_group2 = create(:ad_group, campaign: @campaign2)
#     @creative2 = create(:creative, campaign: @campaign2, ad_group: @ad_group2)
#     @yesterday_creative_tracking2 = create(:creative_tracking, campaign: @campaign2,
#                                                                ad_group: @ad_group2,
#                                                                creative: @creative2,
#                                                                date: Date.current - 1.day)
#     @today_creative_tracking2 = create(:creative_tracking, campaign: @campaign2,
#                                                            ad_group: @ad_group2,
#                                                            creative: @creative2,
#                                                            date: Date.current)
#   end

#   describe 'GET /api/v1/dashboard' do
#     context 'when login admin' do
#       it 'returns list of summary' do
#         start_date = (Date.current - 1.day).strftime('%Y-%m-%d')
#         end_date = Date.current.strftime('%Y-%m-%d')

#         views_yesterday = @yesterday_creative_tracking1.views + @yesterday_creative_tracking2.views
#         clicks_yesterday = @yesterday_creative_tracking1.clicks + @yesterday_creative_tracking2.clicks
#         landed_yesterday = @yesterday_creative_tracking1.landed + @yesterday_creative_tracking2.landed

#         views_today = @today_creative_tracking1.views + @today_creative_tracking2.views
#         clicks_today = @today_creative_tracking1.clicks + @today_creative_tracking2.clicks
#         landed_today = @today_creative_tracking1.landed + @today_creative_tracking2.landed

#         # yesterday
#         get(*with_auth_token('/api/v1/dashboard', @admin, start_date: start_date,
#                                                           end_date: end_date))
#         chart = [
#           {"views" => views_yesterday,
#            "clicks" => clicks_yesterday,
#            "landed" =>  landed_yesterday,
#            "date" => parse_str_date(Date.current - 1)},
#           {"views" => views_today,
#            "clicks" => clicks_today,
#            "landed" =>  landed_today,
#            "date" => parse_str_date(Date.current)}
#         ]
#         expect(json['chart'] == chart).to eq(true)

#         # all --------------------------------------------------------------
#         if clicks_yesterday.zero?
#           ctr = 0
#           drop_out = 0
#         else
#           ctr = (clicks_yesterday.to_f + clicks_today.to_f) /
#                 (views_yesterday.to_f + views_today.to_f)
#           drop_out = 1 - (landed_yesterday.to_f + landed_today.to_f) /
#                          (clicks_yesterday.to_f + clicks_today.to_f)
#         end
#         all = {
#           "views" => views_yesterday + views_today,
#           "clicks" => clicks_yesterday + clicks_today,
#           "landed" =>  landed_yesterday + landed_today,
#           "ctr" => ctr,
#           "drop_out" => drop_out
#         }
#         expect(json['all'] == all).to eq(true)

#         # countries --------------------------------------------------------------
#         summary_countries = sum_hashes(@yesterday_creative_tracking1.countries,
#                                     @today_creative_tracking1.countries,
#                                     @yesterday_creative_tracking2.countries,
#                                     @today_creative_tracking2.countries)

#         if summary_countries[:vn][:clicks].zero?
#           ctr_vn = 0
#           drop_out_vn = 0
#         else
#           ctr_vn = (summary_countries[:vn][:clicks].to_f /
#                     summary_countries[:vn][:views].to_f)

#           drop_out_vn = 1 - (summary_countries[:vn][:landed].to_f /
#                              summary_countries[:vn][:clicks].to_f)
#         end
#         countries = {
#           "vn" => {
#             "views" => summary_countries[:vn][:views],
#             "clicks" => summary_countries[:vn][:clicks],
#             "landed" => summary_countries[:vn][:landed],
#             "ctr" => ctr_vn,
#             "drop_out" => drop_out_vn
#           }
#         }
#         expect(json['countries'] == countries).to eq(true)

#         # device_os --------------------------------------------------------------
#         device_os_android = sum_hashes(@yesterday_creative_tracking1.device_os[:android],
#                                     @yesterday_creative_tracking2.device_os[:android],
#                                     @today_creative_tracking1.device_os[:android],
#                                     @today_creative_tracking2.device_os[:android])
#         device_os_ios = sum_hashes(@yesterday_creative_tracking1.device_os[:ios],
#                                 @yesterday_creative_tracking2.device_os[:ios],
#                                 @today_creative_tracking1.device_os[:ios],
#                                 @today_creative_tracking2.device_os[:ios])
#         if device_os_android[:clicks].zero?
#           ctr_device_os_android = 0
#           drop_out_device_os_android = 0
#         else
#           ctr_device_os_android = (device_os_android[:clicks].to_f /
#                                   device_os_android[:views].to_f)

#           drop_out_device_os_android = 1 - (device_os_android[:landed].to_f /
#                                             device_os_android[:clicks].to_f)
#         end
#         if device_os_ios[:clicks].zero?
#           ctr_device_os_ios = 0
#           drop_out_device_os_ios = 0
#         else
#           ctr_device_os_ios = (device_os_ios[:clicks].to_f /
#                               device_os_ios[:views].to_f)

#           drop_out_device_os_ios = 1 - (device_os_ios[:landed].to_f /
#                                         device_os_ios[:clicks].to_f)
#         end
#         device_os = {
#           "android" => {
#             "views" => device_os_android[:views],
#             "clicks" => device_os_android[:clicks],
#             "landed" =>  device_os_android[:landed],
#             "ctr" => ctr_device_os_android,
#             "drop_out" => drop_out_device_os_android
#           },
#           "ios" => {
#             "views" => device_os_ios[:views],
#             "clicks" => device_os_ios[:clicks],
#             "landed" =>  device_os_ios[:landed],
#             "ctr" => ctr_device_os_ios,
#             "drop_out" => drop_out_device_os_ios
#           }
#         }
#         expect(json['device_os'] == device_os).to eq(true)

#         # platforms --------------------------------------------------------------
#         platforms_bidstalk = sum_hashes(@yesterday_creative_tracking1.platforms[:bidstalk],
#                                      @yesterday_creative_tracking2.platforms[:bidstalk],
#                                      @today_creative_tracking1.platforms[:bidstalk],
#                                      @today_creative_tracking2.platforms[:bidstalk])
#         platforms_pocketmath = sum_hashes(@yesterday_creative_tracking1.platforms[:pocketmath],
#                                        @yesterday_creative_tracking2.platforms[:pocketmath],
#                                        @today_creative_tracking1.platforms[:pocketmath],
#                                        @today_creative_tracking2.platforms[:pocketmath])
#         if platforms_bidstalk[:clicks].zero?
#           ctr_platforms_bidstalk = 0
#           drop_out_platforms_bidstalk = 0
#         else
#           ctr_platforms_bidstalk = (platforms_bidstalk[:clicks].to_f /
#                                     platforms_bidstalk[:views].to_f)

#           drop_out_platforms_bidstalk = 1 - (platforms_bidstalk[:landed].to_f /
#                                              platforms_bidstalk[:clicks].to_f)
#         end
#         if platforms_pocketmath[:clicks].zero?
#           ctr_platforms_pocketmath = 0
#           drop_out_platforms_pocketmath = 0
#         else
#           ctr_platforms_pocketmath = (platforms_pocketmath[:clicks].to_f /
#                                       platforms_pocketmath[:views].to_f)

#           drop_out_platforms_pocketmath = 1 - (platforms_pocketmath[:landed].to_f /
#                                                platforms_pocketmath[:clicks].to_f)
#         end
#         platforms = {
#           "bidstalk" => {
#             "views" => platforms_bidstalk[:views],
#             "clicks" => platforms_bidstalk[:clicks],
#             "landed" =>  platforms_bidstalk[:landed],
#             "ctr" => ctr_platforms_bidstalk,
#             "drop_out" => drop_out_platforms_bidstalk
#           },
#           "pocketmath" => {
#             "views" => platforms_pocketmath[:views],
#             "clicks" => platforms_pocketmath[:clicks],
#             "landed" =>  platforms_pocketmath[:landed],
#             "ctr" => ctr_platforms_pocketmath,
#             "drop_out" => drop_out_platforms_pocketmath
#           }
#         }
#         expect(json['platforms'] == platforms).to eq(true)
#       end
#     end
#   end
# end

# def parse_str_date(date)
#   date.strftime('%Y-%m-%dT%H:%M:%S.000Z')
# end
