class AdGroupDistanceConditionalService
  def initialize(ad_group, condition_params)
    @condition_params = condition_params
    @ad_group = ad_group
  end

  def add_ad_group_distance_conditionals
    delete_old_conditionals
    return unless @condition_params
    @condition_params.uniq.each do |params|
      params = params.permit(:creative_id, :condition, :value1, :value2)
      next if !valid_params?(params)
      @ad_group.ad_group_distance_conditionals << AdGroupDistanceConditional.new(params)
    end
  end

  def delete_old_conditionals
    @ad_group.ad_group_distance_conditionals.destroy_all
    @ad_group.ad_group_weather_conditionals.destroy_all
  end

  private

  def valid_params?(params)
    params[:creative_id].present? &&
    params[:condition].present? &&
    (params[:condition] == 'between' ? params[:value1].present? && params[:value2].present? : params[:value1].present?)
  end


end