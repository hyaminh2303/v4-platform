import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty, extend } from 'lodash'
import { Button, Row, Col, FormGroup, FormControl, ControlLabel, OverlayTrigger, Tooltip } from 'react-bootstrap'
import classNames from 'classnames'

import AdLocations from './ad_locations'
import AdGroupForm from './ad_group_form'
import Notification from '../../notification/'
import CampaignSteps from '../../campaigns/campaign_new/campaign_steps'
import { closeAlert } from '../../notification/notification_action'
import AdgroupAdtagScript from './adgroup_adtag_script'
import WeatherConditionTargeting from './weather_condition_targeting'
import DistanceConditionTargeting from './distance_condition_targeting'

import { clearAdGroup,
         newAdGroup,
         editAdGroup,
         saveAdGroup,
         checkAdLocation,
         resetAdGroupLocations,
         killAdGroupLocations } from '../ad_group_actions'

class AdGroupNew extends Component {
  constructor(props) {
    super(props)
    this._handleSave = this._handleSave.bind(this)
    this._handleFormSubmit = this._handleFormSubmit.bind(this)
    this.adGroupData = {}
    this.state = { isTargetDestination: false, conditionType: 'weather' }
  }

  componentWillMount() {
    const { newAdGroup, editAdGroup, campaignId,
            adGroupId, closeAlert } = this.props
    closeAlert()
    if (adGroupId) {
      editAdGroup(adGroupId)
    } else {
      newAdGroup(campaignId)
    }
  }

  componentWillUnmount() {
    this.props.clearAdGroup()
  }

  _isEdit() {
    if (this.props.adGroupId) {
      return true
    }
    return false
  }

  _handleSave() {
    this.formsValid = true
    this.refs.groupForm.submit()
    this.refs.addLocationForm.submit()
    this.refs.addLocationForm.submit()

    if (this.state.isConditionalTargeting) {
      if (this.refs.WeatherConditionTargetingForm) {
        this.refs.WeatherConditionTargetingForm.submit()
      }
      if (this.refs.DistanceConditionTargetingForm) {
        this.refs.DistanceConditionTargetingForm.submit()
      }
    }

    if (this.formsValid) {
      let wizard_str = this.props.wizard === '1' ? '?wizard=1' : ''
      this.props.saveAdGroup(this.adGroupData, wizard_str)
    }
  }

  _handleOnSelectFile(attachment) {
    this.props.closeAlert()
    this.props.checkAdLocation(attachment, this.state.isTargetDestination)
  }

  _renderTitle() {
    if (this.props.adGroupId)
      return `Edit AdGroup: ${this.props.adGroup.name}`
    else
      return 'New AdGroup'
  }

  _renderAdGroupBreadcrumb() {
    return (this.props.adGroupId ? 'Edit AdGroup' : 'New AdGroup')
  }

  _handleFormSubmit(data) {
    if (this.state.isConditionalTargeting) {
      data['condition_type'] = this.state.conditionType
    } else {
      data['condition_type'] = ''
    }
    this.adGroupData = extend({}, this.adGroupData, data)
  }

  _setTargetDestination(status) {
    const { adGroup } = this.props
    if (status === undefined && this.state.isTargetDestination === undefined)
      this.setState({isTargetDestination: adGroup.target_destination})
    else if (status !== undefined)
      this.setState({isTargetDestination: status})
  }

  _setConditionType(type) {
    const { adGroup, adGroupId } = this.props
    if (type === undefined && this.state.conditionType === undefined) {
      this.setState({conditionType: adGroupId && adGroup.condition_type ? adGroup.condition_type : 'weather'})
    } else if (type !== undefined) {
      this.setState({conditionType: type})
    }
  }

  _handleConditionalTargeting(status) {
    const { adGroup } = this.props
    if (status === undefined && this.state.isConditionalTargeting === undefined)
      this.setState({
        isConditionalTargeting: adGroup.condition_type ? true : false,
        conditionType: adGroup.condition_type
      })
    else if (status !== undefined)
      this.setState({isConditionalTargeting: status})
  }

  _renderConditionTargeting() {
    const { adGroup } = this.props
    if(this.state.conditionType == 'weather') {
      return (
        <WeatherConditionTargeting
          ref="WeatherConditionTargetingForm"
          onSubmitFail={() => this.formsValid = false}
          onSubmit={this._handleFormSubmit}
          adGroup={adGroup}
          initialValues={adGroup}/>
      )
    } else if (this.state.conditionType == 'distance') {
      return (
        <DistanceConditionTargeting
          ref="DistanceConditionTargetingForm"
          onSubmitFail={() => this.formsValid = false}
          onSubmit={this._handleFormSubmit}
          adGroup={adGroup}
          initialValues={adGroup}/>
      )
    }
  }

