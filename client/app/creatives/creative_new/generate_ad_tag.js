import React, { Component, PropTypes } from 'react'
import { FormGroup, InputGroup, FormControl, Button, ControlLabel, OverlayTrigger, Col, Tooltip } from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'

import { TRACKING_TYPES } from '../../app_constants'

class GenerateAdTag extends Component {

  _renderCotrackerInfor() {
    const { data_tracking: { impression, click } } = this.props.creative
    return (
      <div className="form-horizontal">
        <div>
          <FormGroup controlId="formControlsText" rows="6">
            <Col componentClass={ControlLabel} sm={2}>
              Impression url
            </Col>
            <Col sm={10}>
              <InputGroup>
                <InputGroup.Button>
                  <CopyToClipboard text={impression}>
                    <OverlayTrigger placement="right" overlay={<Tooltip id="cp-imp">Copy</Tooltip>}>
                      <Button bsStyle="primary" bsSize="xsmall" className="copy-btn" >
                        <i className="ace-icon fa fa-copy"/>
                      </Button>
                    </OverlayTrigger>
                  </CopyToClipboard>
                </InputGroup.Button>
                <FormControl componentClass="textarea" rows="6"
                  value={impression}
                  onChange={() => { return false }} />
              </InputGroup>
            </Col>
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="formControlsText" rows="6">
            <Col componentClass={ControlLabel} sm={2}>
              Click url
            </Col>
            <Col sm={10}>
              <InputGroup>
                <InputGroup.Button>
                  <CopyToClipboard text={click}>
                    <OverlayTrigger placement="right" overlay={<Tooltip id="cp-url">Copy</Tooltip>}>
                      <Button bsStyle="primary" bsSize="xsmall" className="copy-btn" >
                        <i className="ace-icon fa fa-copy"/>
                      </Button>
                    </OverlayTrigger>
                  </CopyToClipboard>
                </InputGroup.Button>
                <FormControl componentClass="textarea" rows="6"
                  value={click}
                  onChange={() => { return false }} />
              </InputGroup>
            </Col>
          </FormGroup>
        </div>
        <div>
          <div className="pull-right">
            <Button bsStyle="danger" bsSize="small"
              onClick={() => { this.props.onClose() }}>
              <i className="ace-icon fa fa-check bigger-110"/>
              Ok
            </Button>
          </div>
        </div>
      </div>
    )
  }

  _renderAdTag() {
    const { data_tracking: { ad_tag } } = this.props.creative

    return (
      <div className="form-horizontal">
        <div>
          <FormGroup controlId="formControlsText" rows="6">
            <Col componentClass={ControlLabel} sm={2}>
              Ad tag
            </Col>
            <Col sm={10}>
              <InputGroup>
                <InputGroup.Button>
                  <CopyToClipboard text={ad_tag}>
                    <OverlayTrigger placement="right" overlay={<Tooltip id="cp-ad-tag">Copy</Tooltip>}>
                      <Button bsStyle="primary" bsSize="xsmall" className="copy-btn" >
                        <i className="ace-icon fa fa-copy"/>
                      </Button>
                    </OverlayTrigger>
                  </CopyToClipboard>
                </InputGroup.Button>
                <FormControl componentClass="textarea" rows="12"
                  value={ad_tag}
                  onChange={() => { return false }} />
              </InputGroup>
            </Col>
          </FormGroup>
        </div>
        <div>
          <div className="pull-right">
            <Button bsStyle="danger" bsSize="small"
              onClick={() => { this.props.onClose() }}>
              <i className="ace-icon fa fa-check bigger-110"/>
              Ok
            </Button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { creative } = this.props
    if (!creative || !creative.id)
      return <div></div>
    if (creative.tracking_type === TRACKING_TYPES.tracking_link)
      return this._renderCotrackerInfor()
    else
      return this._renderAdTag()
  }
}

GenerateAdTag.propTypes = {
  creative: PropTypes.object,
  data_tracking: PropTypes.object,
  onClose: PropTypes.func
}

export default GenerateAdTag