import React, { Component, PropTypes } from 'react'
import { DropdownButton } from 'react-bootstrap'
import { Link } from 'react-router'
import { FormattedDate } from 'react-intl'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedNumber } from 'react-intl'
const moment = require('moment')

import { deleteAdGroup } from '../../ad_groups/ad_group_actions'
import SortHeader from '../../components/sort_header/'
import Confirm from '../../confirm/confirm'
import ExportRawdataModal from './../../components/export_rawdata_modal'

import BASE_API_URL from '../../config'

class AdGroups extends Component {
  constructor(props) {
    super(props)
    this.state = { showConfirm: false,
      titleConfirm: '',
      currentAdGroup: null, isOpenExport: false, exportTitle: null }
    this._handleSortChange = this._handleSortChange.bind(this)
    this._handleConfirm = this._handleConfirm.bind(this)


    this._handleExportRawdata = this._handleExportRawdata.bind(this)
    this._handleCloseExportRawDataModal = this._handleCloseExportRawDataModal.bind(this)
    this._handleSubmitExportRawData = this._handleSubmitExportRawData.bind(this)
  }


  _handleSubmitExportRawData(data) {
    const token = this.props.session.auth_token
    window.open(`${BASE_API_URL}/ad_groups/${this.state.currentAdGroup.id}/export_raw_data?token=${token}&start_date=${data.start_date}&end_date=${data.end_date}`)
    this.setState({ isOpenExport: false, currentAdGroup: null, exportTitle: null })
  }

  _handleExportRawdata(adgroup) {
    this.setState({ isOpenExport: true, currentAdGroup: adgroup,
                    exportTitle: `AdGroup: ${adgroup.name}` })
  }

  _handleCloseExportRawDataModal() {
    this.setState({ isOpenExport: false })
  }

  _handleConfirm(status) {
    const { currentAdGroup } = this.state
    const { campaign } = this.props
    if (status)
      this.props.deleteAdGroup(currentAdGroup, campaign.id)

    this.setState({ showConfirm: false,
      titleConfirm: '' })
  }

  _openConfirm(adGroup) {
    this.setState({ showConfirm: true,
      titleConfirm: `Are you sure you want to delete the AdGroup ${adGroup.name} ?`,
      currentAdGroup: adGroup })
  }

  _handleSortChange(columnKey, sortDir) {
    this.props.onSortChange(this.props.groups, columnKey, sortDir)
  }

  _handleGenerateLocationReport(groupId) {
    this.props.setTypeGenerate('adgroup', [groupId])
    this.props.onGenerateLocationPopUp(true)
  }

  _renderGuestDropdown(group) {
    return(
      <DropdownButton bsStyle="default"
                      bsSize="xs" title={<i className="fa fa-cogs"/>}
                      id="user_actions" pullRight>
        <li>
          <a onClick={() => this._handleExportRawdata(group)}>
            Export Raw Data
          </a>
        </li>
      </DropdownButton>
    )
  }

  _renderAdminDropdown(group) {
    return (
      <DropdownButton bsStyle="default"
                      bsSize="xs" title={<i className="fa fa-cogs"/>}
                      id="user_actions" pullRight>
        <li><Link to={`/ad_groups/${group.id}/edit`}><i className="fa fa-edit"/> Edit</Link></li>
        <li>
          <a onClick={() => this._handleExportRawdata(group)}>
            Export Raw Data
          </a>
        </li>
        <li>
          <a onClick={() => this._handleGenerateLocationReport(group.id)} >
            <i className="fa fa-file-text-o"/> Generate Location Report
          </a>
        </li>
        <li>
          <a onClick={() => { this._openConfirm(group) }} >
            <i className="fa fa-trash"/> Delete
          </a>
        </li>
      </DropdownButton>
    )
  }