  _renderAdCondition() {
    const { adGroup, adtagScript } = this.props
    let weatherClassName = classNames('btn-weather', { 'active-button': this.state.conditionType == 'weather' })
    let distanceClassName = classNames('btn-distance', { 'active-button': this.state.conditionType == 'distance' })

   if(this.state.isConditionalTargeting)
      return (
        <div>
          <OverlayTrigger placement="top" overlay={<Tooltip id="cp-ad-tag">Weather condition</Tooltip>}>
            <Button
              bsStyle="success"
              bsSize="xsmall"
              style={{width: "100px"}}
              onClick={() => this._setConditionType('weather')}
              className={weatherClassName} >
              <i className="ace-icon fa fa-cloud bigger-110"/>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="cp-ad-tag">Distance condition</Tooltip>}>
            <Button
              style={{width: "100px", marginLeft: "10px"}}
              bsStyle="success"
              bsSize="xsmall"
              onClick={() => this._setConditionType('distance')}
              className={distanceClassName} >
              <i className="ace-icon fa fa-map-marker bigger-110"/>
            </Button>
          </OverlayTrigger>
          <AdgroupAdtagScript adtagScript={adtagScript} />
          {this._renderConditionTargeting()}
        </div>
      )
  }

  render() {
    const { campaign, adGroup, wizard, countries } = this.props
    if (isEmpty(campaign))
      return <div></div>
    this._setTargetDestination()
    this._handleConditionalTargeting()
    this._setConditionType()
    return (
      <div className="campaign-new">
        <div className="breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="ace-icon fa fa-dashboard home-icon"/>
              <a href="#/dashboard">Dashboard</a>
            </li>
            <li>
              Campaign: <a href={`#/campaigns/${campaign.id}`}>{campaign.name}</a>
            </li>
            <li>{this._renderAdGroupBreadcrumb()}</li>
          </ul>
        </div>
        <div className="page-content">
          <div className="page-header">
            {wizard === '1' ? <CampaignSteps step="2" /> :
              <h1>{this._renderTitle()}</h1>}
          </div>
          <Notification />
          <AdGroupForm
            ref="groupForm"
            campaign={campaign}
            initialValues={adGroup}
            adGroup={adGroup}
            countries={countries}
            clearLocations={() => this.props.killAdGroupLocations()}
            onSelectFile={(attachment) => this._handleOnSelectFile(attachment)}
            isTargetDestination={this.state.isTargetDestination}
            setTargetDestination={(status) => this._setTargetDestination(status)}
            onSubmitFail={() => this.formsValid = false}
            onSubmit={this._handleFormSubmit}
            onResetAdGroupLocations = {() => this.props.resetAdGroupLocations()}/>
          {adGroup.locations === undefined ? <div className="mb15"></div> :
              <AdLocations
                ref="addLocationForm"
                onSubmitFail={() => this.formsValid = false}
                onSubmit={this._handleFormSubmit}
                adGroup={adGroup}
                isTargetDestination={this.state.isTargetDestination}
                initialValues={adGroup}/>

          }
          <div className="clearfix">
            <ul>
              <li>Transportation type: driving, walking, cycling, public transit</li>
            </ul>
          </div>
          <Row>
            <Col md={6}>
              <FormGroup className="checkbox-form">
                <Col sm={1}>
                  <FormControl type="checkbox" defaultChecked={this.state.isConditionalTargeting} onChange={(e) => this._handleConditionalTargeting(e.target.checked)}/>
                </Col>
                <Col componentClass={ControlLabel} className="checkbox-target" sm={11}>
                  Dynamic banner conditional targeting
                </Col>
              </FormGroup>
            </Col>
          </Row>
          { this._renderAdCondition() }
          <div className="clearfix form-actions">
            <div className="center">
            <span className="mr10">
              <Button type="submit" bsStyle="danger" bsSize="small"
                onClick={() => this._handleSave()}>
                <i className="ace-icon fa fa-check bigger-110"/>
                Save ad group
              </Button>
            </span>
              <Button href={`#/campaigns/${campaign.id}`} bsStyle="default" bsSize="small">
                <i className="ace-icon fa f bigger-110"/>
                Cancel new ad group
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AdGroupNew.propTypes = {
  adGroup: PropTypes.object,
  adGroupId: PropTypes.string,
  campaign: PropTypes.object,
  campaignId: PropTypes.string,
  checkAdLocation: PropTypes.func,
  clearAdGroup: PropTypes.func,
  closeAlert: PropTypes.func,
  countries: PropTypes.array,
  data: PropTypes.object,
  editAdGroup: PropTypes.func.isRequired,
  id: PropTypes.object,
  killAdGroupLocations: PropTypes.func,
  locations: PropTypes.array,
  newAdGroup: PropTypes.func.isRequired,
  resetAdGroupLocations: PropTypes.func.isRequired,
  saveAdGroup: PropTypes.func.isRequired,
  wizard: PropTypes.string
}

function mapStateToProps(state, ownProps) {
  const { query } = ownProps.location

  return {
    campaign: state.adGroup.campaign,
    countries: state.adGroup.countries,
    adGroup: state.adGroup.ad_group,
    adtagScript: state.adGroup.adtag_script,
    locations: state.adGroup.ad_group.locations,
    campaignId: ownProps.params.campaignId,
    adGroupId: ownProps.params.id,
    wizard: query.wizard
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ clearAdGroup, newAdGroup, editAdGroup,
    saveAdGroup, checkAdLocation, closeAlert, resetAdGroupLocations, killAdGroupLocations }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AdGroupNew)
