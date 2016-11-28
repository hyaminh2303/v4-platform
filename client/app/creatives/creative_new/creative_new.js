import React, { Component, PropTypes } from 'react'
import { Accordion, Panel, Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CreativeSetting from './creative_setting'
import DynamicBannerDesign from './dynamic_banner_design'
import MacroSetting from './macro_setting'
import GenerateAdTag from './generate_ad_tag'

import {
  saveCreative, fetchCreatives,
  addElement, updateElement, deleteElement,
  fetchFonts, selectElement, deselectElement, fetchTimeFormats } from '../creative_actions'
import { closeAlert } from '../../notification/notification_action'
import Notification from '../../notification/'
import { TRACKING_TYPES } from '../../app_constants'

class CreativeNew extends Component {
  constructor(props) {
    super(props)
    this._handleSave = this._handleSave.bind(this)
    this._handleOnChangePanel = this._handleOnChangePanel.bind(this)
    this._lockPannel = this._lockPannel.bind(this)
  }

  componentWillMount() {
    this.props.fetchFonts()
    this.props.fetchTimeFormats()
  }

  _isDynamicBanner() {
    return this.props.creative.creative_type === 'dynamic'
  }

  _handleSave(creative, currentStep = '1', callback = null) {
    creative.ad_group_id = this.props.adGroupId
    let nextStep
    this.props.saveCreative(creative, (updatedCreative) => {
      if (currentStep === '1') {
        nextStep = updatedCreative.creative_type === 'dynamic' ? '2' : '3'
      } else if (currentStep === '2') {
        nextStep = '3'
      } else if (currentStep === '3') {
        nextStep = '4'
      }
      this.props.onHandleCreative(updatedCreative, nextStep)
      this.props.fetchCreatives(this.props.adGroupId)
      this.props.closeAlert()
      if (callback) {
        callback()
      }
    })
  }

  _lockPannel(activeKey) {
    const { creative: { elements }, creative } = this.props
    return (
      (activeKey === '4') ||
      (activeKey === '2' && !creative.id) ||
      (activeKey === '3' && !creative.id) ||
      (activeKey === '3' && creative.creative_type === 'dynamic' &&
        (
          elements[0].text === '' ||
          elements[0].x === '' ||
          elements[0].y === '' ||
          elements[0].font === '' ||
          elements[0].font_size === '' ||
          elements[0].color === ''
        )
      )
    )
  }

  _handleOnChangePanel(activeKey) {
    if (this._lockPannel(activeKey))
      return false
    this.props.onChangePanel(activeKey)
  }

  _generateAdTagTittle() {
    if (this.props.currentTracker === TRACKING_TYPES.tracking_link)
      return 'Generate Tracking Urls'
    else
      return 'Generate Ad Tag'
  }

  render() {
    const { creative, adGroupId, fonts, timeFormats, addElement, updateElement, deleteElement,
      selectElement, deselectElement } = this.props
    let formName = 'Edit Creative'
    if (this.props.creative === undefined || this.props.creative.id === undefined) {
      formName = 'New Creative'
    }
    return (
      <Modal
        show={this.props.isOpen} bsSize="large" backdrop="static"
        onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion activeKey={this.props.activeKey} onSelect={this._handleOnChangePanel}>
              <Notification />
              <Panel header="Creative Settings" eventKey="1">
              <CreativeSetting
                initialValues={creative}
                onSave={this._handleSave}
                adGroupId={adGroupId}
              />
            </Panel>
            {
              this._isDynamicBanner() ?
                <Panel header="Dynamic Banner Design" eventKey="2">
                  <DynamicBannerDesign
                    creative={creative}
                    onSave={this._handleSave}
                    addElement={addElement}
                    updateElement={updateElement}
                    deleteElement={deleteElement}
                    selectElement={selectElement}
                    deselectElement={deselectElement}
                    adGroupId={adGroupId}
                    fonts={fonts}
                    timeFormats={timeFormats}
                    session={this.props.session}/>
                </Panel>
              :
                <div className="mb5"></div>
            }
            <Panel header="Ad Tracker" eventKey="3">
              <MacroSetting
                initialValues={creative}
                creative={creative}
                onSave={this._handleSave}
                adGroupId={adGroupId}
                onChangeTracker={this.props.onChangeTracker}/>
            </Panel>
            <Panel header={this._generateAdTagTittle()} eventKey="4">
              <GenerateAdTag creative={creative}
                onClose={this.props.onClose}/>
            </Panel>
          </Accordion>
        </Modal.Body>
      </Modal>
    )
  }
}

CreativeNew.propTypes = {
  activeKey: PropTypes.string,
  adGroupId: PropTypes.string,
  addElement: PropTypes.func,
  closeAlert: PropTypes.func,
  creative: PropTypes.object,
  creativeId: PropTypes.string,
  currentTracker: PropTypes.string,
  deleteElement: PropTypes.func,
  deselectElement: PropTypes.func.isRequired,
  fetchCreatives: PropTypes.func.isRequired,
  fetchFonts: PropTypes.func.isRequired,
  fetchTimeFormats: PropTypes.func.isRequired,
  fonts: PropTypes.array,
  isOpen: PropTypes.bool.isRequired,
  onChangePanel: PropTypes.func.isRequired,
  onChangeTracker: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onHandleCreative: PropTypes.func.isRequired,
  saveCreative: PropTypes.func.isRequired,
  selectElement: PropTypes.func.isRequired,
  session: PropTypes.object,
  timeFormats: PropTypes.array.isRequired,
  updateElement: PropTypes.func
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ saveCreative, fetchCreatives, closeAlert,
    fetchFonts, addElement, updateElement, deleteElement, selectElement,
    fetchTimeFormats, deselectElement }, dispatch)
}

function mapStateToProps(state) {
  return {
    fonts: state.fonts.fonts,
    timeFormats: state.timeFormats.time_formats,
    creative: state.creative
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreativeNew)