  _renderRow(group) {
    const { session } = this.props
    return (
      <tr key={group.id}>
        <td>
          {
            session.role_key === 'guest' ?
              group.name
              :
              <Link to={`/ad_groups/${group.id}`}>{group.name}</Link>
          }
        </td>
        <td>
          <FormattedDate value={new Date(group.start_date)}
            day="numeric" month="long" year="numeric"/>
        </td>
        <td>
          <FormattedDate value={new Date(group.end_date)}
            day="numeric" month="long" year="numeric"/>
        </td>
        <td><FormattedNumber value={group.views} /></td>
        <td><FormattedNumber value={group.clicks} /></td>
        <td><FormattedNumber value={group.ctr} style="percent"
          minimumFractionDigits={2} maximumFractionDigits={2}/></td>
        <td><FormattedNumber value={group.landed} /></td>
        <td><FormattedNumber value={group.drop_out} style="percent"
          minimumFractionDigits={2} maximumFractionDigits={2}/></td>
        <td>
          {
            session.role_key === 'guest' ?
              this._renderGuestDropdown(group)
              :
              this._renderAdminDropdown(group)
          }
        </td>
      </tr>
    )
  }

  _renderTotal() {
    const { groups, total } = this.props
    if (groups.length > 0) {
      return (
        <tfoot>
          <tr>
            <td colSpan="3" className="text-right"><b>Total:</b></td>
            <td><b><FormattedNumber value={total.views} /></b></td>
            <td><b><FormattedNumber value={total.clicks} /></b></td>
            <td><b><FormattedNumber value={total.ctr} style="percent"
              minimumFractionDigits={2} maximumFractionDigits={2}/></b></td>
            <td><b><FormattedNumber value={total.landed} /></b></td>
            <td><b><FormattedNumber value={total.drop_out} style="percent"
              minimumFractionDigits={2} maximumFractionDigits={2}/></b></td>
            <td></td>
          </tr>
        </tfoot>
      )
    }
  }

  render() {
    const { groups, sortDir, sortBy } = this.props
    const sortDirs = { [sortBy]: sortDir }

    let initialValuesExportRawData = {}
    if (this.state.currentAdGroup !== null) {
      const { start_date, end_date } = this.state.currentAdGroup
      initialValuesExportRawData = {
        start_date: moment(start_date).format('YYYY-MM-D'),
        end_date:  moment(end_date).format('YYYY-MM-D')
      }
    }

    return (
      <div className="widget-box transparent">
        <Confirm isShow={this.state.showConfirm}
          title={this.state.titleConfirm}
          onResult={this._handleConfirm}/>
        <table className="table table-bordered table-hover">
          <thead className="thin-border-bottom">
          <tr>
            <th>
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="name"
                sortDir={sortDirs.name}>Name</SortHeader>
            </th>
            <th>
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="start_date"
                sortDir={sortDirs.start_date}>Start Date</SortHeader>
            </th>
            <th>
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="end_date"
                sortDir={sortDirs.end_date}>End Date</SortHeader>
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
            <th className="actions"></th>
          </tr>
          </thead>
          <tbody>
            {groups.length === 0 ? (
              <tr>
                <td colSpan="6" className="center">No group available</td>
              </tr>) :
              groups.map((group) => this._renderRow(group))
            }
          </tbody>
          {this._renderTotal()}
        </table>

        <ExportRawdataModal isOpen={this.state.isOpenExport}
          title={this.state.exportTitle}
          obj={this.state.currentAdGroup}
          onExport={this._handleSubmitExportRawData}
          onClose={this._handleCloseExportRawDataModal}
          initialValues={initialValuesExportRawData}/>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ deleteAdGroup }, dispatch)
}

AdGroups.propTypes = {
  campaign: PropTypes.object.isRequired,
  deleteAdGroup: PropTypes.func.isRequired,
  groups: PropTypes.array.isRequired,
  onGenerateLocationPopUp: PropTypes.func,
  onSortChange: PropTypes.func.isRequired,
  session: PropTypes.object,
  setTypeGenerate: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string,
  token: PropTypes.string,
  total: PropTypes.object
}


function mapStateToProps(state) {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdGroups)
