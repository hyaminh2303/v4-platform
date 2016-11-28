import React, { Component, PropTypes } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { extend } from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BasicInfo from './settings/basic_info'
import PrerollAd from './settings/preroll_ad'
import OverlayAd from './settings/overlay_ad'
import CompanionAd from './settings/companion_ad'
import VastPreview from './settings/vast_preview'
import { createVast, fetchVastData, submitToS3, loadVastFromFile, clearOldVast } from './vast_actions'
import Notification from '../notification/'
import './style.css'

class VastGenerator extends Component {

  constructor(props) {
    super(props)
    this.vastData = {}
    this.state = {
      hasCompanionAd: false,
      isPrerollAd: true,
      fileName: null
    }
    this._handleFormSubmit = this._handleFormSubmit.bind(this)
    this._onAdTypeChange = this._onAdTypeChange.bind(this)
    this._onCompanionAdChange = this._onCompanionAdChange.bind(this)
    this._renderAdType = this._renderAdType.bind(this)
    this._renderCompanionAd = this._renderCompanionAd.bind(this)
    this._handleGenerateVast = this._handleGenerateVast.bind(this)
    this._handleLoadVastFile = this._handleLoadVastFile.bind(this)
    this._renderVastPreview = this._renderVastPreview.bind(this)
    this._handleCommitToS3 = this._handleCommitToS3.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
    this._handleLoadFileSuccess = this._handleLoadFileSuccess.bind(this)
  }

  componentWillMount() {
    this.props.fetchVastData()
    this.props.clearOldVast()
  }

  _handleLoadVastFile(e) {
    let file = e.target.files[0]
    this.setState({ fileName: file.name })
    this.props.loadVastFromFile(file, this._handleLoadFileSuccess)
  }

  _handleLoadFileSuccess(vast) {
    this.setState({ isPrerollAd: true, hasCompanionAd: false })
    if (vast.creative_type === 'overlay') {
      this.setState({ isPrerollAd: false })
    }
    if (vast.has_companion_ad) {
      this.setState({ hasCompanionAd: true })
    }
    this.setState({ fileName: '' })
  }

  _resetFileInput(e) {
    e.target.value = ''
  }

  _handleSubmit() {
    const { isPrerollAd } = this.state
    this.formsValid = true
    this.refs.basicInfo.submit()
    if (isPrerollAd) {
      this.refs.prerollAd.submit()
    } else {
      this.refs.overlayAd.submit()
    }
    if (this.state.hasCompanionAd) {
      this.refs.companionAd.submit()
    }
  }

  _handleGenerateVast() {
    this._handleSubmit()
    if (this.formsValid) {
      this.props.createVast(this.vastData)
    }
  }

  _handleFormSubmit(data) {
    this.vastData = extend({}, this.vastData, data)
  }

  _onAdTypeChange(value) {
    this.setState({ isPrerollAd: value })
  }

  _onCompanionAdChange(value) {
    this.setState({ hasCompanionAd: value })
  }

  _handleCommitToS3(fileName) {
    this._handleSubmit()
    let commitToS3 = true
    if (this.formsValid) {
      this.props.createVast(this.vastData, commitToS3, fileName)
    }
  }

  _renderVastPreview() {
    const { vast } = this.props
    if (vast.vast_xml !== '') {
      return (
        <div className="xml-preview">
          <VastPreview
            ref="vastPreview"
            onCommitToS3={this._handleCommitToS3}
            vast={vast}/>
      </div>
      )
    }
  }

  _renderCompanionAd() {
    const { vastConstantData, vast } = this.props
    if (this.state.hasCompanionAd) {
      return (
        <div className="companion-ad">
          <CompanionAd
            ref="companionAd"
            initialValues={vast}
            vastData={vastConstantData}
            onSubmit={this._handleFormSubmit}
            onSubmitFail={() => this.formsValid = false}/>
        </div>
      )
    }
  }

  _renderAdType() {
    const { vastConstantData, vast } = this.props
    if (this.state.isPrerollAd) {
      return (
        <PrerollAd
          ref="prerollAd"
          initialValues={vast}
          vastData={vastConstantData}
          onSubmit={this._handleFormSubmit}
          onSubmitFail={() => this.formsValid = false}/>
      )
    }
    return (
      <OverlayAd
        ref="overlayAd"
        initialValues={vast}
        vastData={vastConstantData}
        onSubmit={this._handleFormSubmit}
        onSubmitFail={() => this.formsValid = false}/>
    )
  }

  _renderButtonGroup() {
    return (
      <div className="button-group">
        <Button type="button"
          bsStyle="danger"
          className="pull-left"
          bsSize="small"
          onClick={() => this._handleGenerateVast()}>
          <i className="ace-icon fa fa-check bigger-110"/>
          Generate VAST
        </Button>
        <Button href={'#/dashboard'} bsStyle="default" className="btn-cancel" bsSize="small">
          <i className="ace-icon fa f bigger-110"/>
          Cancel
        </Button>
        <div className="btn btn-danger fileUpload pull-right btn-upload-file">
          <span className="label-btn-load-file">Load from file...</span>
          <input type="file"
            className="upload"
            onChange={this._handleLoadVastFile}
            onClick={(e) => this._resetFileInput(e)}/>
        </div>
        <div className="file-name-box load-vast-name">
          {this.state.fileName}
        </div>
        <div className="test-vast">
          <a target="_blank" className="clearfix"
            href="https://developers.google.com/interactive-media-ads/docs/vastinspector_dual">
            Click here to test your VAST XML
          </a>
        </div>
      </div>
    )
  }

  render() {
    const { isPrerollAd, hasCompanionAd } = this.state
    const { vastConstantData, vast } = this.props
    return (
      <div className="campaign-new">
        <div className="breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="ace-icon fa fa-dashboard home-icon"/>
              <a href="#/dashboard">Dashboard</a>
            </li>
            <li>Vast Generator</li>
          </ul>
        </div>
        <div className="page-content">
          <div className="page-header text-danger">
            <h1>Vast Generator</h1>
          </div>
          <Notification />
          {this._renderVastPreview()}
          <Row>
            <Col md={6}>
              <BasicInfo
                ref="basicInfo"
                initialValues={vast}
                isPrerollAd={isPrerollAd}
                creativeTypes={vastConstantData.creative_types}
                onAdTypeChange={this._onAdTypeChange}
                hasCompanionAd={hasCompanionAd}
                onCompanionAdChange={this._onCompanionAdChange}
                onSubmit={this._handleFormSubmit}
                onSubmitFail={() => this.formsValid = false}/>
                {this._renderButtonGroup()}
            </Col>
            <Col md={6}>
                {this._renderAdType()}
                {this._renderCompanionAd()}
            </Col>
          </Row>
          <div className="clearfix"></div>
        </div>
      </div>
    )
  }
}

VastGenerator.propTypes = {
  clearOldVast: PropTypes.func,
  createVast: PropTypes.func,
  fetchVastData: PropTypes.func,
  loadVastFromFile: PropTypes.func,
  vast: PropTypes.object,
  vastConstantData: PropTypes.object
}

function mapStateToProps(state) {
  return {
    vast: state.vast,
    vastConstantData: state.vastData
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ createVast, fetchVastData, submitToS3, loadVastFromFile, clearOldVast }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(VastGenerator)
