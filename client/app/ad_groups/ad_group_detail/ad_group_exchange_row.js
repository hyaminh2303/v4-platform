import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'
import classNames from 'classnames/bind'

class AdGroupExchangeRow extends Component {
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
        <td><FormattedNumber
          value={platform.ctr} style="percent"
          minimumFractionDigits={2} maximumFractionDigits={2}/></td>
        <td><FormattedNumber value={platform.landed} /></td>
        <td><FormattedNumber value={platform.drop_out}
          style="percent"
          minimumFractionDigits={2} maximumFractionDigits={2}/></td>
        <td>{platforms[platform.name]}</td>
      </tr>
    )
  }

  render() {
    const { exchange } = this.props
    let className = classNames('toggle-platform', 'fa',
      { 'fa-minus-circle red-color size-16': !this.state.isHide,
        'fa-plus-circle green-color size-16': this.state.isHide })
    return (
      <tr>
        <td className="wrap-column" colSpan="7">
          <table className="table child-table gray-table table-bordered">
            <tbody>
            <tr>
              <td width="20%">{exchange.name}</td>
              <td width="15%"><FormattedNumber value={exchange.views} /></td>
              <td width="15%"><FormattedNumber value={exchange.clicks} /></td>
              <td width="15%"><FormattedNumber value={exchange.ctr}
                style="percent"
                minimumFractionDigits={2} maximumFractionDigits={2}/></td>
              <td width="15%"><FormattedNumber value={exchange.landed} /></td>
              <td width="10%"><FormattedNumber value={exchange.drop_out}
                style="percent"
                minimumFractionDigits={2} maximumFractionDigits={2}/></td>
              <td width="10%">
                {exchange.platforms.length !== 0 ?
                  <center><i className={className} onClick={this._handleToggle}/></center> : ''
                }
              </td>
            </tr>
            {exchange.platforms.map((platform) => this._renderPlatform(platform))}
            </tbody>
          </table>
        </td>
      </tr>
    )
  }
}

AdGroupExchangeRow.propTypes = {
  exchange: PropTypes.object
}

export default AdGroupExchangeRow