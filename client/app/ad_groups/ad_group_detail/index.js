import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Creatives from './creatives'
import CampaignSteps from '../../campaigns/campaign_new/campaign_steps'
import { clearAdGroup, fetchAdGroup,
         fetchDateTracking, sortDateTrackingClient, clearDateTrackingCreatives } from '../ad_group_actions'
import { fetchOsTracking, clearOsTracking,
         sortOsTrackingClient } from '../../operating_system/operating_system_actions'
import { clearCreatives, fetchCreatives, newCreative, editCreative,
         deleteCreative, sortClient } from '../../creatives/creative_actions'
import { fetchDevicesTracking, clearDevicesTrackingCreatives } from '../../devices/device_actions'
import { fetchLanguageTrackings, sortLanguages, clearLanguageTrackings } from '../../languages/language_actions'
import { sortLocationTrackings, fetchLocationTracking,
         clearLocationTracking } from '../../locations/location_action'
import { fetchAppNameTracking, sortAppName, clearAppNameTrackings } from '../../app_names/app_name_actions'
import { fetchCarrierNameTrackings, sortCarrierName,
         clearCarrierNameTrackings } from '../../carrier_names/carrier_name_actions'
import { sortExchangeTrackings, fetchExchangeTracking, clearExchangeTracking } from '../../exchanges/exchange_action'

import { Nav, NavItem } from 'react-bootstrap'
const queryString = require('query-string')
import { replace } from 'react-router-redux'

import Notification from '../../notification/'
import { closeAlert } from '../../notification/notification_action'
import AdGroupDate from './ad_group_date'
import AdGroupLocations from './ad_group_locations'
import AdGroupDevices from './ad_group_devices'
import AdGroupLanguages from './ad_group_languages'
import AdGroupAppNames from './ad_group_app_names'
import AdGroupCarrierNames from './ad_group_carrier_names'
import AdGroupExchanges from './ad_group_exchanges'
import { sortDevices } from '../../devices/device_actions'
import AdGroupOperatingSystems from './ad_group_operating_systems'

class AdGroupDetail extends Component {
  constructor(props) {
    super(props)
    const { location: { query: { tab } } } = this.props
    this.state = { currentTab: tab || 'creatives' }
    this._handleDeleteCreative = this._handleDeleteCreative.bind(this)
    this._handleSortChangeCreatives = this._handleSortChangeCreatives.bind(this)
    this._handleSortChangelocations = this._handleSortChangelocations.bind(this)
    this._handleSortChangeDateTracking = this._handleSortChangeDateTracking.bind(this)
    this._handleDevicesSortChange = this._handleDevicesSortChange.bind(this)
    this._handleSortChangeOsTracking = this._handleSortChangeOsTracking.bind(this)
    this._refreshLocationsTracking = this._refreshLocationsTracking.bind(this)
    this._handleLanguagesSortChange = this._handleLanguagesSortChange.bind(this)
    this._handleAppNameSortChange = this._handleAppNameSortChange.bind(this)
    this._handleCarrierNameSortChange = this._handleCarrierNameSortChange.bind(this)
    this._handleExchangesSortChange = this._handleExchangesSortChange.bind(this)
  }

  componentWillMount() {
    const { fetchAdGroup, adGroupId } = this.props
    const { currentTab } = this.state
    fetchAdGroup(adGroupId)
    if (currentTab === 'creatives')
      this._refreshCreatives({ tab: 'creatives' })
    else if (currentTab === 'date')
      this._refreshDateTracking()
    else if (currentTab === 'locations')
      this._refreshLocationsTracking()
    else if (currentTab === 'os')
      this._refreshOsTracking()
    else if (currentTab === 'devices')
      this._refreshDevicesTracking()
    else if (currentTab === 'languages')
      this._refreshLanguagesTracking()
    else if (currentTab === 'appNames')
      this._refreshAppNameTracking()
    else if (currentTab === 'carrierNames')
      this._refreshCarrierNameTracking()
    else if (currentTab === 'exchanges')
      this._refreshExchangesTracking()
  }

  componentWillUnmount() {
    this.props.clearAdGroup()
  }

  _handleSortChangeDateTracking(trackingData, columnKey = undefined,
    sortDir = undefined) {
    const { query } = this.props.location
    columnKey = (columnKey !== undefined) ? columnKey
      : query.sort_by
    sortDir = (sortDir !== undefined) ? sortDir
      : query.sort_dir

    this.props.replace(`/ad_groups/${this.props.adGroupId}?sort_by=${columnKey}&sort_dir=${sortDir}&tab=date`)

    this.props.sortDateTrackingClient(trackingData, columnKey, sortDir)
  }

