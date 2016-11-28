class AdGroupWeatherConditionalService
  def initialize(ad_group, condition_params)
    @condition_params = condition_params
    @ad_group = ad_group
  end

  def add_ad_group_weather_conditionals
    delete_old_conditionals
    return unless @condition_params
    @condition_params.uniq.each do |params|
      params = params.permit(:creative_id, :condition_code, :is_default)
      next if !valid_params?(params)
      @ad_group.ad_group_weather_conditionals << AdGroupWeatherConditional.new(params)
    end
  end

  def delete_old_conditionals
    @ad_group.ad_group_distance_conditionals.destroy_all
    @ad_group.ad_group_weather_conditionals.destroy_all
  end

  private

  def valid_params?(params)
    params[:creative_id].present? && params[:condition_code].present?
  end
end
