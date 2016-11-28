import React, { Component, PropTypes } from 'react'
import { Button, Modal, Row, Col, FormGroup, ControlLabel, FormControl,
         Tooltip, InputGroup, OverlayTrigger, Tabs, Tab } from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'
import { isEmpty, extend } from 'lodash'

class AdgroupAdtagScript extends Component {
  constructor(props) {
    super(props)
    this.state = { isOpenPopup: false, currentPlatform: 1 }
    this._onClose = this._onClose.bind(this)
    this._onOpen = this._onOpen.bind(this)
    this._handleSelectPlatform = this._handleSelectPlatform.bind(this)
  }

  _onClose() {
    this.setState({ isOpenPopup: false })
  }

  _onOpen() {
    this.setState({ isOpenPopup: true })
  }

  _handleSelectPlatform(key){
    this.setState({currentPlatform: key})
  }

  _renderScript(ad_script) {
    return (
        <FormGroup controlId="formControlsText" rows="6">
          <Row>
            <Col componentClass={ControlLabel} sm={1}>
            </Col>
            <Col sm={11}>
              <InputGroup>
                <InputGroup.Button>
                  <CopyToClipboard text={ad_script}>
                    <OverlayTrigger placement="right" overlay={<Tooltip id="cp-url">Copy</Tooltip>}>
                      <Button bsStyle="primary" bsSize="xsmall" className="copy-btn" >
                        <i className="ace-icon fa fa-copy"/>
                      </Button>
                    </OverlayTrigger>
                  </CopyToClipboard>
                </InputGroup.Button>
                <FormControl componentClass="textarea" rows="15"
                  value={ad_script}
                  onChange={() => { return false }} />
              </InputGroup>
            </Col>
          </Row>
        </FormGroup>
    )
  }

  render() {
    if(isEmpty(this.props.adtagScript))
      return <div></div>

    const { pocket_math, datalift } = this.props.adtagScript
    return (
      <div>
      <div className='float-right'>
        <Button onClick={this._onOpen} > Generate AdTag </Button>
      </div>
      <Modal className='adgroup-adtag-modal' show={this.state.isOpenPopup} onHide={this._onClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              AdTag Script
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tabs activeKey={this.state.currentPlatform} onSelect={this._handleSelectPlatform}>
              <Tab eventKey={1} title="Pocket Math">{this._renderScript(pocket_math)}</Tab>
              <Tab eventKey={2} title="DataLift">{this._renderScript(datalift)}</Tab>
            </Tabs>
            <div className='clearfix'></div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this._onClose} bsStyle='danger'>Close</Button>
          </Modal.Footer>
      </Modal>
      </div>
    )
  }
}

export default AdgroupAdtagScript