import React, { Component, PropTypes } from 'react'
import { Row, Col, HelpBlock, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import DatePicker from 'react-datepicker'
import Selector from 'react-select'
import moment from 'moment'
import validate from 'validate.js'
import { split, last, extend } from 'lodash'

import 'react-datepicker/dist/react-datepicker.css'
import './style.css'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Russian', value: 'ru' },
  { label: 'Italian', value: 'it' },
  { label: 'Spanish', value: 'sp' },
  { label: 'Ukrainian', value: 'ua' },
  { label: 'German', value: 'de' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Romanian', value: 'ro' },
  { label: 'Polish', value: 'pl' },
  { label: 'Finnish', value: 'fi' },
  { label: 'Dutch', value: 'nl' },
  { label: 'French', value: 'fr' },
  { label: 'Bulgarian', value: 'bg' },
  { label: 'Swedish', value: 'se' },
  { label: 'Chinese Traditional', value: 'zh_tw' },
  { label: 'Chinese Simplified', value: 'zh_cn' },
  { label: 'Turkish', value: 'tr' },
  { label: 'Croatian', value: 'hr' },
  { label: 'Catalan', value: 'ca' }
]

class AdGroupForm extends Component {
  constructor(props) {
    super(props)
    this._handleChangeAttachment = this._handleChangeAttachment.bind(this)
    this._handleFormSubmit = this._handleFormSubmit.bind(this)
    this._handleChangeStatusDestination = this._handleChangeStatusDestination.bind(this)
    this.elementData = {}
  }
  _handleChangeStatusDestination(e) {
    this.props.setTargetDestination(e.target.checked)
  }
  _handleChangeAttachment(e) {
    let file = e.target.files[0]
    let ext = last(split(file.name, '.'))
    if (ext === 'csv') {
      this.props.clearLocations()
      this.props.fields.attachment.onChange(file)
      this.props.onSelectFile(file)
    }
  }
  _handleFormSubmit(data) {
    this.elementData = extend({}, this.elementData, data)
  }
  _resetFileInput(e) {
    e.target.value = ''
    this.props.onResetAdGroupLocations()
  }

  _isEditAdgroup() {
    const { adGroup: { id } } = this.props
    if (typeof id === 'undefined' || id === '')
      return false
    return true
  }

  render() {

    const {
      campaign,
      fields: { name, start_date, end_date, attachment, country_id, target_destination, language_setting },
      handleSubmit, countries } = this.props
    if (campaign === undefined)
      return (
        <div></div>
      )

    return (
      <form className="form-horizontal" onSubmit={handleSubmit((data) => this.props.onSave(data))}>
        <Row>
          <Col md={6}>
            <FormGroup
              controlId="formControlsText"
              validationState={name.touched && name.error ? 'error' : null}>
              <Col componentClass={ControlLabel} sm={3}>
                Name
              </Col>
              <Col sm={9}>
                <FormControl type="text" {...name}/>
                <FormControl.Feedback />
                <HelpBlock>{name.touched && name.error ? name.error[0] : null}</HelpBlock>
              </Col>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup
              controlId="formControlsText"
              validationState={country_id.touched && country_id.error ? 'error' : null}>
              <Col componentClass={ControlLabel} sm={3}>
                  Country
              </Col>
              <Col sm={9}>
                <Selector
                  valueKey="id"
                  labelKey="name"
                  options={countries}
                  value={country_id.value}
                  onChange={country_id.onChange} />
                <HelpBlock>
                  {country_id.touched && country_id.error ?
                    country_id.error[0].replace('Country id', 'Country')
                    :
                    null
                  }
                </HelpBlock>
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <FormGroup
              controlId="formControlsText"
              validationState={start_date.touched && start_date.error ? 'error' : null}>
              <Col componentClass={ControlLabel} sm={6}>
                Start Date
              </Col>
              <Col sm={6}>
                <DatePicker
                  placeholderText="Start Date"
                  selected={start_date.value ? moment(start_date.value) : moment()}
                  onChange={start_date.onChange}
                  className="form-control pr0"/>
                <FormControl.Feedback />
                <HelpBlock>{start_date.touched && start_date.error ? start_date.error[0] : null}</HelpBlock>
              </Col>
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup
              controlId="formControlsText"
              validationState={end_date.touched && end_date.error ? 'error' : null}>
              <Col componentClass={ControlLabel} sm={6}>
                End Date
              </Col>
              <Col sm={6}>
                <DatePicker
                  placeholderText="End Date"
                  selected={end_date.value ? moment(end_date.value) : moment()}
                  onChange={end_date.onChange}
                  className="form-control pr0"/>
                <FormControl.Feedback />
                <HelpBlock>{end_date.touched && end_date.error ? end_date.error[0] : null}</HelpBlock>
              </Col>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup
              controlId="formControlsText"
              validationState={language_setting.touched && language_setting.error ? 'error' : null}>
              <Col componentClass={ControlLabel} sm={3}>
                  Language
              </Col>
              <Col sm={9}>
                <Selector
                  valueKey="value"
                  labelKey="label"
                  options={languages}
                  value={language_setting.value}
                  onChange={language_setting.onChange} />
                <HelpBlock>
                  {language_setting.touched && language_setting.error ?
                    language_setting.error[0].replace('Country id', 'Country')
                    :
                    null
                  }
                </HelpBlock>
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup className="checkbox-form">
              <Col sm={3} />
              <Col sm={1}>
                <FormControl type="checkbox"
                  onClick={(e) => this._handleChangeStatusDestination(e)}
                  {...target_destination}/>
              </Col>
              <Col componentClass={ControlLabel} className="checkbox-target" sm={8}>
                Target outside geofence
              </Col>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup
              controlId="formControlsText"
              validationState={attachment.touched && attachment.error ? 'error' : null}>
              <Col componentClass={ControlLabel} sm={3}>
                Locations
              </Col>
              <Col sm={8}>
                <FormControl type="file" className="input-location-file"
                  onChange={this._handleChangeAttachment}
                  onClick={(e) => this._resetFileInput(e)} />
                <HelpBlock>{attachment.touched && attachment.error ? attachment.error[0] : null}</HelpBlock>
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <div className="csv-template-file">
          <a
            href={'https://s3-ap-southeast-1.amazonaws.com/' +
            'v4-banners-dashboard/csv_locations_template_file/template_file.zip'}
            target="_blank">
            <strong>● Click here to download CSV template file</strong>
          </a>
        </div>
      </form>
    )
  }
}

AdGroupForm.propTypes = {
  campaign: PropTypes.object,
  clearLocations: PropTypes.func,
  countries: PropTypes.array,
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
  locations: PropTypes.array,
  onResetAdGroupLocations: PropTypes.func,
  onSave: PropTypes.func,
  onSelectFile: PropTypes.func,
  setTargetDestination: PropTypes.func
}

function validateParams(data, props) {
  let { campaign: { start_date, end_date } } = props
  start_date = moment(start_date)
  end_date = moment(end_date)

  let min_end_date = data.end_date
  if (min_end_date > end_date) {
    min_end_date = end_date
  }

  let constraints = {
    name: {
      presence: true
    },
    start_date: {
      datetime: {
        earliest: moment(start_date),
        latest: moment(min_end_date)
      }
    },
    end_date: {
      datetime: {
        earliest: moment(data.start_date),
        latest: moment(end_date)
      }
    },
    country_id: {
      presence: {
        message: "can't be blank"
      }
    },
    language_setting: {
      presence: {
        message: "can't be blank"
      }
    }
  }
  let error = validate(data, constraints) || {}

  // // new adgroup without attachment
  // if (!data.id && (!data.attachment || data.attachment.length === 0)) {
  //   error.attachment = []
  //   error.attachment.push('Please select a csv file.')
  // }
  // // attachment existed
  // if (data.attachment && data.attachment.length > 0) {
  //   let fileName = data.attachment[0].name
  //   let ext = last(split(fileName, '.'))
  //   if (ext !== 'csv') {
  //     error.attachment = []
  //     error.attachment.push('Invalid file extension.')
  //   }
  // }

  return error || {}
}

AdGroupForm = reduxForm({
  form: 'adGroup',
  fields: ['name', 'start_date', 'end_date', 'id', 'campaign_id',
           'attachment', 'country_id', 'target_destination', 'language_setting'],
  validate: validateParams
})(AdGroupForm)

export default AdGroupForm
