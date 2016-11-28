import React, { Component, PropTypes } from 'react'
import { Row, FormGroup, Col, FormControl, HelpBlock, ControlLabel } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import validate from 'validate.js'
import Selector from 'react-select'

const fields = [
  'ad_system',
  'ad_title',
  'description',
  'error_url',
  'impression_url',
  'has_companion_ad',
  'creative_type'
]
const overlay = 'overlay'
const preroll = 'preroll'

class BasicInfo extends Component {
  constructor(props) {
    super(props)
    this._handleChangeComanionAd = this._handleChangeComanionAd.bind(this)
    this._getAdType = this._getAdType.bind(this)
  }

  componentWillMount() {
    this.props.fields.creative_type.onChange(overlay)
    if (this.props.isPrerollAd) {
      this.props.fields.creative_type.onChange(preroll)
    }
    this.props.fields.has_companion_ad.onChange(this.props.hasCompanionAd)
  }

  _handleCreativeTypeChange(k) {
    this.props.fields.creative_type.onChange(k)
    this.props.onAdTypeChange(k === preroll)
  }

  _handleChangeComanionAd(e) {
    this.props.onCompanionAdChange(e.target.checked)
    this.props.fields.has_companion_ad.onChange(e.target.checked)
  }

  _getAdType() {
    let type = 'Overlay'
    if (this.props.isPrerollAd) {
      type = 'Pre-roll'
    }
    return type
  }

  render() {
    const { fields: { ad_system, ad_title, description, error_url, impression_url,
      has_companion_ad, creative_type }, creativeTypes } = this.props
    return (
      <div className="basic-info-box">
        <div className="box-header">
          <h4 className="box-title">Basic</h4>
        </div>
        <div className="box-content">
          <form>
            <Row className="basic-row">
               <FormGroup className="basic-form-group"
                 controlId="formControlsText"
                 validationState={ad_system.touched && ad_system.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  * Ad system
                </Row>
                <Row className="input-box">
                  <FormControl
                    type="text"
                    className="input-field"
                    placeholder="Yoose" {...ad_system}/>
                  <HelpBlock>{ad_system.touched && ad_system.error ? ad_system.error[0] : null}</HelpBlock>
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
               <FormGroup className="basic-form-group"
                 controlId="formControlsText"
                 validationState={ad_title.touched && ad_title.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  * Ad title
                </Row>
                <Row className="input-box">
                  <FormControl
                    type="text"
                    className="input-field"
                    placeholder="Romano preroll video" {...ad_title}/>
                  <HelpBlock>{ad_title.touched && ad_title.error ? ad_title.error[0] : null}</HelpBlock>
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
               <FormGroup className="basic-form-group"
                 controlId="formControlsText"
                 validationState={description.touched && description.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  Description
                </Row>
                <Row className="input-box">
                  <FormControl
                    type="text"
                    className="input-field"
                    componentClass="textarea" {...description}/>
                  <HelpBlock>{description.touched && description.error ? description.error[0] : null}</HelpBlock>
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
               <FormGroup className="basic-form-group"
                 controlId="formControlsText"
                 validationState={error_url.touched && error_url.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  Error URL
                </Row>
                <Row className="input-box">
                  <FormControl
                    type="text"
                    className="input-field"
                    placeholder={'http://ad.doubleclick.net/N3595/ad/' +
                      'errortracking/;campaign=oid270981777adid94672737;sz=1x1'}
                    {...error_url}/>
                  <HelpBlock>{error_url.touched && error_url.error ? error_url.error[0] : null}</HelpBlock>
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
               <FormGroup className="basic-form-group"
                 controlId="formControlsText"
                 validationState={impression_url.touched && impression_url.error ? 'error' : null}>
                <Row componentClass={ControlLabel} className="input-label">
                  * Impression URL
                </Row>
                <Row className="input-box">
                  <FormControl
                    type="text"
                    className="input-field"
                    placeholder={'http://ad.doubleclick.net/N3595/ad/' +
                      'errortracking/;campaign=oid270981777adid94672737;sz=1x1'}
                    {...impression_url}/>
                  <HelpBlock>
                    {impression_url.touched && impression_url.error ? impression_url.error[0] : null}
                  </HelpBlock>
                </Row>
              </FormGroup>
            </Row>
            <Row className="basic-row">
                <FormGroup className="basic-form-group"
                  controlId="formControlsText"
                  validationState={creative_type.touched && creative_type.error ? 'error' : null}>
                  <Row componentClass={ControlLabel} className="input-label">
                    Creative type
                  </Row>
                  <Row className="input-box">
                    <Selector
                      valueKey="value"
                      labelKey="label"
                      value={this._getAdType()}
                      options={creativeTypes}
                      onChange={(k) => this._handleCreativeTypeChange(k)} />
                    <HelpBlock>
                      {creative_type.touched && creative_type.error ? creative_type.error[0] : null}
                    </HelpBlock>
                  </Row>
                </FormGroup>
            </Row>
            <Row className="check-box">
              <FormGroup>
                <Col md={1} className="companion-checkbox">
                  <FormControl type="checkbox"
                    className="input-checkbox-companion"
                    onClick={(e) => this._handleChangeComanionAd(e)}
                    {...has_companion_ad}/>
                </Col>
                <Col componentClass={ControlLabel} className="checkbox-label" md={8}>
                  Has companion ad
                </Col>
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
    ad_system: {
      presence: true
    },
    creative_type: {
      presence: true
    },
    ad_title: {
      presence: true
    },
    impression_url: {
      presence: true,
      url: true
    },
    error_url:{
      url: true
    }
  }
  return validate(data, constraints) || {}
}

BasicInfo.propTypes = {
  creativeTypes: PropTypes.array,
  fields: PropTypes.object,
  hasCompanionAd: PropTypes.bool,
  isPrerollAd: PropTypes.bool,
  onAdTypeChange: PropTypes.func,
  onCompanionAdChange: PropTypes.func
}

export default reduxForm({
  form: 'basicForm',
  fields: fields,
  validate: validateParams
})(BasicInfo)
