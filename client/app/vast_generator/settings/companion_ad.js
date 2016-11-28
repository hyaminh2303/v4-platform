import React, { Component, PropTypes } from 'react'
import { Row, FormGroup, Col, FormControl, HelpBlock, ControlLabel } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import validate from 'validate.js'
import Selector from 'react-select'
import { split, last, extend } from 'lodash'

const fields = [
  'com_resource_type',
  'com_resource_url',
  'com_width',
  'com_height',
  'com_click_through',
  'com_click_tracking_url',
  'com_resource_file',
  'com_event', 'com_tracking_event_url'
]

const resourcesTypes = [
  { label: 'Image (.gif, .jpeg, .png)', value: 'image' },
  { label: 'Javascript', value: 'application/x-javascript' },
  { label: 'Flash', value: 'application/x-shockwave-flash' },
  { label: 'IFrame Resource', value: 'iframe' },
  { label: 'HTML Resource', value: 'html' }
]

class CompanionAd extends Component {
  constructor(props) {
    super(props)
    this.state = { fileName : null }
    this._resetFileInput = this._resetFileInput.bind(this)
    this._handleChangeAttachment = this._handleChangeAttachment.bind(this)
  }

  _handleChangeAttachment(e) {
    const fileTypes = ['js', 'gif', 'jpeg', 'png', 'swf', 'html']
    let file = e.target.files[0]
    let ext = last(split(file.name, '.'))
    if (fileTypes.indexOf(ext) > -1) {
      this.setState({ fileName: file.name })
      this.props.fields.com_resource_file.onChange(file)
    }
  }

  _resetFileInput() {
  }

