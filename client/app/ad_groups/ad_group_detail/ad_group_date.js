import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'

import SortHeader from '../../components/sort_header/'
import AdGroupDateRow from './ad_group_date_row'

class AdGroupDate extends Component {
  constructor(props) {
    super(props)
    this._handleSortChange = this._handleSortChange.bind(this)
    this._renderTotal = this._renderTotal.bind(this)
  }

  _handleSortChange(columnKey, sortDir) {
    this.props.onSortChange(this.props.dateTrackingData, columnKey, sortDir)
  }

  _renderTotal() {
    const { dateTrackingData: { data, summary } } = this.props
    if (data.length > 0) {
      return (
        <tr>
          <td className="wrap-column" colSpan="7">
            <table className="table child-table table-hover table-bordered">
              <tbody>
                <tr>
                  <td width="20%" className="text-right"><b>Total:</b></td>
                  <td width="15%"><b><FormattedNumber value={summary.views} /></b></td>
                  <td width="15%"><b><FormattedNumber value={summary.clicks} /></b></td>
                  <td width="15%"><b><FormattedNumber value={summary.ctr} style="percent"
                    minimumFractionDigits={2} maximumFractionDigits={2}/></b></td>
                  <td width="15%"><b><FormattedNumber value={summary.landed} /></b></td>
                  <td width="10%"><b><FormattedNumber value={summary.drop_out} style="percent"
                    minimumFractionDigits={2} maximumFractionDigits={2}/></b></td>
                  <td width="10%"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      )
    }
  }

  render() {
    const { dateTrackingData: { data }, sortBy, sortDir } = this.props
    const sortDirs = { [sortBy]: sortDir }
    if (data === null)
      return (<div></div>)

    return (
      <table className="table parent-table">
        <thead className="thin-border-bottom">
          <tr>
            <th width="20%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="date"
                sortDir={sortDirs.date}>Date</SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="views"
                sortDir={sortDirs.views}>Views</SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="clicks"
                sortDir={sortDirs.clicks}>Clicks</SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="ctr"
                sortDir={sortDirs.ctr}>CTR </SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="landed"
                sortDir={sortDirs.landed}>Landed</SortHeader>
            </th>
            <th width="10%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="drop_out"
                sortDir={sortDirs.drop_out}>DropOut</SortHeader>
            </th>
            <th width="10%">
              Platform
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="7" className="center">No tracking data available</td>
            </tr>) :
            data.map((trackingRow) =>
              <AdGroupDateRow key={trackingRow.date} trackingRow={trackingRow}/>)
          }
          {this._renderTotal()}
        </tbody>
      </table>
    )
  }
}

AdGroupDate.propTypes = {
  dateTrackingData: PropTypes.object,
  onSortChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string,
  summary: PropTypes.object
}

export default AdGroupDate
