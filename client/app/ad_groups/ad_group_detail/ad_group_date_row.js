import React, { Component, PropTypes } from 'react'
import { FormattedDate, FormattedNumber } from 'react-intl'
import classNames from 'classnames/bind'

class AdGroupDateRow extends Component {
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
        <td><FormattedNumber value={platform.clicks} /></td>
        <td><FormattedNumber value={platform.ctr} style="percent"
          minimumFractionDigits={2} maximumFractionDigits={2} /></td>
        <td><FormattedNumber value={platform.landed} /></td>
        <td><FormattedNumber value={platform.drop_out} style="percent"
          minimumFractionDigits={2} maximumFractionDigits={2} /></td>
        <td>{platforms[platform.name]}</td>
      </tr>
    )
  }

  render() {
    const { trackingRow } = this.props
    let className = classNames('toggle-platform', 'fa',
                                { 'fa-minus-circle red-color size-16': !this.state.isHide,
                                  'fa-plus-circle green-color size-16': this.state.isHide })
    return (
      <tr>
        <td className="wrap-column" colSpan="7">
          <table className="table child-table gray-table table-bordered">
            <tbody>
              <tr>
                <td width="20%">
                  <FormattedDate value={trackingRow.date}
                    day="numeric" month="long" year="numeric"/>
                </td>
                <td width="15%">
                  <FormattedNumber value={trackingRow.views} />
                </td>
                <td width="15%">
                  <FormattedNumber value={trackingRow.clicks} />
                </td>
                <td width="15%">
                  <FormattedNumber value={trackingRow.ctr} style="percent"
                    minimumFractionDigits={2} maximumFractionDigits={2} />
                </td>
                <td width="15%">
                  <FormattedNumber value={trackingRow.landed} />
                </td>
                <td width="10%">
                  <FormattedNumber value={trackingRow.drop_out} style="percent"
                    minimumFractionDigits={2} maximumFractionDigits={2} />
                </td>
                <td width="10%"><center><i className={className} onClick={this._handleToggle}/></center></td>
              </tr>
              {trackingRow.platforms.map((platform) => this._renderPlatform(platform))}
            </tbody>
          </table>
        </td>
      </tr>
    )
  }
}

AdGroupDateRow.propTypes = {
  trackingRow: PropTypes.object
}

export default AdGroupDateRow