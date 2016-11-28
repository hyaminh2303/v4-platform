import React, { Component, PropTypes } from 'react'
import { FormGroup, FormControl, Table, Button, Row, Col, ControlLabel } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import { forEach, extend, includes } from 'lodash'
import Selector from 'react-select'
import Select from 'react-select'
import Gravatar from 'react-gravatar'
import GravatarOption from './CustomOption';
import GravatarValue from './CustomSingleValue';

const fields = [
  'ad_group_weather_conditionals[].creative_id',
  'ad_group_weather_conditionals[].condition_code',
  'ad_group_weather_conditionals[].is_default'
]

class WeatherConditionTargeting extends Component {
  constructor(props) {
    super(props)
  }

  _updateCheckbox(e) {
    this.props.fields.ad_group_weather_conditionals.forEach((conditional, index) => {
      return conditional.is_default.onChange(false)
    })
  }

  _renderRow(creativeOptions, bannerWeatherOptions, ad_condition, index) {
    const { fields: { ad_group_weather_conditionals } } = this.props
    const { creative_id, condition_code, is_default } = ad_condition
    return (
      <tr key={index}>
        <td>
          <FormGroup validationState={creative_id.touched && creative_id.error ? 'error' : null}>
            <Selector
              clearable={false}
              valueKey="id"
              labelKey="name"
              options={creativeOptions}
              value={creative_id.value}
              onChange={creative_id.onChange} />
          </FormGroup>
        </td>
        <td>
          <FormGroup validationState={condition_code.touched && condition_code.error ? 'error' : null}>
            <Select
              onOptionLabelClick={this.onLabelClick}
              placeholder="Select Condition"
              valueKey="key"
              labelKey="label"
              optionComponent={GravatarOption}
              singleValueComponent={GravatarValue}
              options={bannerWeatherOptions}
              value={condition_code.value}
              onChange={condition_code.onChange} />
          </FormGroup>
        </td>
        <td>
          <FormControl type="checkbox" onClick={(e) => this._updateCheckbox(e)} {...is_default}/>
        </td>
        <td>
          {
            ad_group_weather_conditionals.length > 1 ?
            <Button
              type="button"
              bsSize="xs"
              bsStyle="danger"
              onClick={() => ad_group_weather_conditionals.removeField(index)}>
              <i className="fa fa-minus"/>
            </Button>
            :
            ''
          }
        </td>
      </tr>
    )
  }

  render() {
    const { fields: { ad_group_weather_conditionals },
            adGroup: { creatives, banner_weather_options, condition_type } } = this.props

    const bannerWeatherOptions = banner_weather_options.map((weatherOption) => {
      return { label: weatherOption.code, key: weatherOption.code, icon: weatherOption.icon }
    })

    const creativeOptions = creatives.map((creative) => {
      return { name: creative.name, id: creative._id }
    })

    return (
      <form>
        <Row>
          <Col md={6}>
            <Table className="table table-bordered table-hover locations-table">
              <thead>
                <tr>
                  <th className="text-center">Creative</th>
                  <th className="text-center">Condition</th>
                  <th className="w-30">Default</th>
                  <th className="actions w-30"/>
                </tr>
              </thead>
              <tbody>
                {ad_group_weather_conditionals.map((ad_condition, index) => this._renderRow(creativeOptions, bannerWeatherOptions, ad_condition, index))}
                <tr>
                  <td colSpan={4}>
                    <Button
                      type="button"
                      bsSize="xs"
                      className="pull-right"
                      bsStyle="success"
                      onClick={() => ad_group_weather_conditionals.addField()}>
                      <i className="fa fa-plus"/>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </form>
    )
  }
}

export default reduxForm({
  form: 'WeatherConditionTargetingForm',
  fields: fields
})(WeatherConditionTargeting)
