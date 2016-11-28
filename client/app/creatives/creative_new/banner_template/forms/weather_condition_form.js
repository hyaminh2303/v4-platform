import React, { Component, PropTypes } from 'react'
import { Col, FormGroup, FormControl, Button, Table } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import classNames from 'classnames'
import validate from 'validate.js'
import { forEach, extend } from 'lodash'
import Selector from 'react-select'

const fields = [
  'weather_conditions[].operator',
  'weather_conditions[].value1',
  'weather_conditions[].value2',
  'weather_conditions[].message'
]

class WeatherConditionForm extends Component {
  _renderRow(weatherCondition, index) {
    const operators = [
      { key: 'Greater than', value: 'greater_than' },
      { key: 'Greater than or equal', value: 'greater_than_or_equal' },
      { key: 'equal', value: 'equal' },
      { key: 'Less than', value: 'less_than' },
      { key: 'Less than or equal', value: 'less_than_or_equal' },
      { key: 'Between', value: 'between' }
    ]
    const { operator, value1, value2, message } = weatherCondition
    const { fields: { weather_conditions } } = this.props
    const degreeInput = classNames('degree-input1', { 'degree-input': operator.value === 'between' })
    return (
      <tr key={index}>
        <td>
          <FormGroup
            className="selector-form-group"
            validationState={operator.touched && operator.error ? 'error' : null}>
            <Selector
              valueKey="value"
              labelKey="key"
              options={operators}
              value={operator.value}
              onChange={operator.onChange} />
          </FormGroup>
        </td>
        <td>
            <FormGroup
              className="inline-form-group"
              validationState={value1.touched && value1.error ? 'error' : null}>
              <input type="number" className={degreeInput} {...value1}/>
            </FormGroup>
            {operator.value === 'between' ?
              <FormGroup
                className="inline-form-group"
                validationState={value2.touched && value2.error ? 'error' : null}>
                <input type="number" className={degreeInput} {...value2}/>
              </FormGroup>
              :
              ''
            }
        </td>
        <td>
          <Col sm={12}>
            <FormGroup validationState={message.touched && message.error ? 'error' : null}>
              <FormControl
                validationState={message.touched && message.error ? 'error' : null}
                type="text"
                placeholder="It's {temperature} outside, too hot to miss a starbucks Frappe"
                {...message}/>
            </FormGroup>
          </Col>
        </td>
        <td>
          {
            weather_conditions.length > 1 ?
            <Button
              type="button"
              bsSize="xs"
              bsStyle="danger"
              onClick={() => weather_conditions.removeField(index)}>
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
    console.log(this.props)
    const { fields: { weather_conditions } } = this.props
    return (
      <form>
        <Table className="table-bordered table-striped">
          <thead>
            <tr>
              <th width="150px">Operator</th>
              <th width="100px">Temperature</th>
              <th>Message</th>
              <th width="45px"></th>
            </tr>
          </thead>
          <tbody>
            {weather_conditions.map((weatherCondition, index) => this._renderRow(weatherCondition, index))}
            <tr>
              <td colSpan={4}>
                <Button
                  type="button"
                  bsSize="xs"
                  className="pull-right"
                  bsStyle="success"
                  onClick={() => weather_conditions.addField()}>
                  <i className="fa fa-plus"/>
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </form>
    )
  }
}

function validateParams(data) {
  let error = { weather_conditions: [] }
  let constraints = {
    operator: {
      presence: true
    },
    value1: {
      presence: true
    },
    message: {
      presence: true
    }
  }
  forEach(data.weather_conditions, (e) => {
    if (e.operator === 'between') {
      constraints = extend({}, constraints, { value2: { presence: true } } )
    }
    error.weather_conditions.push(validate(e, constraints))
  })
  return error
}

WeatherConditionForm.propTypes = {
  fields: PropTypes.object.isRequired
}

export default reduxForm({
  form: 'weatherConditionForm',
  fields: fields,
  validate: validateParams
})(WeatherConditionForm)
