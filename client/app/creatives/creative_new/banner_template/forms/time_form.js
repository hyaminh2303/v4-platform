import React, { Component, PropTypes } from 'react'
import { Col, ControlLabel, FormGroup } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import Selector from 'react-select'
import validate from 'validate.js'

const fields = [
  'text',
  'time_format'
]

class TimeForm extends Component {

  _handelFormatChange(value, object) {
    if (object.length > 0) {
      const { fields: { time_format, text } } = this.props
      time_format.onChange(value)
      text.onChange(object[0].label)
    }
  }

  render() {
    const { fields: { time_format }, timeFormats } = this.props
    let listTimeFormats = []
    timeFormats.map((fm) => {
      listTimeFormats.push({ label: fm.js_format, value: fm.go_format })
    })
    return (
      <form>
        <Col componentClass={ControlLabel} xs={4}>
          Time Format
        </Col>
        <Col xs={8}>
          <FormGroup className="time-form-group"
            validationState={time_format.touched && time_format.error ? 'error' : null}>
            <Selector
              valueKey="value"
              labelKey="label"
              options={listTimeFormats}
              value={time_format.value}
              onChange={(v, o) => this._handelFormatChange(v, o)} />
          </FormGroup>
        </Col>
      </form>
    )
  }
}

function validateParams(data) {
  let constraints = {
    time_format: {
      presence: true
    }
  }
  let error = validate(data, constraints)
  return error || {}
}

TimeForm.propTypes = {
  fields: PropTypes.object,
  timeFormats: PropTypes.array
}

export default reduxForm({
  form: 'timeConditionForm',
  fields: fields,
  validate: validateParams
})(TimeForm)
