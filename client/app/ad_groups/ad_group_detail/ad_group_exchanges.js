import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'

import SortHeader from '../../components/sort_header/'
import AdGroupExchangeRow from './ad_group_exchange_row'

class AdGroupExchanges extends Component {
  constructor(props) {
    super(props)

    this._handleSortChange = this._handleSortChange.bind(this)
  }

  _handleSortChange(columnKey, sortDir) {
    this.props.onSortExchangeChange(this.props.exchangeTrackings, columnKey, sortDir)
  }

  _renderTotal() {
    const { exchangeTrackings, total } = this.props
    if (exchangeTrackings.length > 0) {
      return (
        <tr>
          <td className="wrap-column" colSpan="7">
            <table className="table child-table table-hover table-bordered">
              <tbody>
              <tr>
                <td width="20%" className="text-right"><b>Total:</b></td>
                <td width="15%"><b><FormattedNumber value={total.views} /></b></td>
                <td width="15%"><b><FormattedNumber value={total.clicks} /></b></td>
                <td width="15%"><b><FormattedNumber value={total.ctr}
                  style="percent"
                  minimumFractionDigits={2} maximumFractionDigits={2} /></b></td>
                <td width="15%"><b><FormattedNumber value={total.landed} /></b></td>
                <td width="10%"><b><FormattedNumber value={total.drop_out}
                  style="percent"
                  minimumFractionDigits={2} maximumFractionDigits={2} /></b></td>
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
    const { exchangeTrackings, sortDir, sortBy } = this.props
    const sortDirs = { [sortBy]: sortDir }

    if (exchangeTrackings === null)
      return (<div></div>)

    return (
      <div>
        <table className="table parent-table table-bordered table-striped">
          <thead className="thin-border-bottom">
          <tr>
            <th width="20%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="name"
                sortDir={sortDirs.name}>Name
              </SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="views"
                sortDir={sortDirs.views}>Views
              </SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="clicks"
                sortDir={sortDirs.clicks}>Clicks
              </SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="ctr"
                sortDir={sortDirs.ctr}>CTR
              </SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="landed"
                sortDir={sortDirs.landed}>Landed
              </SortHeader>
            </th>
            <th width="10%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="drop_out"
                sortDir={sortDirs.drop_out}>DropOut
              </SortHeader>
            </th>
            <th width="10%">Platform</th>
          </tr>
          </thead>
          <tbody>
          {exchangeTrackings.length === 0 ?
            <tr>
              <td colSpan="7" className="center">No tracking data available</td>
            </tr>
            :
            exchangeTrackings.map((exchange) => <AdGroupExchangeRow key={exchange.name} exchange={exchange} />)
          }
          {this._renderTotal()}
          </tbody>
        </table>
      </div>
    )
  }
}

AdGroupExchanges.propTypes = {
  exchangeTrackings: PropTypes.array,
  onSortExchangeChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string,
  total: PropTypes.object
}

export default AdGroupExchanges
