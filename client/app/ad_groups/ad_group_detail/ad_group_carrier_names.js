import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'

import SortHeader from '../../components/sort_header/'

class AdGroupCarrierNames extends Component {
  constructor(props) {
    super(props)

    this._handleSortChange = this._handleSortChange.bind(this)
  }

  _handleSortChange(columnKey, sortDir) {
    this.props.onSortCarrierNameChange(this.props.carrierNames, columnKey, sortDir)
  }

  _renderTotal() {
    const { carrierNames, totalCarrierNames } = this.props
    if (carrierNames.length > 0) {
      return (
        <tfoot>
        <tr>
          <td width="20%" className="text-right"><b>Total:</b></td>
          <td width="15%"><b><FormattedNumber value={totalCarrierNames.views} /></b></td>
          <td width="15%"><b><FormattedNumber value={totalCarrierNames.clicks} /></b></td>
          <td width="15%">
            <b><FormattedNumber value={totalCarrierNames.ctr}
              style="percent"
              minimumFractionDigits={2}
              maximumFractionDigits={2} />
            </b>
          </td>
          <td width="15%"><b><FormattedNumber value={totalCarrierNames.landed} /></b></td>
          <td width="10%"><b>
            <FormattedNumber value={totalCarrierNames.drop_out}
              style="percent"
              minimumFractionDigits={2}
              maximumFractionDigits={2} />
          </b></td>
        </tr>
        </tfoot>
      )
    }
  }

  _renderRow(carrierName) {
    return (
      <tr key={carrierName.name}>
        <td>
          {carrierName.name}
        </td>
        <td>
          <FormattedNumber value={carrierName.views} />
        </td>
        <td>
          <FormattedNumber value={carrierName.clicks} />
        </td>
        <td>
          <FormattedNumber value={carrierName.ctr}
            style="percent"
            minimumFractionDigits={2}
            maximumFractionDigits={2}/>
        </td>
        <td>
          <FormattedNumber value={carrierName.landed} />
        </td>
        <td>
          <FormattedNumber value={carrierName.drop_out}
            style="percent"
            minimumFractionDigits={2}
            maximumFractionDigits={2} />
        </td>
      </tr>
    )
  }

  render() {
    const { carrierNames, sortDir, sortBy } = this.props
    const sortDirs = { [sortBy]: sortDir }

    if (carrierNames === null)
      return (<div></div>)

    return (
      <div>
        <table className="table table-bordered table-striped">
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
          </tr>
          </thead>
          <tbody>
          {carrierNames.length === 0 ? (
            <tr>
              <td colSpan="6" className="center">No tracking data available</td>
            </tr>) :
            carrierNames.map((carrierName) => this._renderRow(carrierName))
          }
          </tbody>
          {this._renderTotal()}
        </table>
      </div>
    )
  }
}

AdGroupCarrierNames.propTypes = {
  carrierNames: PropTypes.array,
  onSortCarrierNameChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string,
  totalCarrierNames: PropTypes.object
}

export default AdGroupCarrierNames