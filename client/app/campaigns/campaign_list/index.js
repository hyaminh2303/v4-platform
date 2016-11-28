import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { replace } from 'react-router-redux'
import CampaignTable from './campaign_table'
import * as CampaignActions from '../campaign_actions'
import { extend } from 'lodash'
import { Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap'
import Notification from '../../notification/'
import ExportRawdataModal from './../../components/export_rawdata_modal'
const queryString = require('query-string')
const moment = require('moment')

import BASE_API_URL from '../../config'

import 'fixed-data-table/dist/fixed-data-table.css'

export class CampaignList extends Component {
  constructor(props) {
    super(props)

    this.onSearchDelay = null
    this._handlePageChange = this._handlePageChange.bind(this)
    this._handleSortChange = this._handleSortChange.bind(this)
    this._handleDeleteCampaign = this._handleDeleteCampaign.bind(this)
    this._handleExportRawdata = this._handleExportRawdata.bind(this)
    this._handleCloseExportRawDataModal = this._handleCloseExportRawDataModal.bind(this)
    this._handleSubmitExportRawData = this._handleSubmitExportRawData.bind(this)

    this.state = { isOpenExport: false, currentCampaign: null, exportTitle: null }
  }

  componentWillMount() {
    const { initParams } = this.props
    this._refresh(initParams)
  }
  componentWillUnmount() {
    this.props.clearCampaigns()
  }

  _handleSubmitExportRawData(data) {
    window.open(`${BASE_API_URL}/campaign_reports/${this.state.currentCampaign.id}/export_raw_data?token=${this.props.session.auth_token}&start_date=${data.start_date}&end_date=${data.end_date}`)

    this.setState({ isOpenExport: false, currentCampaign: null, exportTitle: null })
  }

  _handleExportRawdata(campaign) {
    this.setState({ isOpenExport: true, currentCampaign: campaign,
                    exportTitle: `Campaign: ${campaign.name}` })
  }

  _handleCloseExportRawDataModal() {
    this.setState({ isOpenExport: false })
  }

  _handleDeleteCampaign(campaign_id) {
    this.props.deleteCampaign(campaign_id, () => {
      this._refresh(this.props.initParams)
    })
  }

  _handlePageChange(page) {
    this._refresh({ page: page })
  }

  _handleSortChange(columnKey, sortDir) {
    this._refresh({ page: 1, sort_by: columnKey, sort_dir: sortDir })
  }

  _handleSearch(query) {
    clearTimeout(this.onSearchDelay)
    this.onSearchDelay = setTimeout(function() {
      this._refresh({ page: 1, query: query })
    }.bind(this), 500)
  }

  _refresh(params) {
    const { initParams, replace, fetchCampaigns } = this.props

    if (params.query === undefined) {
      params.query = initParams.query || ''
    }
    params.page = params.page || initParams.page || 1

    params.sort_by = params.sort_by || initParams.sort_by || 'start_date'
    params.sort_dir = params.sort_dir || initParams.sort_dir || 'desc'

    const params_str = queryString.stringify(params)

    replace(`/campaigns?${params_str}`)
    fetchCampaigns(params)
  }

  render() {
    const { campaigns, initParams, session } = this.props

    let initialValuesExportRawData = {}
    if (this.state.currentCampaign !== null) {
      const { start_date, end_date } = this.state.currentCampaign
      initialValuesExportRawData = {
        start_date: moment(start_date).format('YYYY-MM-D'),
        end_date:  moment(end_date).format('YYYY-MM-D')
      }
    }
    return (
      <div className="campaign-list">
        <div className="breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="ace-icon fa fa-dashboard home-icon"/>
              <a href="#/dashboard">Dashboard</a>
            </li>
            <li className="active">Campaigns</li>
          </ul>
        </div>
        <div className="page-content">
          <div className="page-header text-danger">
            <h1>Campaigns</h1>
          </div>
          <Row>
            <Col md={3}>
              {
                this.props.session.role_key !== 'guest' ?
                  <Button bsStyle="danger" bsSize="sm" href="#/campaigns/new">
                    <i className="fa fa-plus-circle" /> New Campaign
                  </Button>
                  :
                  null
              }
            </Col>
            <Col md={5} mdOffset={4}>
              <InputGroup>
                <FormControl type="text"
                  defaultValue={this.props.location.query.query}
                  placeholder="Search campaign"
                  onChange={(e) => this._handleSearch(e.target.value)} />
                <InputGroup.Button>
                  <Button bsSize="sm"bsStyle="danger"><i className="fa fa-search"/></Button>
                </InputGroup.Button>
              </InputGroup>
            </Col>
          </Row>
          <div className="clearfix"></div>
          <Notification/>
          <CampaignTable
            campaigns={campaigns.data}
            page={campaigns.page}
            per_page={campaigns.per_page}
            total={campaigns.total}
            summaryCampaigns={campaigns.summary}
            sortBy={initParams.sort_by}
            sortDir={initParams.sort_dir}
            token={session.auth_token}
            session={session}
            onPageChange={this._handlePageChange}
            onSortChange={this._handleSortChange}
            onDeleteCampaign={this._handleDeleteCampaign}
            handleExportRawdata={this._handleExportRawdata}/>
          <div className="clearfix"></div>
          <ExportRawdataModal isOpen={this.state.isOpenExport}
            title={this.state.exportTitle}
            obj={this.state.currentCampaign}
            onExport={this._handleSubmitExportRawData}
            onClose={this._handleCloseExportRawDataModal}
            initialValues={initialValuesExportRawData}/>
        </div>
      </div>
    )
  }
}

CampaignList.propTypes = {
  campaigns: PropTypes.object,
  clearCampaigns: PropTypes.func,
  deleteCampaign: PropTypes.func,
  fetchCampaigns: PropTypes.func.isRequired,
  initParams: PropTypes.object,
  location: PropTypes.object,
  page: PropTypes.number,
  replace: PropTypes.func,
  session: PropTypes.object,
  sortBy: PropTypes.string
}

function select(state, ownProps) {
  const query = ownProps.location.query

  return {
    campaigns: state.campaigns,
    session: state.session,
    initParams: {
      page: (query.page ? parseInt(query.page) : 1),
      sort_by: query.sort_by || '',
      sort_dir: query.sort_dir || '',
      query: query.query || ''
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(extend({}, CampaignActions, { replace: replace }), dispatch)
}

export default connect(select, mapDispatchToProps)(CampaignList)