  _handleSortChangeCreatives(creatives, columnKey = undefined,
    sortDir = undefined) {
    // default for refresh page sorting
    const { query } = this.props.location
    columnKey = (columnKey !== undefined) ? columnKey
      : query.sort_by
    sortDir = (sortDir !== undefined) ? sortDir
      : query.sort_dir
    // -----

    this.props.replace(`/ad_groups/${this.props.adGroupId}?sort_by=${columnKey}&sort_dir=${sortDir}&tab=creatives`)

    this.props.sortClient(creatives, columnKey, sortDir)
  }

  _handleSortChangelocations(locations, columnKey = undefined, sortDir = undefined) {
    const { query } = this.props.location
    columnKey = (columnKey !== undefined) ? columnKey
      : query.sort_by
    sortDir = (sortDir !== undefined) ? sortDir
      : query.sort_dir

    this.props.replace(`/ad_groups/${this.props.adGroupId}?sort_by=${columnKey}&sort_dir=${sortDir}&tab=locations`)

    this.props.sortLocationTrackings(locations, columnKey, sortDir)

  }

  _handleSortChangeOsTracking(trackingData, columnKey = undefined,
    sortDir = undefined) {
    const { query } = this.props.location
    columnKey = (columnKey !== undefined) ? columnKey
      : query.sort_by
    sortDir = (sortDir !== undefined) ? sortDir
      : query.sort_dir

    this.props.replace(`/ad_groups/${this.props.adGroupId}?sort_by=${columnKey}&sort_dir=${sortDir}&tab=os`)
    this.props.sortOsTrackingClient(trackingData, columnKey, sortDir)
  }

  _handleDevicesSortChange(devices, columnKey = undefined, sortDir = undefined) {
    const { query } = this.props.location
    columnKey = (columnKey !== undefined) ? columnKey
      : query.sort_by
    sortDir = (sortDir !== undefined) ? sortDir
      : query.sort_dir

    this.props.replace(`/ad_groups/${this.props.adGroupId}?sort_by=${columnKey}&sort_dir=${sortDir}&tab=devices`)

    this.props.sortDevices(devices, columnKey, sortDir)
  }

  _handleLanguagesSortChange(languages, columnKey = undefined, sortDir = undefined) {
    const { query } = this.props.location
    columnKey = (columnKey !== undefined) ? columnKey
      : (query.sort_by ? query.sort_by : 'views')
    sortDir = (sortDir !== undefined) ? sortDir
      : (query.sort_dir ? query.sort_dir : 'desc')

    this.props.replace(`/ad_groups/${this.props.adGroupId}?sort_by=${columnKey}&sort_dir=${sortDir}&tab=languages`)

    this.props.sortLanguages(languages, columnKey, sortDir)
  }

  _handleAppNameSortChange(appNames, columnKey = undefined, sortDir = undefined) {
    const { query } = this.props.location
    columnKey = (columnKey !== undefined) ? columnKey
      : (query.sort_by ? query.sort_by : 'views')
    sortDir = (sortDir !== undefined) ? sortDir
      : (query.sort_dir ? query.sort_dir : 'desc')

    this.props.replace(`/ad_groups/${this.props.adGroupId}?sort_by=${columnKey}&sort_dir=${sortDir}&tab=appNames`)

    this.props.sortAppName(appNames, columnKey, sortDir)
  }

  _handleCarrierNameSortChange(carrierNames, columnKey = undefined, sortDir = undefined) {
    const { query } = this.props.location
    columnKey = (columnKey !== undefined) ? columnKey
      : (query.sort_by ? query.sort_by : 'views')
    sortDir = (sortDir !== undefined) ? sortDir
      : (query.sort_dir ? query.sort_dir : 'desc')

    this.props.replace(`/ad_groups/${this.props.adGroupId}?sort_by=${columnKey}&sort_dir=${sortDir}&tab=carrierNames`)

    this.props.sortCarrierName(carrierNames, columnKey, sortDir)
  }

