import React, { Component, PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import TextForm from './forms/text_form'
import FormatForm from './forms/format_form'
import WeatherForm from './forms/weather_form.js'
import TimeForm from './forms/time_form'
import TransportationForm from './forms/transportation_form'
import * as ElementConstants from './element_constants'
import { extend } from 'lodash'

class ElementForm extends Component {
  constructor(props) {
    super(props)
    this._handleApplyElement = this._handleApplyElement.bind(this)
    this._handleFormSubmit = this._handleFormSubmit.bind(this)
    this.elementData = {}
  }

  _handleApplyElement() {
    const { index, element: { element_type }, onChangeElement } = this.props
    this.formsValid = true

    switch (element_type) {
      case ElementConstants.TIME:
        this.refs.timeCondition.submit()
        break
      case ElementConstants.WEATHER:
        this.refs.weatherForm.submit()
        break
      case ElementConstants.TRANSPORTATION:
        this.refs.transportationForm.submit()
        break
      default:
        this.refs.textForm.submit()
    }
    this.refs.formatForm.submit()
    if (this.formsValid) {
      onChangeElement(this.elementData, index)
    }
  }

  _handleFormSubmit(data) {
    this.elementData = extend({}, this.elementData, data)
  }

  _renderForms() {
    const { timeFormats, element, fonts, onChangeElement, index } = this.props
    switch (element.element_type) {
      case ElementConstants.WEATHER:
        return (
          <div>
            <WeatherForm
              ref="weatherForm"
              onSubmit={this._handleFormSubmit}
              onSubmitFail={() => this.formsValid = false}
              initialValues={element} />
            <FormatForm
              ref="formatForm"
              onSubmitFail={() => this.formsValid = false}
              onSubmit={this._handleFormSubmit}
              initialValues={element}
              onChangeElement={onChangeElement}
              index={index}
              fonts={fonts}/>
          </div>
        )
      case ElementConstants.TIME:
        return (
          <div>
            <TimeForm
              ref="timeCondition"
              timeFormats={timeFormats}
              onSubmit={this._handleFormSubmit}
              onSubmitFail={() => this.formsValid = false}
              initialValues={element} />
            <FormatForm
              ref="formatForm"
              onSubmitFail={() => this.formsValid = false}
              onSubmit={this._handleFormSubmit}
              initialValues={element}
              onChangeElement={onChangeElement}
              index={index}
              fonts={fonts}/>
          </div>
        )
      case ElementConstants.TRANSPORTATION:
        return (
          <div>
            <TransportationForm
              ref="transportationForm"
              onSubmitFail={() => this.formsValid = false}
              onSubmit={this._handleFormSubmit}
              initialValues={element}/>
            <FormatForm
              ref="formatForm"
              onSubmitFail={() => this.formsValid = false}
              onSubmit={this._handleFormSubmit}
              initialValues={element}
              onChangeElement={onChangeElement}
              index={index}
              fonts={fonts}/>
          </div>
        )
      default:
        return (
          <div>
            <TextForm
              ref="textForm"
              onSubmitFail={() => this.formsValid = false}
              onSubmit={this._handleFormSubmit}
              initialValues={element}/>
            <FormatForm
              ref="formatForm"
              onSubmitFail={() => this.formsValid = false}
              onSubmit={this._handleFormSubmit}
              initialValues={element}
              onChangeElement={onChangeElement}
              index={index}
              fonts={fonts}/>
          </div>
        )
    }
  }

  render() {
    const { elementSize, index, onRemoveElement } = this.props
    return (
      <div className="form-horizontal element-form">
        {this._renderForms()}
        <div className="clearfix">
          <Button
            type="button"
            bsStyle="danger"
            className="pull-right"
            bsSize="small"
            onClick={() => this._handleApplyElement()}>
            <i className="ace-icon fa fa-check bigger-110"/>
            Apply
          </Button>
          {elementSize > 1 ?
            <Button
              type="button"
              className="mr10 pull-right"

              bsSize="small"
              onClick={() => onRemoveElement(index)}>
              <i className="ace-icon fa fa-trash bigger-110"/>
              Delete
            </Button>
            :
            ''
          }
        </div>
      </div>
    )
  }
}

ElementForm.propTypes = {
  element: PropTypes.object,
  elementSize: PropTypes.number,
  fonts: PropTypes.array,
  index: PropTypes.number,
  onChangeElement: PropTypes.func,
  onRemoveElement: PropTypes.func,
  timeFormats: PropTypes.array.isRequired

}

export default ElementForm

