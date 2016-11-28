class CreativeSummary
  include ApplicationHelper

  def initialize(creatives)
    @creatives = creatives
  end

  attr_reader :creatives

  def fetch
    summary = {views: 0, clicks: 0, landed: 0}
    results = []

    creatives.each do |creative|
      summary[:views] += creative.views
      summary[:clicks] += creative.clicks
      summary[:landed] += creative.landed
      creative.ctr = if creative.views == 0
                       0
                     else
                       creative.clicks.to_f / creative.views.to_f
                     end

      creative.drop_out = if creative.clicks == 0 && creative.landed == 0
                            1
                          else
                            1 - (creative.landed.to_f / creative.clicks.to_f)
                           end

      results << creative
    end

    summary[:ctr] = devide_include_zero(summary[:clicks], summary[:views])
    summary[:drop_out] = if summary[:landed].zero? && summary[:clicks].zero?
                           0
                         else
                           1 - devide_include_zero(summary[:landed], summary[:clicks])
                         end

    {creatives: results, summary: summary}
  end
end
