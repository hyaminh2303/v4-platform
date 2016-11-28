import React, { Component, PropTypes } from 'react'
import { Row, FormGroup, Col, FormControl, HelpBlock, ControlLabel } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import validate from 'validate.js'
import Selector from 'react-select'
import { split, last, extend } from 'lodash'

const fields = [
  'resource_type',
  'resource_url',
  'width',
  'height',
  'click_through',
  'media_file',
  'click_tracking_url',
  'event', 'tracking_event_url'
]

const resourcesTypes = [
  { label: 'Image (.gif, .jpeg, .png)', value: 'image' },
  { label: 'Javascript', value: 'application/x-javascript' },
  { label: 'Flash', value: 'application/x-shockwave-flash' },
  { label: 'IFrame Resource', value: 'iframe' },
  { label: 'HTML Resource', value: 'html ' }
]

class OverlayAd extends Component {
  constructor(props) {
    super(props)
    this.state = { fileName: null }
    this._handleChangeAttachment = this._handleChangeAttachment.bind(this)
  }

  _handleChangeAttachment(e) {
    const fileTypes = ['js', 'gif', 'jpeg', 'png', 'swf', 'html']
    let file = e.target.files[0]
    let ext = last(split(file.name, '.'))
    if (fileTypes.indexOf(ext) > -1) {
      this.setState({ fileName: file.name })
      this.props.fields.media_file.onChange(file)
    }
  }

