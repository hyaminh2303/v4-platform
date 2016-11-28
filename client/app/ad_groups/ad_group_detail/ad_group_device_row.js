import React, { Component, PropTypes } from 'react'
import { FormattedNumber, FormattedDate } from 'react-intl'
import classNames from 'classnames/bind'

class AdGroupDeviceRow extends Component {
  constructor(props) {
    super(props)

    this.state = { isHide: true }
    this._handleToggle = this._handleToggle.bind(this)
    this._renderPlatform = this._renderPlatform.bind(this)
  }

  _handleToggle() {
    this.setState({ isHide: !this.state.isHide })
  }

  _renderPlatform(platform) {
    let className = classNames('platform-row white-background', { hide: this.state.isHide })
    let platforms = { pocket_math: 'PocketMath', datalift: 'DataLift', bidstalk: 'Bidstalk' }
    return (
      <tr className={className} key={platform.name}>
        <td></td>
        <td><FormattedNumber value={platform.views} /></td>
        <td><FormattedNumber value={platform.devices} /></td>
        <td><FormattedNumber value={platform.clicks} /></td>
        <td><FormattedNumber value={platform.clicked_devices} /></td>
        <td>{platforms[platform.name]}</td>
      </tr>
    )
  }

  render() {
    const { device } = this.props
    let className = classNames('toggle-platform', 'fa',
                                { 'fa-minus-circle red-color size-16': !this.state.isHide,
                                  'fa-plus-circle green-color size-16': this.state.isHide })
    return (
      <tr>
        <td className="wrap-column" colSpan="6">
          <table className="table child-table gray-table table-bordered">
            <tbody>
              <tr>
                <td width="30%"><FormattedDate day="numeric" month="long" year="numeric" value={device.date} /></td>
                <td width="15%"><FormattedNumber value={device.views} /></td>
                <td width="15%"><FormattedNumber value={device.devices} /></td>
                <td width="15%"><FormattedNumber value={device.clicks} /></td>
                <td width="15%"><FormattedNumber value={device.clicked_devices} /></td>
                <td width="10%"><center><i className={className} onClick={this._handleToggle}/></center></td>
              </tr>
              {device.platforms.map((platform) => this._renderPlatform(platform))}
            </tbody>
          </table>
        </td>
      </tr>
    )
  }
}

AdGroupDeviceRow.propTypes = {
  device: PropTypes.object
}

export default AdGroupDeviceRow