  _handleExchangesSortChange(exchanges, columnKey = undefined, sortDir = undefined) {
    const { query } = this.props.location
    columnKey = (columnKey !== undefined) ? columnKey
      : (query.sort_by ? query.sort_by : 'ctr')
    sortDir = (sortDir !== undefined) ? sortDir
      : (query.sort_dir ? query.sort_dir : 'desc')

    this.props.replace(`/ad_groups/${this.props.adGroupId}?sort_by=${columnKey}&sort_dir=${sortDir}&tab=exchanges`)

    this.props.sortExchangeTrackings(exchanges, columnKey, sortDir)
  }

  _handleDeleteCreative(creative) {
    this.props.deleteCreative(creative, () => {
      this._refreshCreatives()
    })
  }

  _refreshCreatives(params = {}) {
    this.props.clearCreatives()
    this._replaceUrl(params)
    this.props.fetchCreatives(this.props.adGroupId, params,
      this._handleSortChangeCreatives)
  }

  _refreshDevicesTracking(params = {}) {
    this.props.clearDevicesTrackingCreatives()
    this._replaceUrl(params)
    this.props.fetchDevicesTracking(this.props.adGroupId, this._handleDevicesSortChange)
  }

  _refreshDateTracking(params = {}) {
    this.props.clearDateTrackingCreatives()
    this._replaceUrl(params)
    this.props.fetchDateTracking(this.props.adGroupId, this._handleSortChangeDateTracking)
  }

  _refreshOsTracking(params = {}) {
    this.props.clearOsTracking()
    this._replaceUrl(params)
    this.props.fetchOsTracking(this.props.adGroupId, this._handleSortChangeOsTracking)
  }

  _refreshLocationsTracking(params = {}) {
    this.props.clearLocationTracking()
    this._replaceUrl(params)
    this.props.fetchLocationTracking(this.props.adGroupId, this._handleSortChangelocations)
  }

  _refreshLanguagesTracking(params = {}) {
    this.props.clearLanguageTrackings()
    this._replaceUrl(params)
    this.props.fetchLanguageTrackings(this.props.adGroupId, this._handleLanguagesSortChange)
  }

  _refreshAppNameTracking(params = {}) {
    this.props.clearAppNameTrackings()
    this._replaceUrl(params)
    this.props.fetchAppNameTracking(this.props.adGroupId, this._handleAppNameSortChange)
  }

  _refreshCarrierNameTracking(params = {}) {
    this.props.clearCarrierNameTrackings()
    this._replaceUrl(params)
    this.props.fetchCarrierNameTrackings(this.props.adGroupId, this._handleCarrierNameSortChange)
  }

  _refreshExchangesTracking(params = {}) {
    this.props.clearExchangeTracking()
    this._replaceUrl(params)
    this.props.fetchExchangeTracking(this.props.adGroupId, this._handleExchangesSortChange)
  }

  _handleSelect(key) {
    this._replaceUrl({ tab: key, sort_dir: '', sort_by: '' })
    this.setState({ currentTab: key })
    if (key === 'creatives')
      this._refreshCreatives({ tab: 'creatives' })
    else if (key === 'date')
      this._refreshDateTracking({ tab: 'date' })
    else if (key === 'locations')
      this._refreshLocationsTracking({ tab: 'locations' })
    else if (key === 'os')
      this._refreshOsTracking({ tab: 'os' })
    else if (key === 'devices')
      this._refreshDevicesTracking({ tab: 'devices' })
    else if (key === 'languages')
      this._refreshLanguagesTracking({ tab: 'languages' })
    else if (key === 'appNames')
      this._refreshAppNameTracking({ tab: 'appNames' })
    else if (key === 'carrierNames')
      this._refreshCarrierNameTracking({ tab: 'carrierNames' })
    else if (key === 'exchanges')
      this._refreshExchangesTracking({ tab: 'exchanges' })
  }

  _replaceUrl(params) {
    const { initParams } = this.props
    params.sort_by = (params.sort_by !== undefined) ? params.sort_by
      : initParams.sortBy
    params.sort_dir = (params.sort_dir !== undefined) ? params.sort_dir
      : initParams.sortDir

    const params_str = queryString.stringify(params)

    this.props.replace(`/ad_groups/${this.props.adGroupId}?${params_str}`)
  }

