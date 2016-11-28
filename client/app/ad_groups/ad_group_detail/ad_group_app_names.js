import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'

import SortHeader from '../../components/sort_header/'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

class AdGroupAppNames extends Component {
  constructor(props) {
    super(props)

    this._handleSortChange = this._handleSortChange.bind(this)
  }

  _handleSortChange(columnKey, sortDir) {
    this.props.onSortAppNameChange(this.props.appNames, columnKey, sortDir)
  }

  _renderTotal() {
    const { appNames, totalAppNames } = this.props
    if (appNames.length > 0) {
      return (
        <tfoot>
        <tr>
          <td width="20%" className="text-right"><b>Total:</b></td>
          <td width="15%"><b><FormattedNumber value={totalAppNames.views} /></b></td>
          <td width="15%"><b><FormattedNumber value={totalAppNames.clicks} /></b></td>
          <td width="15%"><b><FormattedNumber value={totalAppNames.ctr} style="percent"
            minimumFractionDigits={2} maximumFractionDigits={2} /></b></td>
          <td width="15%"><b><FormattedNumber value={totalAppNames.landed} /></b></td>
          <td width="10%"><b><FormattedNumber value={totalAppNames.drop_out} style="percent"
            minimumFractionDigits={2} maximumFractionDigits={2} /></b></td>
        </tr>
        </tfoot>
      )
    }
  }

  _renderRow(appName) {
    const appNameTooltip = (
      <Tooltip className="app-name-tooltip">{appName.name}</Tooltip>
    )
    return (
      <tr key={appName.name}>
        <td>
          <OverlayTrigger placement="bottom" overlay={appNameTooltip}>
            <div className="app-name">
              {appName.name}
            </div>
          </OverlayTrigger>
        </td>
        <td>
          <FormattedNumber value={appName.views} />
        </td>
        <td>
          <FormattedNumber value={appName.clicks} />
        </td>
        <td>
          <FormattedNumber value={appName.ctr} style="percent"
            minimumFractionDigits={2} maximumFractionDigits={2}/>
        </td>
        <td>
          <FormattedNumber value={appName.landed} />
        </td>
        <td>
          <FormattedNumber value={appName.drop_out} style="percent"
            minimumFractionDigits={2} maximumFractionDigits={2} />
        </td>
      </tr>
    )
  }

  render() {
    const { appNames, sortDir, sortBy } = this.props
    const sortDirs = { [sortBy]: sortDir }

    if (appNames === null)
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
          {appNames.length === 0 ? (
            <tr>
              <td colSpan="6" className="center">No tracking data available</td>
            </tr>) :
            appNames.map((appName) => this._renderRow(appName))
          }
          </tbody>
          {this._renderTotal()}
        </table>
      </div>
    )
  }
}

AdGroupAppNames.propTypes = {
  appNames: PropTypes.array,
  onSortAppNameChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string,
  totalAppNames: PropTypes.object
}

export default AdGroupAppNames