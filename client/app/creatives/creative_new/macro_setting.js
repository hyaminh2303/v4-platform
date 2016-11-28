import React, { Component, PropTypes } from 'react'
import { Row, Col, FormGroup, InputGroup, FormControl, ControlLabel, HelpBlock, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import validate from 'validate.js'
import Selector from 'react-select'
import { PLATFORMS, TRACKING_TYPES } from '../../app_constants'

class MacroSetting extends Component {
  constructor(props) {
    super(props)
    this._handleSave = this._handleSave.bind(this)
    this._handleChangeTracker = this._handleChangeTracker.bind(this)
  }

  // clear some value when change type tracking_type
  _handleSave(creative) {
    if (creative.tracking_type === TRACKING_TYPES.tracking_link) {
      creative.client_impression_url_1 = ''
      creative.client_impression_url_2 = ''
      creative.client_impression_url_3 = ''
    }
    this.props.onSave(creative, '3')
  }

  _isImpressionTracker() {
    const { fields: { tracking_type } } = this.props
    return (tracking_type.value === TRACKING_TYPES.ad_tag)
  }

  _klassShowImpression(impression = null, depend_impression = null) {
    if ((depend_impression &&
      depend_impression.defaultValue &&
      depend_impression.defaultValue !== '') ||
      (impression.defaultValue && impression.defaultValue !== ''))
      return 'impression-url'
    else
      return 'impression-url hide'
  }

  _showMoreImpression() {
    let nextEl = document.querySelector('.impression-url.hide')
    if (nextEl)
      nextEl.className = 'impression-url'
  }

  _handleChangeTracker(data, tracker) {
    tracker.onChange(data)
    this.props.onChangeTracker(data)
  }

  render() {
    const platform_options = [
      { value: PLATFORMS.datalift, label: 'DataLift' },
      { value: PLATFORMS.pocket_math, label: 'PocketMath' }
    ]
    let tracking_type_options = [
      { value: TRACKING_TYPES.ad_tag, label: 'AdTag Tracker' }
    ]


    const { fields: { platform, tracking_type,
      client_impression_url_1, client_impression_url_2, client_impression_url_3 }, handleSubmit, creative } = this.props

    if (creative.creative_type === 'static') {
      tracking_type_options.unshift({ value: TRACKING_TYPES.tracking_link, label: 'Third party co-tracker' })
    }
    return (
      <div>
        <form className="form-horizontal" onSubmit={handleSubmit((creative) => this._handleSave(creative))}>
          <Row>
            <FormGroup controlId="formControlsText">
              <label className = "control-label col-xs-5">
                Platform</label>
              <div className = "col-xs-4">
                <Selector
                  name="form-field-name"
                  valueKey="value"
                  labelKey="label"
                  options={platform_options}
                  value={platform.value}
                  onChange={platform.onChange} />
              </div>
            </FormGroup>
            <FormGroup controlId="formControlsText" >
              <label className = "control-label col-xs-5">
                Ad tracker</label>
              <div className = "col-xs-4">
                <Selector
                  name="form-field-name"
                  valueKey="value"
                  labelKey="label"
                  options={tracking_type_options}
                  value={tracking_type.value}
                  onChange={(data) => { this._handleChangeTracker(data, tracking_type) }} />
              </div>
            </FormGroup>

            <div className={this._isImpressionTracker() ? '' : 'hide'}>
              <FormGroup
                controlId="formControlsText">
                <Col componentClass={ControlLabel} sm={5}>
                  Client impression url 1
                </Col>
                <Col sm={4}>
                  <InputGroup>
                    <FormControl type="text"
                      value={client_impression_url_1.value}
                      onChange={client_impression_url_1.onChange} />
                    <InputGroup.Button>
                      <Button bsStyle="primary" bsSize="small" onClick={this._showMoreImpression} >
                        <i className="ace-icon fa fa-plus"/>
                      </Button>
                    </InputGroup.Button>
                  </InputGroup>
                </Col>
              </FormGroup>
              <div className={this._klassShowImpression(client_impression_url_2, client_impression_url_3)}>
                <FormGroup
                  controlId="formControlsText"
                  validationState={client_impression_url_2.touched && client_impression_url_2.error ? 'error' : null}>
                  <Col componentClass={ControlLabel} sm={5}>
                    Client impression url 2
                  </Col>
                  <Col sm={4}>
                    <InputGroup>
                      <FormControl type="text"
                        value={client_impression_url_2.value}
                        onChange={client_impression_url_2.onChange} />
                      <HelpBlock>
                        {client_impression_url_2.touched && client_impression_url_2.error ?
                          client_impression_url_2.error[0]
                          :
                          null
                        }
                      </HelpBlock>
                    </InputGroup>
                  </Col>
                </FormGroup>
              </div>
              <div className={this._klassShowImpression(client_impression_url_3)}>
                <FormGroup
                  controlId="formControlsText"
                  validationState={client_impression_url_3.touched && client_impression_url_3.error ? 'error' : null}>
                  <Col componentClass={ControlLabel} sm={5}>
                    Client impression url 3
                  </Col>
                  <Col sm={4}>
                    <InputGroup>
                      <FormControl type="text"
                        value={client_impression_url_3.value}
                        onChange={client_impression_url_3.onChange} />
                      <HelpBlock>
                        {client_impression_url_3.touched && client_impression_url_3.error ?
                          client_impression_url_3.error[0]
                          :
                          null
                        }
                      </HelpBlock>
                    </InputGroup>
                  </Col>
                </FormGroup>
              </div>
            </div>
          </Row>

          <div className="pull-right">
            <Button bsStyle="danger" bsSize="small" onClick={handleSubmit((creative) => this._handleSave(creative))}>
              <i className="ace-icon fa fa-check bigger-110"/>
              Continue
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

MacroSetting.propTypes = {
  adGroupId: PropTypes.string,
  creative: PropTypes.object,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func,
  onChangeTracker: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}

function validateParams(creative) {
  const constraints = {
    platform: {
      presence: true
    },
    tracking_type: {
      presence: true
    },
    client_impression_url_1: {
      url: (creative.tracking_type === TRACKING_TYPES.ad_tag ? true : false)
    },
    client_impression_url_2: {
      url: (creative.tracking_type === TRACKING_TYPES.ad_tag ? true : false)
    },
    client_impression_url_3: {
      url: (creative.tracking_type === TRACKING_TYPES.ad_tag ? true : false)
    }
  }
  let error = validate(creative, constraints)

  return error || {}
}

export default reduxForm({
  form: 'macroFormCreative',
  fields: ['id', 'platform', 'tracking_type', 'client_impression_url_1',
    'client_impression_url_2', 'client_impression_url_3'],
  validate: validateParams
})(MacroSetting)
