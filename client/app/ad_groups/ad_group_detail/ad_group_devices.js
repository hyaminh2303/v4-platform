import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'

import SortHeader from '../../components/sort_header/'
import AdGroupDeviceRow from './ad_group_device_row'

class AdGroupDevices extends Component {
  constructor(props) {
    super(props)

    this._handleSortChange = this._handleSortChange.bind(this)
  }

  _handleSortChange(columnKey, sortDir) {
    this.props.onSortDeviceChange(this.props.devices, columnKey, sortDir)
  }

  _renderTotal() {
    const { devices, totalDevices } = this.props
    if (devices.length > 0) {
      return (
        <tr>
          <td className="wrap-column" colSpan="6">
            <table className="table child-table table-hover table-bordered">
              <tbody>
                <tr>
                  <td width="30%" className="text-right"><b>Total:</b></td>
                  <td width="15%"><b><FormattedNumber value={totalDevices.views} /></b></td>
                  <td width="15%"><b><FormattedNumber value={totalDevices.devices} /></b></td>
                  <td width="15%"><b><FormattedNumber value={totalDevices.clicks} /></b></td>
                  <td width="15%"><b><FormattedNumber value={totalDevices.clicked_devices} /></b></td>
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
    const { devices, sortDir, sortBy } = this.props
    const sortDirs = { [sortBy]: sortDir }

    if (devices === null)
      return (<div></div>)

    return (
      <div>
        <table className="table parent-table table-bordered table-striped">
          <thead className="thin-border-bottom">
            <tr>
              <th width="30%">
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="date"
                  sortDir={sortDirs.date}>Date
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
                  columnKey="devices"
                  sortDir={sortDirs.devices}># of Unique Devices
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
                  columnKey="clicked_devices"
                  sortDir={sortDirs.clicked_devices}># Of Clicked Devices
                  </SortHeader>
              </th>
              <th width="10%">
                Platform
              </th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ?
              <tr>
                <td colSpan="6" className="center">No tracking data available</td>
              </tr>
              :
              devices.map((device) => <AdGroupDeviceRow key={device.date} device={device}/>)
            }
            {this._renderTotal()}
          </tbody>
        </table>
      </div>
    )
  }
}

AdGroupDevices.propTypes = {
  devices: PropTypes.array,
  onSortDeviceChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string,
  totalDevices: PropTypes.object
}

export default AdGroupDevices