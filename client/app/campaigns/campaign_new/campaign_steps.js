import React, { Component, PropTypes } from 'react'

class CampaignSteps extends Component {
  render() {
    const { step } = this.props
    return (
      <div>
        <ul className="steps">
          <li data-step="1" className={step === '1' ? 'active' : ''}>
            <span className="step">1</span>
            <span className="title">Campaign Info</span>
          </li>
          <li data-step="2" className={step === '2' ? 'active' : ''}>
            <span className="step">2</span>
            <span className="title">Ad Group</span>
          </li>
          <li data-step="3" className={step === '3' ? 'active' : ''}>
            <span className="step">3</span>
            <span className="title">Creatives</span>
          </li>
        </ul>
      </div>
    )
  }
}

CampaignSteps.propTypes = {
  step: PropTypes.string
}

export default CampaignSteps