  render() {
    const { fields: { resource_type, resource_url, width, height, click_through,
      click_tracking_url, event, tracking_event_url, media_file }, vastData } = this.props
    return (
      <div className="basic-info-box">
        <div className="box-header">
          <h4 className="box-title">Overlay Ad</h4>
        </div>
        <div className="box-content">
          <form>
            <Row className="basic-row">
              <Col md={6} className="row-col-md">
                <FormGroup className="basic-form-group"
                  controlId="formControlsText"
                  validationState={width.touched && width.error ? 'error' : null}>
                  <Row componentClass={ControlLabel} className="input-label">
                    * Width
                  </Row>
                  <Row className="input-box">
                    <FormControl
                      type="text"
                      className="input-field"
                      placeholder="800"
                      {...width}/>
                    <HelpBlock>{width.touched && width.error ? width.error[0] : null}</HelpBlock>
                  </Row>
                </FormGroup>
              </Col>
              <Col md={6} className="row-col-md">
                <FormGroup className="basic-form-group"
                  controlId="formControlsText"
                  validationState={height.touched && height.error ? 'error' : null}>
                  <Row componentClass={ControlLabel} className="input-label">
                    * Height
                  </Row>
                  <Row className="input-box">
                    <FormControl
                      type="text"
                      className="input-field"
                      placeholder="600"
                      {...height}/>
                    <HelpBlock>{height.touched && height.error ? height.error[0] : null}</HelpBlock>
                  </Row>
                </FormGroup>
              </Col>
            </Row>
            <Row className="basic-row">
              <FormGroup className="basic-form-group"
                controlId="formControlsText"
                validationState={resource_type.touched && resource_type.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  * Resource type
                </Row>
                <Row className="input-box">
                  <Selector
                    valueKey="value"
                    labelKey="label"
                    value={resource_type.value}
                    options={resourcesTypes}
                    onChange={resource_type.onChange} />
                    <HelpBlock>
                      {resource_type.touched && resource_type.error ? resource_type.error[0] : null}
                    </HelpBlock>
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
              <Col md={9} className="row-col-md">
                <FormGroup className="basic-form-group"
                  controlId="formControlsText"
                  validationState={resource_url.touched && resource_url.error ? 'error' : null}>
                  <Row componentClass={ControlLabel} className="input-label">
                    Resource URL
                  </Row>
                  <Row className="input-box">
                    <FormControl
                      type="text"
                      className="input-field"
                      placeholder="http://im-dev.s3.amazonaws.com/image_server/templates/campaign_16/video.mp4"
                      {...resource_url}/>
                    <HelpBlock>{resource_url.touched && resource_url.error ? resource_url.error[0] : null}</HelpBlock>
                  </Row>
                </FormGroup>
              </Col>
              <Col md={3} className="row-col-md">
                <FormGroup className="basic-form-group"
                  controlId="formControlsText"
                  validationState={media_file.touched && media_file.error ? 'error' : null}>
                  <Row componentClass={ControlLabel} className="input-label">
                    * Upload file
                  </Row>
                  <Row className="input-upload-box">
                    <div className="btn btn-upload fileUpload">
                      <span className="label-btn-upload">Browse</span>
                      <input type="file"
                        className="upload"
                        onChange={this._handleChangeAttachment}/>
                    </div>
                    <div className="file-name-box">
                      {this.state.fileName}
                    </div>
                    <HelpBlock>
                      {media_file.touched && media_file.error ? media_file.error[0] : null}
                    </HelpBlock>
                  </Row>
                </FormGroup>
              </Col>
            </Row>
            <Row className="basic-row">
              <FormGroup className="basic-form-group"
                controlId="formControlsText"
                validationState={click_through.touched && click_through.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  * Click Through URL
                </Row>
                <Row className="input-box">
                  <FormControl
                    type="text"
                    className="input-field"
                    placeholder="http://im.l.dev.s3-website-eu-west-1.amazonaws.com/16/index.html"
                    {...click_through}/>
                  <HelpBlock>{click_through.touched && click_through.error ? click_through.error[0] : null}</HelpBlock>
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
              <FormGroup className="basic-form-group"
                controlId="formControlsText"
                validationState={click_tracking_url.touched && click_tracking_url.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  Click Tracking URL
                </Row>
                <Row className="input-box">
                  <FormControl
                    type="text"
                    className="input-field"
                    placeholder={'http://pubads.g.doubleclick.net/gampad/clk?id=' +
                      '94677177&iu=/3595/NZ_Entertainment_MobGeo'}
                    {...click_tracking_url}/>
                  <HelpBlock>
                    {click_tracking_url.touched && click_tracking_url.error ? click_tracking_url.error[0] : null}
                  </HelpBlock>
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
              <FormGroup className="basic-form-group"
                controlId="formControlsText"
                validationState={event.touched && event.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  Event
                </Row>
                <Row className="input-box">
                  <Selector
                    valueKey="value"
                    labelKey="label"
                    value={event.value}
                    options={vastData.events}
                    onChange={event.onChange} />
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
              <FormGroup className="basic-form-group"
                controlId="formControlsText"
                validationState={tracking_event_url.touched && tracking_event_url.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  * Tracking Event URL
                </Row>
                <Row className="input-box">
                  <FormControl
                    type="text"
                    className="input-field"
                    placeholder={'http://pubads.g.doubleclick.net/gampad/clk?id=946771' +
                    '77&iu=/3595/NZ_Entertainment_MobGeo'}
                    {...tracking_event_url}/>
                  <HelpBlock>
                    {tracking_event_url.touched && tracking_event_url.error ? tracking_event_url.error[0] : null}
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
    resource_type: {
      presence: true
    },
    width: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: 0
      }
    },
    height: {
      presence: true,
      numericality: {
        onlyInteger: true,
        greaterThan: 0
      }
    },
    click_through: {
      presence: true,
      url: true
    },
    tracking_event_url: {
      presence: true,
      url: true
    },
    click_tracking_url:{
      url: true
    }
  }
  let constraint_media_file = {
    media_file: {
      presence: true
    }
  }
  let constraint_media_url = {
    resource_url: {
      presence: true,
      url: true
    }
  }
  if (data.media_file === undefined) {
    constraints = extend({}, constraints, constraint_media_url)
  }
  if (data.resource_url === undefined || data.resource_url === '') {
    constraints = extend({}, constraints, constraint_media_file)
  }

  return validate(data, constraints) || {}
}

OverlayAd.propTypes = {
  fields: PropTypes.object,
  vastData: PropTypes.object
}

export default reduxForm({
  form: 'overlayForm',
  fields: fields,
  validate: validateParams
})(OverlayAd)
