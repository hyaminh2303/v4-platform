import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import SortHeader from '../../components/sort_header/'
import { Pagination, DropdownButton } from 'react-bootstrap'
import { FormattedDate, FormattedNumber } from 'react-intl'

import BASE_API_URL from '../../config'

import Confirm from '../../confirm/confirm'
import './campaign_style.css'

class CampaignTable extends Component {
  constructor(props) {
    super(props)
    this.state = { showConfirm: false,
      titleConfirm: '',
      currentCampaign: null }

    this._handlePageChange = this._handlePageChange.bind(this)
    this._handleSortChange = this._handleSortChange.bind(this)
    this._handleConfirm = this._handleConfirm.bind(this)
  }
  _handleConfirm(status) {
    if (status) {
      this.props.onDeleteCampaign(this.state.currentCampaign.id)
    }
    this.setState({ showConfirm: false,
      titleConfirm: '' })
  }
  _openConfirm(campaign) {
    this.setState({ showConfirm: true,
      titleConfirm: `Are you sure you want to delete the campaign: ${campaign.name} ?`,
      currentCampaign: campaign })
  }
  _handlePageChange(page) {
    this.props.onPageChange(page)
  }

  _handleSortChange(columnKey, sortDir) {
    this.props.onSortChange(columnKey, sortDir)
  }

  _renderAdminDropdown(campaign, token) {
    let link = BASE_API_URL
    return (
      <DropdownButton
        bsStyle="default"
        bsSize="xs"
        title={<i className="fa fa-cogs"/>}
        id="campaign_actions"
        pullRight>
        <li>
          <a href={`${link}/campaign_reports/${campaign.id}/export_device_ids?token=${token}`} target="_blank">
            <i className="fa fa-file-text"/> Export Devices ID
          </a>
        </li>
        <li>
          <a onClick={() => this.props.handleExportRawdata(campaign)}>
            <i className="fa fa-file-text-o"/> Export Raw Data
          </a>
        </li>
        <li>
          <a href={`${link}/campaign_reports/${campaign.id}/export_analytic?token=${token}`} target="_blank">
            <i className="fa fa-file-text-o"/> Export Analytic Data
          </a>
        </li>
        <li>
          <Link to={`/campaigns/${campaign.id}/edit`}>
            <i className="fa fa-edit"/> Edit
          </Link>
        </li>
        <li>
          <a onClick={() => { this._openConfirm(campaign) }}>
            <i className="fa fa-trash"/> Delete
          </a>
        </li>
      </DropdownButton>
    )
  }

  _renderGuestDropdown(campaign) {
    return (
      <DropdownButton
        bsStyle="default"
        bsSize="xs"
        title={<i className="fa fa-cogs"/>}
        id="campaign_actions"
        pullRight>
        <li>
          <a onClick={() => this.props.handleExportRawdata(campaign)}>
            <i className="fa fa-file-text-o"/> Export Raw Data
          </a>
        </li>
      </DropdownButton>
    )
  }

