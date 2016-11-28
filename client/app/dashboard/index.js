import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { replace } from 'react-router-redux'
import ReactHighcharts from 'react-highcharts'
import DateRangeSelect from '../components/date_range_picker'
import { Row, Col } from 'react-bootstrap'
import moment from 'moment'
const queryString = require('query-string')
import _ from 'lodash'
import { FormattedNumber } from 'react-intl'

import Notification from '../notification/'
import { fetchDashboardSummary } from './dashboard_actions'
import CampaignSelector from '../components/campaign_selector'
import './style.css'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this._handleSelectCampaign = this._handleSelectCampaign.bind(this)
    this._handleSelectDate = this._handleSelectDate.bind(this)
  }
  componentWillMount() {
    this._refresh()
  }
  _handleSelectCampaign(data) {
    this._refresh({ campaign_ids: data })
  }
  _handleSelectDate(startDate, endDate) {
    this._refresh({ start_date: startDate, end_date: endDate })
  }
  _refresh(params = {}) {
    const { initParams, replace } = this.props

    if (params.campaign_ids === undefined)
      params.campaign_ids = initParams.campaign_ids

    params.start_date = params.start_date || initParams.start_date
    params.end_date = params.end_date || initParams.end_date

    const url = `/dashboard?${queryString.stringify(params)}`
    replace(url)

    this.props.fetchDashboardSummary(params)
  }

  _chartData() {
    const { chartSummary } = this.props
    let result = { views: [], clicks: [],
      landed: [], date: [] }

    chartSummary.map((tracking) => {
      result.views.push(tracking.views)
      result.clicks.push(tracking.clicks)
      result.landed.push(tracking.landed)
      result.date.push(moment(tracking.date).format('MMM Do YY'))
    })
    return result
  }

  _chartConfig() {
    const chart = this._chartData()

    return {
      chart: {
        height: '300'
      },
      credits: {
        enabled: false
      },
      title: 'TITLE CHART',
      xAxis: {
        categories: chart.date
      },
      yAxis: [{
        labels: {
          format: '{value}'
        },
        title: {
          text: 'Views'
        },
        min: 0,
        showEmpty: false
      }, {
        title: {
          text: 'Clicks - Landed'
        },
        labels: {
          format: '{value}'
        },
        opposite: true,
        min: 0,
        showEmpty: false
      }],
      tooltip: {
        shared: true
      },
      series: [{
        name: 'Views',
        data: chart.views
      }, {
        yAxis: 1,
        name: 'Clicks',
        data: chart.clicks
      }, {
        yAxis: 1,
        name: 'Landed',
        data: chart.landed
      }]
    }
  }

  _renderContentSummary(summary) {
    let html = []
    let tail = []

    if (!_.isEmpty(summary)) {
      for (let key in summary) {
        if (_.lowerCase(key) === 'unknown') {
          tail.push(
            <tr key={`${key}-${_.random()}`}>
              <td>{key}</td>
              <td><FormattedNumber value={summary[key].views || 0} /></td>
              <td><FormattedNumber value={summary[key].clicks || 0} /></td>
              <td><FormattedNumber value={summary[key].ctr || 0} style="percent"
                minimumFractionDigits={2} maximumFractionDigits={2} /></td>
              <td><FormattedNumber value={summary[key].landed || 0} /></td>
              <td><FormattedNumber value={summary[key].drop_out || 0} style="percent"
                minimumFractionDigits={2} maximumFractionDigits={2} /></td>
            </tr>
          )
        } else {
          html.push(
            <tr key={`${key}-${_.random()}`}>
              <td>{key}</td>
              <td><FormattedNumber value={summary[key].views || 0} /></td>
              <td><FormattedNumber value={summary[key].clicks || 0} /></td>
              <td><FormattedNumber value={summary[key].ctr || 0} style="percent"
                minimumFractionDigits={2} maximumFractionDigits={2} /></td>
              <td><FormattedNumber value={summary[key].landed || 0} /></td>
              <td><FormattedNumber value={summary[key].drop_out || 0} style="percent"
                minimumFractionDigits={2} maximumFractionDigits={2} /></td>
            </tr>
          )
        }
      }
      html.push.apply(html, tail)
    } else {
      html.push(<tr key={_.random()}><td colSpan="6" className="text-center">No data</td></tr>)
    }

    return html
  }

  render() {
    if (this.props.chartSummary === undefined)
      return <div></div>

    const { initParams, allSummary, deviceOsSummary,
            countriesSummary, platformsSummary } = this.props
    return (
      <div className="user-list">
        <div className="breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="ace-icon fa fa-dashboard home-icon"/>
              <a href="#/dashboard">Dashboard</a>
            </li>
          </ul>
        </div>
        <div className="page-content">
          <div className="page-header">
            <h1> Dashboard </h1>
          </div>
          <Notification />
          <Row>
            <Col md={3}>
              <CampaignSelector
                options={this.props.campaignOptions}
                value={initParams.campaign_ids}
                onSelectCampaign={this._handleSelectCampaign}/>
            </Col>
            <Col md={3}>
              <DateRangeSelect onSelect={this._handleSelectDate}
                startDate={initParams.start_date}
                endDate={initParams.end_date}/>
            </Col>
          </Row>
          <br />
          <ReactHighcharts config = {this._chartConfig()} />
          <div className="clearfix"></div>
          <div className="dashboard-content-summary">
            <table className="table table-bordered table-striped">
              <thead className="thin-border-bottom">
                <tr>
                  <th>Views</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th>Landed</th>
                  <th>DropOut</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><FormattedNumber value={allSummary.views || 0} /></td>
                  <td><FormattedNumber value={allSummary.clicks || 0} /></td>
                  <td><FormattedNumber value={allSummary.ctr || 0} style="percent"
                    minimumFractionDigits={2} maximumFractionDigits={2} /></td>
                  <td><FormattedNumber value={allSummary.landed || 0} /></td>
                  <td><FormattedNumber value={allSummary.drop_out || 0} style="percent"
                    minimumFractionDigits={2} maximumFractionDigits={2} /></td>
                </tr>
              </tbody>
            </table>
            <div className="clearfix"></div>
            <h3>Network</h3>
            <table className="table table-bordered table-striped">
              <thead className="thin-border-bottom">
                <tr>
                  <th></th>
                  <th>Views</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th>Landed</th>
                  <th>DropOut</th>
                </tr>
              </thead>
              <tbody>
                {this._renderContentSummary(platformsSummary)}
              </tbody>
            </table>
            <div className="clearfix"></div>
            <h3>OS</h3>
            <table className="table table-bordered table-striped">
              <thead className="thin-border-bottom">
                <tr>
                  <th></th>
                  <th>Views</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th>Landed</th>
                  <th>DropOut</th>
                </tr>
              </thead>
              <tbody>
                {this._renderContentSummary(deviceOsSummary)}
              </tbody>
            </table>
            <div className="clearfix"></div>
            <h3>Country</h3>
            <table className="table table-bordered table-striped">
              <thead className="thin-border-bottom">
                <tr>
                  <th></th>
                  <th>Views</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th>Landed</th>
                  <th>DropOut</th>
                </tr>
              </thead>
              <tbody>
                {this._renderContentSummary(countriesSummary)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  allSummary: PropTypes.object,
  campaignOptions: PropTypes.array,
  chartSummary: PropTypes.array,
  countriesSummary: PropTypes.object,
  deviceOsSummary: PropTypes.object,
  fetchDashboard: PropTypes.func,
  fetchDashboardSummary: PropTypes.func,
  handleSubmit: PropTypes.func,
  initParams: PropTypes.object,
  platformsSummary: PropTypes.object,
  replace: PropTypes.func
}

function mapStateToProps(state, ownProps) {
  const query = ownProps.location.query

  return {
    allSummary: state.dashboardSummary.all,
    campaignOptions: state.dashboardSummary.campaign_options,
    chartSummary: state.dashboardSummary.chart,
    deviceOsSummary: state.dashboardSummary.device_os,
    countriesSummary: state.dashboardSummary.countries,
    platformsSummary: state.dashboardSummary.platforms,
    initParams: {
      campaign_ids: query.campaign_ids || '',
      start_date: query.start_date ||
        moment().subtract(29, 'days').format('DD MMM YY'),
      end_date: query.end_date || moment().format('DD MMM YY')
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchDashboardSummary,
    replace }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)