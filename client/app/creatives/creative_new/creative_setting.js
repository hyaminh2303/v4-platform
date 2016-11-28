import React, { Component, PropTypes } from 'react'
import { Row, Col, HelpBlock, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import validate from 'validate.js'
import Selector from 'react-select'
import { last, split } from 'lodash'

import './style.scss'

const fields = [
  'id',
  'name',
  'landing_url',
  'creative_type',
  'ad_group_id',
  'attachment',
  'banner_url'
]

class CreativeSetting extends Component {
  constructor(props) {
    super(props)
    const banner_url = props.fields.banner_url.initialValue
    this.state = { imagePreviewUrl: banner_url ? `${banner_url}?k=${Math.random()}` : null }
    this._handleOnUploadChange = this._handleOnUploadChange.bind(this)
  }

  _handleOnUploadChange(e) {
    e.preventDefault()

    let file = e.target.files[0]

    if (imageValid(file.name)) {
      let reader = new FileReader()
      reader.onloadend = () => {
        this.setState({ imagePreviewUrl: reader.result })
      }
      reader.readAsDataURL(file)
      this.props.fields.attachment.onChange(file)
    }
  }

  _handleSave() {
    this.setState({ activeKey: '2' })
    this.props.fetchCreatives(this.props.adGroupId)
    this.props.closeAlert()
  }

  render() {
    const { fields: { id, name, landing_url, creative_type, attachment }, handleSubmit } = this.props
    let imagePreview = null
    if (this.state.imagePreviewUrl) {
      imagePreview = (
        <div className="col-xs-6 creative-preview">
            <img src={this.state.imagePreviewUrl}/>
        </div>
      )
    }

    return (
      <div>
        <form className="form-horizontal" onSubmit={handleSubmit((creative) => this.props.onSave(creative, '1'))}>
          <Row>
            <div className = "col-xs-6">
              <FormGroup
                controlId="formControlsText"
                validationState={name.touched && name.error ? 'error' : null}>
                <Col componentClass={ControlLabel} sm={4}>
                  Name
                </Col>
                <Col sm={8}>
                  <FormControl type="text" {...name}/>
                  <FormControl.Feedback />
                  <HelpBlock>{name.touched && name.error ? name.error[0] : null}</HelpBlock>
                </Col>
              </FormGroup>

              <FormGroup
                controlId="formControlsText"
                validationState={creative_type.touched && creative_type.error ? 'error' : null}>
                <Col componentClass={ControlLabel} sm={4}>
                  Type
                </Col>
                <Col sm={8}>
                  <Selector
                    name="form-field-name"
                    valueKey="value"
                    labelKey="label"
                    options={[
                      { value: 'dynamic', label: 'Dynamic' },
                      { value: 'static', label: 'Static' }
                    ]}
                    value={creative_type.value}
                    disabled={!!id.value}
                    onChange={creative_type.onChange} />
                  <HelpBlock>{creative_type.touched && creative_type.error ? creative_type.error[0] : null}</HelpBlock>
                </Col>
              </FormGroup>
              <FormGroup
                controlId="formControlsText"
                validationState={attachment.touched && attachment.error ? 'error' : null}>
                <Col componentClass={ControlLabel} sm={4}>
                  Creative
                </Col>
                <Col sm={8}>
                  <input type="file" value={null}
                    onChange={this._handleOnUploadChange} />
                  <HelpBlock>{attachment.touched && attachment.error ? attachment.error[0] : null}</HelpBlock>
                </Col>
              </FormGroup>

            </div>
            {imagePreview}
          </Row>
          <FormGroup
            controlId="formControlsText"
            validationState={landing_url.touched && landing_url.error ? 'error' : null}>
            <Col componentClass={ControlLabel} sm={2}>
              Landing URL
            </Col>
            <Col sm={10}>
              <FormControl type="text" {...landing_url}/>
              <FormControl.Feedback />
              <HelpBlock>{landing_url.touched && landing_url.error ? landing_url.error[0] : null}</HelpBlock>
            </Col>
          </FormGroup>
          <div className="pull-right">
            <Button bsStyle="danger" bsSize="small"
              onClick={handleSubmit((creative) =>
                this.props.onSave(creative, '1'))}>
              <i className="ace-icon fa fa-check bigger-110"/>
              Continue
            </Button>
          </div>
        </form>
      </div>
    )
  }
}
function imageValid(fileName) {
  let ext = last(split(fileName, '.'))
  if (ext === 'png' || ext === 'jpg' ||
      ext === 'jpeg' || ext === 'gif')
    return true

  return false
}
function validateParams(creative) {
  const constraints = {
    name: {
      presence: true
    },
    landing_url: {
      presence: true,
      format: {
        pattern: 'http[s]?:\/\/(www\.)?[0-9A-Za-z]+(\.)*',
        flags: 'g',
        message: 'is invalid'
      }
    },
    creative_type: {
      presence: true
    }
  }

  let error = validate(creative, constraints) || {}

  // new creative without attachment
  if (!creative.id && (!creative.attachment || creative.attachment.length === 0)) {
    error.attachment = []
    error.attachment.push('Please select a image file.')
  }
  // attachment existed
  else if (creative.attachment && creative.attachment.length > 0) {
    let fileName = creative.attachment[0].name
    if (!imageValid(fileName)) {
      error.attachment = []
      error.attachment.push('Invalid image extension.')
    }
  }

  return error || {}
}

CreativeSetting.propTypes = {
  adGroupId: PropTypes.string,
  closeAlert: PropTypes.func,
  creative: PropTypes.object,
  fetchCreatives: PropTypes.func,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func,
  imagePreviewUrl: PropTypes.string,
  onChangeCreativeType: PropTypes.func,
  onSave: PropTypes.func.isRequired
}

export default reduxForm({
  form: 'newCreative',
  fields: fields,
  validate: validateParams
})(CreativeSetting)