  _renderRow(campaign, token) {

    return (
      <tr key={campaign.id}>
        <td> <i className={`fa fa-circle ${campaign.status_css}`}/></td>
        <td>
          <Link to={`/campaigns/${campaign.id}`}>
            {campaign.name}
          </Link>
        </td>
        <td className="text-uppercase">
          {campaign.campaign_type}
        </td>
        <td>
          <FormattedDate value={campaign.start_date}
            day="numeric" month="long" year="numeric"/>
        </td>
        <td>
          <FormattedDate value={campaign.end_date}
            day="numeric" month="long" year="numeric"/>
        </td>
        <td>
          <Link to={`/dashboard?campaign_ids=${campaign.id}`}>
            <FormattedNumber value={campaign.views || 0} />
          </Link>
        </td>
        <td>
          <Link to={`/dashboard?campaign_ids=${campaign.id}`}>
            <FormattedNumber value={campaign.clicks || 0} />
          </Link>
        </td>
        <td>
          <Link to={`/dashboard?campaign_ids=${campaign.id}`}>
            <FormattedNumber value={campaign.ctr || 0} style="percent"
              minimumFractionDigits={2} maximumFractionDigits={2} />
          </Link>
        </td>
        <td>
          <Link to={`/dashboard?campaign_ids=${campaign.id}`}>
            <FormattedNumber value={campaign.landed || 0} />
          </Link>
        </td>
        <td>
          <Link to={`/dashboard?campaign_ids=${campaign.id}`}>
            <FormattedNumber value={campaign.drop_out || 0} style="percent"
              minimumFractionDigits={2} maximumFractionDigits={2} />
          </Link>
        </td>
        <td>
          {
            this.props.session.role_key !== 'guest' ? this._renderAdminDropdown(campaign, token) :  this._renderGuestDropdown(campaign)
          }
        </td>
      </tr>
    )
  }
  _renderTotal() {
    const { campaigns, summaryCampaigns } = this.props
    if (campaigns.length > 0) {

      return (
        <tfoot>
          <tr>
            <td colSpan="4" className="text-right"><b>Total:</b></td>
            <td><b><FormattedNumber value={summaryCampaigns.views || 0} /></b></td>
            <td><b><FormattedNumber value={summaryCampaigns.clicks || 0} /></b></td>
            <td><b><FormattedNumber value={summaryCampaigns.ctr || 0} style="percent"
              minimumFractionDigits={2} maximumFractionDigits={2}/></b></td>
            <td><b><FormattedNumber value={summaryCampaigns.landed || 0} /></b></td>
            <td><b><FormattedNumber value={summaryCampaigns.drop_out || 0} style="percent"
              minimumFractionDigits={2} maximumFractionDigits={2}/></b></td>
            <td></td>
          </tr>
        </tfoot>
      )
    }
  }
  render() {
    const { campaigns, page, total, sortBy, sortDir, per_page, token } = this.props
    const sortDirs = { [sortBy]: sortDir }
    let total_page = Math.ceil(total / per_page)
    return (
      <div>
        <Confirm isShow={this.state.showConfirm}
          title={this.state.titleConfirm}
          onResult={this._handleConfirm}/>
        <table className="table table-bordered table-striped">
          <thead className="thin-border-bottom">
            <tr>
              <th />
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="name"
                  sortDir={sortDirs.name}>Name</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="campaign_type"
                  sortDir={sortDirs.campaign_type}>Type</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="start_date"
                  sortDir={sortDirs.start_date}>Start date</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="end_date"
                  sortDir={sortDirs.end_date}>End date</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="views"
                  sortDir={sortDirs.views}>Views</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="clicks"
                  sortDir={sortDirs.clicks}>Clicks</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="ctr"
                  sortDir={sortDirs.ctr}>CTR</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="landed"
                  sortDir={sortDirs.landed}>Landed</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="drop_out"
                  sortDir={sortDirs.drop_out}>DropOut</SortHeader>
              </th>
              <th className="actions"/>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan="10" className="center">No campaign available</td>
              </tr>) :
              campaigns.map((campaign) => this._renderRow(campaign, token))
            }
          </tbody>
          {this._renderTotal()}
        </table>
        <div id="react-paginate" className="pull-right">
          <Pagination
            prev="<"
            next=">"
            first="<<"
            last=">>"
            ellipsis="..."
            boundaryLinks
            items={total_page}
            maxButtons={5}
            activePage={page}
            onSelect={this._handlePageChange} />
        </div>
      </div>
    )
  }
}

CampaignTable.propTypes = {
  campaigns: PropTypes.array.isRequired,
  handleExportRawdata: PropTypes.func,
  onDeleteCampaign: PropTypes.func,
  onPageChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  page: PropTypes.number,
  per_page: PropTypes.string,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string,
  summaryCampaigns: PropTypes.object,
  token: PropTypes.string,
  total: PropTypes.number
}

export default CampaignTable