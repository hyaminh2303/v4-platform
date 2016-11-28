import React, { PropTypes, Component } from 'react'
import { Row, FormGroup, Col, FormControl, HelpBlock, ControlLabel, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import validate from 'validate.js'
import Selector from 'react-select'
import { split, last, forEach, extend } from 'lodash'

const fields = [
  'skipoffset',
  'duration',
  'event',
  'click_through',
  'click_tracking_url',
  'tracking_event_url',
  'media_files_attributes[].media_type',
  'media_files_attributes[].url',
  'media_files_attributes[].media',
  'media_files_attributes[].width',
  'media_files_attributes[].height',
  'media_files_attributes[].file_name'
]

class PrerollAd extends Component {
  constructor(props) {
    super(props)
    this._handleChangeAttachment = this._handleChangeAttachment.bind(this)
  }

  componentWillMount() {
    if (this.props.fields.media_files_attributes.length === 0) {
      this.props.fields.media_files_attributes.addField()
    }
  }

  _handleChangeAttachment(e, media, file_name) {
    const fileTypes = ['flv', 'mp4', 'wmv', 'js', 'gif', 'jpeg', 'png', 'swf', 'webm']
    let uploadFile = e.target.files[0]
    let ext = last(split(uploadFile.name, '.'))
    if (fileTypes.indexOf(ext) > -1) {
      media.onChange(uploadFile)
      file_name.onChange(uploadFile.name)
    }
  }

  _renderBlock(media_info, index) {
    const { media_type, url, media, width, height, file_name } = media_info
    const { fields: { media_files_attributes }, vastData } = this.props
    let btnRemove = (
      <Row componentClass={ControlLabel} className="input-media-label">
        <Col sm={6} className="media-label">* Media type</Col>
        <Col sm={6} className="btn-minus">
          <Button type="button"
            bsStyle="success"
            className="pull-right btn-remove-block"
            bsSize="small"
            onClick={() => media_files_attributes.addField()}>
            <i className="minus-ico ace-icon fa fa-plus bigger-110"/>
          </Button>
        </Col>
      </Row>
    )
    if (index !== 0) {
      btnRemove = (
        <Row componentClass={ControlLabel} className="input-media-label">
          <Col sm={6} className="media-label">* Media type</Col>
          <Col sm={6} className="btn-minus">
            <Button type="button"
              bsStyle="danger"
              className="pull-right btn-remove-block"
              bsSize="small"
              onClick={() => media_files_attributes.removeField(index)}>
              <i className="minus-ico ace-icon fa fa-minus bigger-110"/>
            </Button>
          </Col>
        </Row>
      )
    }
    return (
      <div className="block-media" key={index}>
        <Row className="basic-row">
          <FormGroup className="basic-form-group"
            controlId="formControlsText"
            validationState={media_type.touched && media_type.error ? 'error' : null}>
            {btnRemove}
            <Row className="input-box">
              <Selector
                validationState={media_type.touched && media_type.error ? 'error' : null}
                valueKey="value"
                labelKey="label"
                value={media_type.value}
                options={vastData.media_types}
                onChange={media_type.onChange} />
              <HelpBlock>{media_type.touched && media_type.error ? media_type.error[0] : null}</HelpBlock>
            </Row>
          </FormGroup>
        </Row>
        <Row className="basic-row">
          <Col md={9} className="row-col-md">
            <FormGroup className="basic-form-group"
              controlId="formControlsText"
              validationState={url.touched && url.error ? 'error' : null}>
              <Row componentClass={ControlLabel} className="input-label">
                * Media URL
              </Row>
              <Row className="input-box">
                <FormControl
                  type="text"
                  className="input-field"
                  placeholder="http://im-dev.s3.amazonaws.com/image_server/templates/campaign_16/video.mp4"
                  {...url}/>
                <HelpBlock>{url.touched && url.error ? url.error[0] : null}</HelpBlock>
              </Row>
            </FormGroup>
          </Col>
          <Col md={3} className="row-col-md">
            <FormGroup className="basic-form-group block-upload-file"
              controlId="formControlsText"
              validationState={media.touched && media.error ? 'error' : null}>
              <Row componentClass={ControlLabel} className="input-label">
                * Upload file
              </Row>
              <Row className="input-upload-box">
                <div className="btn btn-upload fileUpload">
                  <span className="label-btn-upload">Browse</span>
                  <input type="file"
                    className="upload"
                    onChange={(e) => this._handleChangeAttachment(e, media, file_name)}/>
                </div>
                <div className="file-name-box">
                  {file_name.value}
                </div>
                <HelpBlock>
                  {media.touched && media.error ? media.error[0] : null}
                </HelpBlock>
              </Row>
            </FormGroup>
          </Col>
        </Row>
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
      </div>
    )
  }

  render() {
    const { fields: { skipoffset, duration, click_through, click_tracking_url,
      event, tracking_event_url, media_files_attributes }, vastData } = this.props
    return (
      <div className="basic-info-box">
        <div className="box-header">
          <h4 className="box-title">Preroll Ad</h4>
        </div>
        <div className="box-content">
          <form>
            <Row className="basic-row">
              <Col md={6} className="row-col-md">
                <FormGroup className="basic-form-group"
                  controlId="formControlsText"
                  validationState={skipoffset.touched && skipoffset.error ? 'error' : null}>
                  <Row componentClass={ControlLabel} className="input-label">
                    Skipoffset
                  </Row>
                  <Row className="input-box">
                    <FormControl
                      type="text"
                      className="input-field"
                      placeholder="00:00:10 or 10%"
                      {...skipoffset}/>
                    <HelpBlock>{skipoffset.touched && skipoffset.error ? skipoffset.error[0] : null}</HelpBlock>
                  </Row>
                </FormGroup>
              </Col>
              <Col md={6} className="row-col-md">
                <FormGroup className="basic-form-group"
                  controlId="formControlsText"
                  validationState={duration.touched && duration.error ? 'error' : null}>
                  <Row componentClass={ControlLabel} className="input-label">
                    Duration
                  </Row>
                  <Row className="input-box">
                    <FormControl
                      type="text"
                      className="input-field"
                      placeholder="00:00:30"
                      {...duration}/>
                    <HelpBlock>{duration.touched && duration.error ? duration.error[0] : null}</HelpBlock>
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
                  <HelpBlock>
                    {event.touched && event.error ? event.error[0] : null}
                  </HelpBlock>
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
              <FormGroup className="basic-form-group"
                controlId="formControlsText"
                validationState={tracking_event_url.touched && tracking_event_url.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  Tracking Event URL
                </Row>
                <Row className="input-box">
                  <FormControl
                    type="text"
                    className="input-field"
                    placeholder={'http://pubads.g.doubleclick.net/gampad/' +
                      'clk?id=94677177&iu=/3595/NZ_Entertainment_MobGeo'}
                    {...tracking_event_url}/>
                  <HelpBlock>
                    {tracking_event_url.touched && tracking_event_url.error ? tracking_event_url.error[0] : null}
                  </HelpBlock>
                </Row>
              </FormGroup>
            </Row>
            {media_files_attributes.map((media_info, index) => this._renderBlock(media_info, index))}
          </form>
        </div>
      </div>
    )
  }
}

function validateParams(data) {
  let error = { media_files_attributes: [] }
  let constraint_media_file = {
    media: {
      presence: true
    }
  }
  let constraint_media_url = {
    url: {
      presence: true,
      url: true
    }
  }
  let childConstraints = {
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
    media_type: {
      presence: true
    }
  }
  let constraints = {
    click_through: {
      presence: true,
      url: true
    },
    click_tracking_url:{
      url: true
    }
  }
  let tracking_event = {
    tracking_event_url: {
      presence: true,
      url: true
    }
  }
  let event_constrant = {
    event: {
      presence: true
    }
  }
  forEach(data.media_files_attributes, (e) => {
    if (e.url === undefined) {
      childConstraints = extend({}, childConstraints, constraint_media_file)
    }
    if (e.media === undefined) {
      childConstraints = extend({}, childConstraints, constraint_media_url)
    }
    error.media_files_attributes.push(validate(e, childConstraints))
  })

  if (data.event !== '') {
    constraints = extend({}, constraints, tracking_event)
  }
  if (data.tracking_event_url !== '') {
    constraints = extend({}, constraints, event_constrant)
  }
  return extend({}, error, validate(data, constraints))
}

PrerollAd.propTypes = {
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
  isPrerollAd: PropTypes.bool,
  vastData: PropTypes.object
}

export default reduxForm({
  form: 'prerollForm',
  fields: fields,
  validate: validateParams
})(PrerollAd)
