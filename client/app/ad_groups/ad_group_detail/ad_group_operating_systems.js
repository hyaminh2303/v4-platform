import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'
import SortHeader from '../../components/sort_header/'

import { lowerCase } from 'lodash'

class AdGroupOperatingSystems extends Component {
  constructor(props) {
    super(props)
    this._handleSortChange = this._handleSortChange.bind(this)
  }

  _handleSortChange(columnKey, sortDir) {
    this.props.onSortChange(this.props.osTrackingData, columnKey, sortDir)
  }

  _renderRow(trackingRow) {
    return (
      <tr key={trackingRow.os}>
        <td>
          {trackingRow.os}
        </td>
        <td>
          <FormattedNumber value={trackingRow.views} />
        </td>
        <td>
          <FormattedNumber value={trackingRow.clicks} />
        </td>
        <td>
          <FormattedNumber value={trackingRow.ctr} style="percent"
            minimumFractionDigits={2} maximumFractionDigits={2}/>
        </td>
        <td>
          <FormattedNumber value={trackingRow.landed} />
        </td>
        <td>
          <FormattedNumber value={trackingRow.drop_out} style="percent"
            minimumFractionDigits={2} maximumFractionDigits={2} />
        </td>
      </tr>
    )
  }

  _renderTotal() {
    const { osTrackingData } = this.props
    if (osTrackingData.data.length === 0) {
      return
    }
    return (
      <tfoot>
        <tr>
          <td className="text-right"><b>Total:</b></td>
          <td><b><FormattedNumber value={osTrackingData.summary.views} /></b></td>
          <td><b><FormattedNumber value={osTrackingData.summary.clicks} /></b></td>
          <td><b><FormattedNumber value={osTrackingData.summary.ctr} style="percent"
            minimumFractionDigits={2} maximumFractionDigits={2}/></b></td>
          <td><b><FormattedNumber value={osTrackingData.summary.landed} /></b></td>
          <td><b><FormattedNumber value={osTrackingData.summary.drop_out} style="percent"
            minimumFractionDigits={2} maximumFractionDigits={2}/></b></td>
        </tr>
      </tfoot>
    )
  }

  _renderContent(osTrackingData) {
    let html = []
    let tail = []

    osTrackingData.data.map((trackingRow) => {
      this._renderRow(trackingRow)
      if (lowerCase(trackingRow.os) === 'unknown') {
        tail.push(this._renderRow(trackingRow))
      } else {
        html.push(this._renderRow(trackingRow))
      }
    })

    html.push.apply(html, tail)
    return html
  }

  render() {
    const { osTrackingData, sortBy, sortDir } = this.props
    const sortDirs = { [sortBy]: sortDir }

    if (osTrackingData.data === null)
      return (<div></div>)

    return (
      <table className="table table-bordered table-striped">
        <thead className="thin-border-bottom">
          <tr>
            <th width="25%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="os"
                sortDir={sortDirs.os}>OS</SortHeader>
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
                sortDir={sortDirs.ctr}>CTR</SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="landed"
                sortDir={sortDirs.landed}>Landed</SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="drop_out"
                sortDir={sortDirs.drop_out}>DropOut</SortHeader>
            </th>
          </tr>
        </thead>
        <tbody>
          {osTrackingData.data.length === 0 ? (
            <tr>
              <td colSpan="6" className="center">No tracking data available</td>
            </tr>) :
            this._renderContent(osTrackingData)
          }
        </tbody>
        {this._renderTotal()}
      </table>
    )
  }
}

AdGroupOperatingSystems.propTypes = {
  onSortChange: PropTypes.func,
  osTrackingData: PropTypes.object,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string
}

export default AdGroupOperatingSystems