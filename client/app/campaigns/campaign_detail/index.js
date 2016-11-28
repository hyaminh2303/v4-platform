import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { replace } from 'react-router-redux'
const queryString = require('query-string')
import { Row, Col, Button } from 'react-bootstrap'
import { filter, includes } from 'lodash'

import { clearCampaign, fetchCampaign } from '../campaign_actions'
import { clearAdGroups, fetchAdGroups, sortAdGroups } from '../../ad_groups/ad_group_actions'
import AdGroups from '../../ad_groups/ad_group_list'
import AdGroupSearchBar from '../../ad_groups/ad_group_list/ad_group_search_bar'
import Notification from '../../notification/'
import GenerateLocationPopup from './generate_location_popup'
import BASE_API_URL from '../../config'

export class CampaignDetail extends Component {
  constructor(props) {
    super(props)

    this._handleSearch = this._handleSearch.bind(this)
    this._handleSortChange = this._handleSortChange.bind(this)
    this._handleGenerateLocationPopUp = this._handleGenerateLocationPopUp.bind(this)
    this._handleSubmitGenerateLocation = this._handleSubmitGenerateLocation.bind(this)
    this._setTypeGenerate = this._setTypeGenerate.bind(this)

    this.state = { showGenerateLocationPopup: false, typeGenerate: 'campaign', generateReportadGroupIds: [] }
  }

  componentWillMount() {
    const { campaignId, fetchCampaign, initParams } = this.props
    fetchCampaign(campaignId)
    this._refresh(initParams)
  }

  componentWillUnmount() {
    this.props.clearCampaign()
    this.props.clearAdGroups()
  }

  _handleClickButtonGenerateLocation() {
    this._setTypeGenerate('campaign', [])
    this._handleGenerateLocationPopUp(true)
  }

  _handleSearch(params) {
    params.page = 1
    this._refresh(params)
  }

  _handleSortChange(adGroups, columnKey, sortDir) {
    const { initParams, replace, campaignId, sortAdGroups } = this.props
    let params = { sort_by: columnKey || initParams.sort_by,
                   sort_dir: sortDir || initParams.sort_dir }
    if (params.query === undefined) {
      params.query = initParams.query || ''
    }
    let params_str = queryString.stringify(params)
    replace(`/campaigns/${campaignId}?${params_str}`)

    sortAdGroups(adGroups, params.sort_by, params.sort_dir)
  }

  _refresh(params) {
    const { initParams, fetchAdGroups, campaignId, replace } = this.props

    if (params.query === undefined) {
      params.query = initParams.query || ''
    }

    params.sort_by = params.sort_by || initParams.sort_by
    params.sort_dir = params.sort_dir || initParams.sort_dir
    let params_str = queryString.stringify(params)
    replace(`/campaigns/${campaignId}?${params_str}`)

    fetchAdGroups(campaignId, params)
  }

  _handleGenerateLocationPopUp(isShow = true) {
    this.setState({ showGenerateLocationPopup: isShow })
  }

  _handleSubmitGenerateLocation(data) {
    const { campaign, session } = this.props
    window.open(`${BASE_API_URL}/campaigns/${campaign.id}/generate_location_report` +
      `?token=${session.auth_token}&total_view=${data.totalView}` +
      `&total_click=${data.totalClick}&type=${this.state.typeGenerate}` + this._buildAdGroupGenerateParams(data.groups))
    this._handleGenerateLocationPopUp(false)
  }

  _buildAdGroupGenerateParams(adgroups) {
    if (this.state.typeGenerate !== 'campaign') {
      let url = ''
      adgroups.map((group) => {
        url += `&groups[${group.id}][total_view]=${group.totalView}` +
               `&groups[${group.id}][total_click]=${group.totalClick}`
      })
      return `${url}`
    } else {
      return ''
    }
  }

  _setTypeGenerate(type, adgroupIds) {
    this.setState({ typeGenerate: type, generateReportadGroupIds: adgroupIds })
  }

  _getAdGroupGenerate() {
    const { adGroups: { data } } = this.props
    const { generateReportadGroupIds } = this.state

    if (generateReportadGroupIds.length > 0) {
      let result = filter(data, function(group) {
        return includes(generateReportadGroupIds, group.id)
      })
      return { groups: result }
    } else {
      return { groups: data }
    }
  }

  render() {
    const { campaign, adGroups, initParams, session } = this.props
    return (
      <div className="campaign-new">
        <div className="breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="ace-icon fa fa-dashboard home-icon"/>
              <a href="#/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="#/campaigns">Campaigns</a>
            </li>
            <li className="active">{campaign.name}</li>
          </ul>
        </div>
        <div className="page-content">
          <div className="page-header">
            <h1>Campaign: {campaign.name}</h1>
          </div>
          <Notification />
          <Row>
            {
              session.role_key === 'guest' ?
                <Col md={6}/>
                :
                <Col md={6}>
                  <Button bsStyle="danger" bsSize="sm" href={`#/campaigns/${campaign.id}/ad_groups/new`}>
                    <i className="fa fa-plus-circle"/> New Ad Group
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button bsStyle="success" bsSize="sm" onClick={() => this._handleClickButtonGenerateLocation()}>
                    Generate Location Report
                  </Button>
                </Col>
            }
            <Col md={6} >
              <AdGroupSearchBar onSearch={this._handleSearch} query={initParams.query} />
            </Col>
          </Row>
          <div className="clearfix"></div>
          {this.state.showGenerateLocationPopup ?
              <GenerateLocationPopup
                onHandleSubmit={this._handleSubmitGenerateLocation}
                onClose={() => this._handleGenerateLocationPopUp(false)}
                typeGenerate={this.state.typeGenerate}
                setTypeGenerate={this._setTypeGenerate}
                generateReportadGroupIds={this.state.generateReportadGroupIds}
                initialValues={this._getAdGroupGenerate()}
                isOpen={this.state.showGenerateLocationPopup} /> : ''}

          {adGroups.data.length !== 0 ?
            <AdGroups campaign={campaign}
              groups={adGroups.data}
              total={adGroups.total}
              onSortChange={this._handleSortChange}
              token={this.props.session.auth_token}
              sortDir={initParams.sort_dir}
              onGenerateLocationPopUp={this._handleGenerateLocationPopUp}
              setTypeGenerate={this._setTypeGenerate}
              sortBy={initParams.sort_by}/> : ''}
          <div className="clearfix"></div>
        </div>
      </div>
    )
  }
}

CampaignDetail.propTypes = {
  adGroups: PropTypes.object,
  campaign: PropTypes.object.isRequired,
  campaignId: PropTypes.string.isRequired,
  clearAdGroups: PropTypes.func,
  clearCampaign: PropTypes.func,
  fetchAdGroups: PropTypes.func,
  fetchCampaign: PropTypes.func,
  initParams: PropTypes.object,
  replace: PropTypes.func,
  session: PropTypes.object,
  sortAdGroups: PropTypes.func
}

function mapStateToProps(state, ownProps) {
  const { query } = ownProps.location
  return {
    campaign: state.campaign,
    campaignId: ownProps.params.id,
    adGroups: state.adGroups,
    session: state.session,
    initParams: {
      query: query.query || '',
      page: query.page || 1,
      sort_by: query.sort_by || '',
      sort_dir: query.sort_dir || ''
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ clearCampaign, clearAdGroups,
    fetchCampaign, fetchAdGroups, replace, sortAdGroups }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CampaignDetail)