  render() {
    const { fields: { com_resource_type, com_resource_url, com_width, com_height,
      com_click_through, com_click_tracking_url, com_event, com_resource_file,
      com_tracking_event_url }, vastData } = this.props
    return (
      <div className="basic-info-box">
        <div className="box-header">
          <h4 className="box-title">Companion Ad</h4>
        </div>
        <div className="box-content">
          <form>
            <Row className="basic-row">
              <Col md={6} className="row-col-md">
                <FormGroup className="basic-form-group"
                  controlId="formControlsText"
                  validationState={com_width.touched && com_width.error ? 'error' : null}>
                  <Row componentClass={ControlLabel} className="input-label">
                    * Width
                  </Row>
                  <Row className="input-box">
                    <FormControl
                      type="text"
                      className="input-field"
                      placeholder="800"
                      {...com_width}/>
                    <HelpBlock>{com_width.touched && com_width.error ? com_width.error[0] : null}</HelpBlock>
                  </Row>
                </FormGroup>
              </Col>
              <Col md={6} className="row-col-md">
                <FormGroup className="basic-form-group"
                  controlId="formControlsText"
                  validationState={com_height.touched && com_height.error ? 'error' : null}>
                  <Row componentClass={ControlLabel} className="input-label">
                    * Height
                  </Row>
                  <Row className="input-box">
                    <FormControl
                      type="text"
                      className="input-field"
                      placeholder="600"
                      {...com_height}/>
                    <HelpBlock>{com_height.touched && com_height.error ? com_height.error[0] : null}</HelpBlock>
                  </Row>
                </FormGroup>
              </Col>
            </Row>
            <Row className="basic-row">
              <FormGroup className="basic-form-group"
                controlId="formControlsText"
                validationState={com_resource_type.touched && com_resource_type.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  * Resource type
                </Row>
                <Row className="input-box">
                  <Selector
                    valueKey="value"
                    labelKey="label"
                    value={com_resource_type.value}
                    options={resourcesTypes}
                    onChange={com_resource_type.onChange} />
                    <HelpBlock>
                      {com_resource_type.touched && com_resource_type.error ? com_resource_type.error[0] : null}
                    </HelpBlock>
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
              <Col md={9} className="row-col-md">
                <FormGroup className="basic-form-group"
                  controlId="formControlsText"
                  validationState={com_resource_url.touched && com_resource_url.error ? 'error' : null}>
                  <Row componentClass={ControlLabel} className="input-label">
                    * Resource URL
                  </Row>
                  <Row className="input-box">
                    <FormControl
                      type="text"
                      className="input-field"
                      placeholder="http://im-dev.s3.amazonaws.com/image_server/templates/campaign_16/video.mp4"
                      {...com_resource_url}/>
                    <HelpBlock>
                      {com_resource_url.touched && com_resource_url.error ? com_resource_url.error[0] : null}
                    </HelpBlock>
                  </Row>
                </FormGroup>
              </Col>
              <Col md={3} className="row-col-md">
                <FormGroup className="basic-form-group"
                  controlId="formControlsText"
                  validationState={com_resource_file.touched && com_resource_file.error ? 'error' : null}>
                  <Row componentClass={ControlLabel} className="input-label">
                    * Upload file
                  </Row>
                  <Row className="input-upload-box">
                    <div className="btn btn-upload fileUpload">
                      <span className="label-btn-upload">Browse</span>
                      <input type="file"
                        className="upload"
                        onChange={this._handleChangeAttachment}
                        onClick={(e) => this._resetFileInput(e)}/>
                    </div>
                    <div className="file-name-box">
                      {this.state.fileName}
                    </div>
                    <HelpBlock>
                      {com_resource_file.touched && com_resource_file.error ? com_resource_file.error[0] : null}
                    </HelpBlock>
                  </Row>
                </FormGroup>
              </Col>
            </Row>
            <Row className="basic-row">
              <FormGroup className="basic-form-group"
                controlId="formControlsText"
                validationState={com_click_through.touched && com_click_through.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  * Click Through URL
                </Row>
                <Row className="input-box">
                  <FormControl
                    type="text"
                    className="input-field"
                    placeholder="http://im.l.dev.s3-website-eu-west-1.amazonaws.com/16/index.html"
                    {...com_click_through}/>
                  <HelpBlock>
                    {com_click_through.touched && com_click_through.error ? com_click_through.error[0] : null}
                  </HelpBlock>
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
              <FormGroup className="basic-form-group"
                controlId="formControlsText"
                validationState={com_click_tracking_url.touched && com_click_tracking_url.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  Click Tracking URL
                </Row>
                <Row className="input-box">
                  <FormControl
                    type="text"
                    className="input-field"
                    placeholder={'http://pubads.g.doubleclick.net/gampad/clk?id=9467717' +
                      '7&iu=/3595/NZ_Entertainment_MobGeo'}
                    {...com_click_tracking_url}/>
                  <HelpBlock>
                    {com_click_tracking_url.touched && com_click_tracking_url.error ?
                      com_click_tracking_url.error[0] : null}
                  </HelpBlock>
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
              <FormGroup className="basic-form-group"
                controlId="formControlsText"
                validationState={com_event.touched && com_event.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  Event
                </Row>
                <Row className="input-box">
                  <Selector
                    valueKey="value"
                    labelKey="label"
                    options={vastData.events}
                    value={com_event.value}
                    onChange={com_event.onChange} />
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
              <FormGroup className="basic-form-group"
                controlId="formControlsText"
                validationState={com_tracking_event_url.touched && com_tracking_event_url.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  * Tracking Event URL
                </Row>
                <Row className="input-box">
                  <FormControl
                    type="text"
                    className="input-field"
                    placeholder={'http://pubads.g.doubleclick.net/gampad/clk?id=' +
                      '94677177&iu=/3595/NZ_Entertainment_MobGeo'}
                    {...com_tracking_event_url}/>
                  <HelpBlock>
                    {com_tracking_event_url.touched && com_tracking_event_url.error ?
                      com_tracking_event_url.error[0] : null}
                  </HelpBlock>
                </Row>
              </FormGroup>
            </Row>
          </form>
        </div>
      </div>
    )
  }
}

function validateParams(data) {
  let constraints = {
    com_resource_type: {
      presence: true
    },
    com_width: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: 0
      }
    },
    com_height: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: 0
      }
    },
    com_click_through: {
      presence: true,
      url: true
    },
    com_tracking_event_url: {
      presence: true,
      url: true
    },
    com_click_tracking_url:{
      url: true
    }
  }
  let constraint_resource_file = {
    com_resource_file: {
      presence: true
    }
  }
  let constraint_resource_url = {
    com_resource_url: {
      presence: true,
      url: true
    }
  }
  if (data.com_resource_file === undefined || data.com_resource_file === '') {
    constraints = extend({}, constraints, constraint_resource_url)
  }
  if (data.com_resource_url === undefined || data.com_resource_url === '') {
    constraints = extend({}, constraints, constraint_resource_file)
  }
  return validate(data, constraints) || {}
}

CompanionAd.propTypes = {
  fields: PropTypes.object,
  vastData: PropTypes.object
}


export default reduxForm({
  form: 'companionForm',
  fields: fields,
  validate: validateParams
})(CompanionAd)
