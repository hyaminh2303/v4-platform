import React, { Component, PropTypes } from 'react'
import { Col, FormGroup, FormControl, ControlLabel, Radio } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import validate from 'validate.js'
import Selector from 'react-select'
import classNames from 'classnames'

const fields = [
  'x',
  'y',
  'font',
  'font_size',
  'color',
  'font_weight',
  'font_style',
  'element_type',
  'text_align',
  'box_width'
]


class FormatForm extends Component {
  constructor(props) {
    super(props)
    this._handleAlignChange = this._handleAlignChange.bind(this)
  }

  _handleAlignChange(e) {
    const { index, onChangeElement } = this.props
    this.props.fields[e.target.name].onChange(e.target.value)
    let element = this.props.values
    element[e.target.name] = e.target.value
    onChangeElement(element, index, false)
  }

  _getTextAlignClass(textAlign) {
    return classNames('radio-text-align', {
      'radio-text-align-active': this.props.fields.text_align.value === textAlign
    })
  }

  render() {
    const { fields: { x, y, font, font_size, color, font_weight,
      font_style, text_align, box_width }, fonts } = this.props
    return (
      <form className="form-horizontal">
        <FormGroup>
          <Col componentClass={ControlLabel} xs={4}>
            X - Y
          </Col>
          <Col xs={8}>
            <Col xs={6}>
              <FormGroup validationState={x.touched && x.error ? 'error' : null} className="custom-form-group">
                <FormControl type="number" {...x}/>
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup validationState={y.touched && y.error ? 'error' : null} className="custom-form-group">
                <FormControl type="number" {...y}/>
              </FormGroup>
            </Col>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} xs={4}
            className={
            ((font.touched && font.error) || font_size.touched && font_size.error)
              ? 'label-error col-xs-4' : 'control-label col-xs-4'}>
            Font - Size
          </Col>
          <Col xs={8}>
            <Col xs={6}>
              <FormGroup validationState={font.touched && font.error ? 'error' : null} className="custom-form-group">
                <Selector
                  valueKey="name"
                  labelKey="name"
                  options={fonts}
                  value={font.value}
                  onChange={font.onChange} />
              </FormGroup>
            </Col>
            <Col xs={3}>
              <FormGroup
                validationState={font_size.touched && font_size.error ? 'error' : null}
                className="custom-form-group">
                <FormControl type="font_size" {...font_size}/>
              </FormGroup>
            </Col>
            <Col xs={3}>
              <FormGroup validationState={color.touched && color.error ? 'error' : null} className="custom-form-group">
                <FormControl type="color" {...color}/>
              </FormGroup>
            </Col>
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} xs={4}
            className={
            ((font_weight.touched && font_weight.error) || font_style.touched && font_style.error)
              ? 'label-error col-xs-4' : 'control-label col-xs-4'}>
            Font Style
          </Col>
          <Col xs={8}>
            <Col xs={6}>
              <FormGroup
                validationState={font_weight.touched && font_weight.error ? 'error' : null}
                className="custom-form-group">
                <Selector
                  valueKey="value"
                  labelKey="label"
                  options={[
                    { label: 'normal', value: 'normal' },
                    { label: 'bold', value: 'bold' }
                  ]}
                  value={font_weight.value}
                  onChange={font_weight.onChange} />
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup
                validationState={font_style.touched && font_style.error ? 'error' : null}
                className="custom-form-group">
                <Selector
                  valueKey="value"
                  labelKey="label"
                  options={[
                    { label: 'normal', value: 'normal' },
                    { label: 'italic', value: 'italic' }
                  ]}
                  value={font_style.value}
                  onChange={font_style.onChange} />
              </FormGroup>
            </Col>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} xs={4}>
            Box - Align
          </Col>
          <Col xs={8}>
            <Col xs={6}>
              <FormGroup className="custom-form-group">
                <FormControl type="number" {...box_width} onChange={(e) => this._handleAlignChange(e)}/>
              </FormGroup>
            </Col>
            <Col xs={6}>
              <Radio inline hidden {...text_align}
                className={this._getTextAlignClass('left')}
                value="left"
                onChange={(e) => this._handleAlignChange(e)}
                checked={text_align.value === 'left'}>
                <i className="fa fa-align-left"/>
              </Radio>
              <Radio inline hidden {...text_align}
                className={this._getTextAlignClass('center')}
                value="center"
                onChange={(e) => this._handleAlignChange(e)}
                checked={text_align.value === 'center'}>
                <i className="fa fa-align-center"/>
              </Radio>
              <Radio inline hidden {...text_align}
                className={this._getTextAlignClass('right')}
                value="right"
                onChange={(e) => this._handleAlignChange(e)}
                checked={text_align.value === 'right'}>
                <i className="fa fa-align-right"/>
              </Radio>
            </Col>
          </Col>
        </FormGroup>
      </form>
    )
  }
}

function validateParams(data) {

  let constraints = {
    x: {
      presence: true,
      numericality: {
        greaterThanOrEqualTo: 0
      }
    },
    y: {
      presence: true,
      numericality: {
        greaterThanOrEqualTo: 0
      }
    },
    font: {
      presence: true
    },
    font_size: {
      presence: true,
      numericality: {
        greaterThanOrEqualTo: 0
      }
    },
    color: {
      presence: true
    },
    font_weight: {
      presence: true
    }
  }
  let error = validate(data, constraints)

  return error || {}
}

FormatForm.propTypes = {
  fields: PropTypes.object.isRequired,
  fonts: PropTypes.array.isRequired,
  index: PropTypes.number,
  onChangeElement: PropTypes.func,
  values: PropTypes.object
}

export default reduxForm({
  form: 'formatForm',
  fields: fields,
  validate: validateParams
})(FormatForm)

