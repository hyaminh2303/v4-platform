import React, { Component, PropTypes } from 'react'
import { FormGroup, ControlLabel, FormControl, Button, Row, Col } from 'react-bootstrap'

class VastPreview extends Component {
  constructor(props) {
    super(props)
    this.fileName = ''
    this._renderURLPreview = this._renderURLPreview.bind(this)
    this._renderCommitButton = this._renderCommitButton.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentWillMount() {
    this.fileName = `${this.props.vast.ad_system}.xml`
  }

  componentWillUpdate() {
    this.fileName = `${this.props.vast.ad_system}.xml`
  }

  _handleFileNameChange(e) {
    this.fileName = e.target.value
  }

  _handleSubmit() {
    this.props.onCommitToS3(this.fileName)
  }

  _openPage() {
    window.open('https://developers.google.com/interactive-media-ads/docs/vastinspector_dual')
  }

  _renderCommitButton() {
    const vastURL = this.props.vast.vast_url
    if ( vastURL !== '') {
      return (
        <Button type="button"
          bsStyle="success"
          className="btn-verify"
          bsSize="small"
          onClick={this._openPage}>
          Verify
        </Button>
      )
    } else {
      return (
        <Button type="button"
          bsStyle="danger"
          bsSize="small"
          onClick={this._handleSubmit}>
          <i className="ace-icon fa fa-check bigger-110"/>
          Commit to S3
        </Button>
      )
    }
  }

  _renderURLPreview() {
    const vastURL = this.props.vast.vast_url
    let label = 'XML URL'
    if (vastURL !== '') {
      return (
        <Row className="xml-button-row">
          <Col sm={1} className="xml-preview-label">
            <ControlLabel>{label}</ControlLabel>
          </Col>
          <Col sm={9} className="xml-url-box">
            <FormControl
              readOnly="true"
              value={vastURL}/>
          </Col>
          <Col sm={2}>
            {this._renderCommitButton()}
          </Col>
        </Row>
      )
    } else {
      label = 'File Name'
      return (
        <Row className="xml-button-row">
          <Col sm={1} className="xml-preview-label">
            <ControlLabel>{label}</ControlLabel>
          </Col>
          <Col sm={9} className="xml-url-box">
            <FormControl
              placeholder={this.props.vast.ad_system + '.xml'}
              onChange={event => this._handleFileNameChange(event)}/>
          </Col>
          <Col sm={2}>
            {this._renderCommitButton()}
          </Col>
        </Row>
      )
    }
  }

  render() {
    const vastXML = this.props.vast.vast_xml
    return (
      <div className="basic-info-box">
        <div className="box-header">
          <h4 className="box-title">VAST Content</h4>
        </div>
        <div className="xml-preview-wrapper">
          <ControlLabel
            className="xml-content-label">Content</ControlLabel>
          <FormGroup
            className="xml-content-box"
            controlId="formControlsTextarea">
            <FormControl
              componentClass="textarea"
              placeholder="textarea"
              readOnly="true"
              rows="20"
              value={vastXML}/>
          </FormGroup>
          {this._renderURLPreview()}
        </div>
      </div>
    )
  }
}

VastPreview.propTypes = {
  onCommitToS3: PropTypes.func,
  vast: PropTypes.object
}

export default VastPreview