  _renderTabContent() {
    const { adGroup, adGroupId, creatives, closeAlert, summaryCreatives,
      dateTrackingData, devices, locationTrackings, session, editCreative,
      newCreative, totalDevices, osTrackingData, initParams: { sortDir, sortBy } } = this.props
    const { currentTab } = this.state

    if (currentTab === 'creatives')
      return (
        <Creatives
          session={session}
          adGroupId={adGroupId}
          adGroup={adGroup}
          creatives={creatives}
          closeAlert={closeAlert}
          deleteCreative={this._handleDeleteCreative}
          editCreative={editCreative}
          onSortChange={this._handleSortChangeCreatives}
          sortDir={sortDir}
          sortBy={sortBy}
          newCreative={newCreative}
          summaryCreatives={summaryCreatives}/>
      )
    else if (this.state.currentTab === 'date')
      return (
        <AdGroupDate
          dateTrackingData={dateTrackingData}
          onSortChange={this._handleSortChangeDateTracking}
          summary={adGroup.tracking_result}
          sortDir={sortDir}
          sortBy={sortBy}/>
      )
    else if (currentTab === 'locations')
      return (
        <AdGroupLocations
          locationTrackings = {locationTrackings.data}
          total = {locationTrackings.total}
          sortDir={sortDir}
          sortBy={sortBy}
          onSortLocationChange={this._handleSortChangelocations} />
      )
    else if (currentTab === 'devices')
      return (
        <AdGroupDevices
          onSortDeviceChange = {this._handleDevicesSortChange}
          devices={devices}
          totalDevices={totalDevices}
          sortDir={sortDir}
          sortBy={sortBy} />
      )
    else if (currentTab === 'os')
      return (
        <AdGroupOperatingSystems
          osTrackingData={osTrackingData}
          onSortChange={this._handleSortChangeOsTracking}
          sortDir={sortDir}
          sortBy={sortBy}/>
      )
    else if (currentTab === 'languages')
      return (
        <AdGroupLanguages
          onSortLanguagesChange={this._handleLanguagesSortChange}
          languages={this.props.languageTrackings.data}
          totalLanguages={this.props.languageTrackings.total}
          sortDir={sortDir}
          sortBy={sortBy}/>
      )
    else if (currentTab === 'appNames')
      return (
        <AdGroupAppNames
          onSortAppNameChange={this._handleAppNameSortChange}
          appNames={this.props.appNameTrackings.data}
          totalAppNames={this.props.appNameTrackings.total}
          sortDir={sortDir}
          sortBy={sortBy}/>
      )
    else if (currentTab === 'carrierNames')
      return (
        <AdGroupCarrierNames
          onSortCarrierNameChange={this._handleCarrierNameSortChange}
          carrierNames={this.props.carrierNameTrackings.data}
          totalCarrierNames={this.props.carrierNameTrackings.total}
          sortDir={sortDir}
          sortBy={sortBy}/>
      )
    else if (currentTab === 'exchanges')
      return (
        <AdGroupExchanges
          onSortExchangeChange={this._handleExchangesSortChange}
          exchangeTrackings={this.props.exchangeTrackings.data}
          total={this.props.exchangeTrackings.total}
          sortDir={sortDir}
          sortBy={sortBy}/>
      )
  }

  render() {
    const { adGroup, wizard } = this.props
    return (
      <div className="ad-group-detail">
        <div className="breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="ace-icon fa fa-dashboard home-icon"/>
              <a href="#/dashboard">Dashboard</a>
            </li>
            <li>
              Campaign: <a href={`#/campaigns/${adGroup.campaign_id}`}>{adGroup.campaign_name}</a>
            </li>
            <li> Ad Group: {adGroup.name} </li>
          </ul>
        </div>
        <div className="page-content">
          <div className="page-header">
            {wizard === '1' ? <CampaignSteps step="3" /> :
              <h1>Ad Group: {adGroup.name}</h1>}
          </div>
          <Notification />

        <Nav bsStyle="tabs" activeKey={this.state.currentTab}
          onSelect={(key) => { this._handleSelect(key) }}>
          <NavItem eventKey="creatives" title="Creatives">Creatives</NavItem>
          <NavItem eventKey="date" title="Date">Date</NavItem>
          <NavItem eventKey="locations" title="Locations">Locations</NavItem>
          <NavItem eventKey="os" title="os">OS</NavItem>
          <NavItem eventKey="devices" title="Devices">Devices</NavItem>
          <NavItem eventKey="languages" title="Languages">Languages</NavItem>
          <NavItem eventKey="appNames" title="App Name">App Name</NavItem>
          <NavItem eventKey="carrierNames" title="Carrier Name">Carrier Name</NavItem>
          <NavItem eventKey="exchanges" title="Exchange Name">Exchange Name</NavItem>
        </Nav>
        <div className="tab-content">
          {this._renderTabContent()}
        </div>
        </div>
      </div>
    )
  }
}


