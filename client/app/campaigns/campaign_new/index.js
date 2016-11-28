import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CampaignForm from './campaign_form'
import CampaignSteps from './campaign_steps'
import { closeAlert } from '../../notification/notification_action'
import { clearCampaign, newCampaign, editCampaign, fetchCampaign, saveCampaign } from '../campaign_actions'

class CampaignNew extends Component {
  constructor(props) {
    super(props)

    this._handleSave = this._handleSave.bind(this)
  }

  componentWillMount() {
    if (this.props.id) {
      this.props.editCampaign(this.props.id)
    } else {
      this.props.newCampaign()
    }
  }

  componentWillUnmount() {
    this.props.closeAlert()
    this.props.clearCampaign()
  }

  _handleSave(campaign) {
    this.props.saveCampaign(campaign)
  }

  render() {
    return (
      <div className="campaign-new">
        <div className="breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="ace-icon fa fa-dashboard home-icon"/>
              <a href="#/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="#/campaigns">Campaigns</a>
            </li>
            {!this.props.id ?
              <li className="active">New Campaign</li>
              :
              <li className="active">Edit Campaign</li>
            }
          </ul>
        </div>
        <div className="page-content">
          <div className="page-header">
            {!this.props.id ?
              <CampaignSteps step="1" />
              :
              <div><h1>Edit Campaign</h1></div>
            }
          </div>
          <CampaignForm
            onSave={this._handleSave}
            campaign={this.props.campaign}
            campaign_types={this.props.campaign_types}
            categories={this.props.categories}
            initialValues={this.props.campaign}/>
        </div>
      </div>
    )
  }
}

CampaignNew.propTypes = {
  campaign: PropTypes.object,
  campaign_types: PropTypes.array,
  categories: PropTypes.array,
  clearCampaign: PropTypes.func,
  closeAlert: PropTypes.func,
  editCampaign: PropTypes.func.isRequired,
  id: PropTypes.string,
  newCampaign: PropTypes.func.isRequired,
  saveCampaign: PropTypes.func.isRequired
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ closeAlert, clearCampaign, newCampaign,
    editCampaign, fetchCampaign, saveCampaign }, dispatch)
}

function mapStateToProps(state, ownProps) {
  return {
    id: ownProps.params.id,
    categories: state.campaign.categories,
    campaign_types: state.campaign.campaign_types,
    campaign: state.campaign.campaign
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignNew)
