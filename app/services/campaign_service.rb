require 'csv'

class CampaignService
  def initialize(campaign)
    @campaign = campaign
  end

  def self.search(params)
    {
      data: fetch_campaigns(params).to_a,
      stats: fetch_stats(params).first
    }
  end

  def device_ids
    devices = CampaignTracking.where(campaign_id: @campaign.id)
                              .pluck(:devices).try(:flatten).try(:uniq)

    file = CSV.generate(headers: true) do |csv|
      devices.each do |line|
        csv << [line]
      end
    end
    file
  end

  def report_file_name
    "#{@campaign.name.downcase.tr(' ', '_')}_#{Time.current.strftime('%d-%b-%y')}"
  end

  class << self
    private

    def fetch_stats(params)
      Campaign.collection.aggregate(stats_pipeline(params))
    end

    def fetch_campaigns(params)
      Campaign.collection.aggregate(campaigns_pipeline(params),
        {
          "allowDiskUse": true,
          "cursor": { "batchSize": 20 }
        })
    end

    def campaigns_pipeline(params)
      pipeline = [
        {'$match' => {name: /.*#{params[:query]}.*/i}},
        {'$project' => {
          _id: 1,
          name: 1,
          campaign_type: 1,
          start_date: 1,
          end_date: 1,
          views: 1,
          clicks: 1,
          landed: 1,
          ctr: {
            '$cond' => [{'$eq' => ['$views', 0]}, 0, {'$divide' => ['$clicks', '$views']}]
          },
          drop_out: {
            '$cond' => [
              {'$and' => [
                {'$eq' => ['$clicks', 0]},
                {'$eq' => ['$landed', 0]}
              ]}, 1,
              {'$cond' => [
                {'$eq' => ['$clicks', 0]}, 1, {'$divide' => ['$landed', '$clicks']}]
              }
            ]
          }
        }}
      ]
      pipeline << {'$sort' => {params[:sort_by] => params[:sort_dir] == 'asc' ? 1 : -1}} if params[:sort_by].present?

      skip_record = (params[:page].to_i * params[:per_page].to_i) - params[:per_page].to_i
      pipeline << {'$skip' => skip_record} << {'$limit' => params[:per_page].to_i}

    end

    def stats_pipeline(params)
      [
        {'$match' => {name: /.*#{params[:query]}.*/i}},
        {'$group' => {
          _id: '',
          views: {'$sum' => '$views'},
          clicks: {'$sum' => '$clicks'},
          landed: {'$sum' => '$landed'},
          _ids: {'$addToSet' => '$_id'}
        }},
        {'$project' => {
          views: 1,
          clicks: 1,
          landed: 1,
          ctr: {
            '$cond' => [{'$eq' => ['$views', 0]}, 0, {'$divide' => ['$clicks', '$views']}]
          },
          drop_out: {
            '$cond' => [{'$eq' => ['$clicks', 0]}, 0, {'$divide' => ['$landed', '$clicks']}]
          },
          count: {'$size' => '$_ids'}
        }}
      ]
    end
  end
end