function mapStateToProps(state, ownProps) {
  const { query } = ownProps.location
  return {
    adGroup: state.adGroup,
    adGroupId: ownProps.params.id,
    devices: state.devices.data,
    totalDevices: state.devices.total,
    creatives: state.creatives.data,
    dateTrackingData: state.adGroupDateTracking,
    languageTrackings: state.languageTrackings,
    osTrackingData: state.adGroupOsTracking,
    session: state.session,
    summaryCreatives: state.creatives.summary,
    wizard: query.wizard,
    locationTrackings: state.locationTrackings,
    appNameTrackings: state.appNameTrackings,
    carrierNameTrackings: state.carrierNameTrackings,
    exchangeTrackings: state.exchangeTrackings,
    initParams: {
      sortBy: query.sort_by || '',
      sortDir: query.sort_dir || ''
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearAdGroup,
    clearCreatives,
    clearDateTrackingCreatives,
    clearOsTracking,
    clearLocationTracking,
    closeAlert,
    deleteCreative,
    editCreative,
    fetchAdGroup,
    fetchCreatives,
    fetchDateTracking,
    fetchOsTracking,
    sortClient,
    sortDateTrackingClient,
    sortLocationTrackings,
    sortOsTrackingClient,
    replace,
    fetchDevicesTracking,
    clearDevicesTrackingCreatives,
    sortDevices,
    fetchLocationTracking,
    newCreative,
    fetchLanguageTrackings,
    sortLanguages,
    clearLanguageTrackings,
    fetchAppNameTracking,
    sortAppName,
    clearAppNameTrackings,
    fetchCarrierNameTrackings,
    sortCarrierName,
    clearCarrierNameTrackings,
    sortExchangeTrackings,
    fetchExchangeTracking,
    clearExchangeTracking
  }, dispatch)
}

AdGroupDetail.propTypes = {
  adGroup: PropTypes.object,
  adGroupId: PropTypes.string,
  appNameTrackings: PropTypes.object,
  carrierNameTrackings: PropTypes.object,
  clearAdGroup: PropTypes.func,
  clearAppNameTrackings: PropTypes.func.isRequired,
  clearCarrierNameTrackings: PropTypes.func.isRequired,
  clearCreatives: PropTypes.func,
  clearDateTrackingCreatives: PropTypes.func,
  clearDevicesTrackingCreatives: PropTypes.func,
  clearExchangeTracking: PropTypes.func,
  clearLanguageTrackings: PropTypes.func,
  clearLocationTracking: PropTypes.func,
  clearOsTracking: PropTypes.func,
  closeAlert: PropTypes.func,
  creatives: PropTypes.array,
  dateTrackingData: PropTypes.object,
  deleteCreative: PropTypes.func,
  devices: PropTypes.array,
  editCreative: PropTypes.func,
  exchangeTrackings: PropTypes.object,
  fetchAdGroup: PropTypes.func.isRequired,
  fetchAppNameTracking: PropTypes.func.isRequired,
  fetchCarrierNameTrackings: PropTypes.func.isRequired,
  fetchCreatives: PropTypes.func.isRequired,
  fetchDateTracking: PropTypes.func,
  fetchDevicesTracking: PropTypes.func,
  fetchExchangeTracking: PropTypes.func,
  fetchLanguageTrackings: PropTypes.func,
  fetchLocationTracking: PropTypes.func,
  fetchOsTracking: PropTypes.func,
  initParams: PropTypes.object,
  languageTrackings: PropTypes.object,
  location: PropTypes.object,
  locationTrackings: PropTypes.object,
  newCreative: PropTypes.func.isRequired,
  osTrackingData: PropTypes.object,
  replace: PropTypes.func,
  session: PropTypes.object,
  sortAppName: PropTypes.func.isRequired,
  sortCarrierName: PropTypes.func.isRequired,
  sortClient: PropTypes.func,
  sortDateTrackingClient: PropTypes.func,
  sortDevices: PropTypes.func,
  sortExchangeTrackings: PropTypes.func,
  sortLanguages: PropTypes.func,
  sortLocationTrackings: PropTypes.func,
  sortOsTrackingClient: PropTypes.func,
  summaryCreatives: PropTypes.object,
  totalDevices: PropTypes.object,
  wizard: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(AdGroupDetail)
