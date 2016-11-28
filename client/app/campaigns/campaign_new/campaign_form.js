import React, { Component, PropTypes } from 'react'
import { Row, Col, HelpBlock, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Selector from 'react-select'
import validate from 'validate.js'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-select/dist/react-select.css'

class CampaignForm extends Component {
  constructor(props) {
    super(props)

    this._handleSave = this._handleSave.bind(this)
  }

  _handleSave(data) {
    this.props.onSave(data)
  }

  render() {
    const { fields: { name, category_id, start_date, end_date,
                      campaign_type, analytic_profile_id },
            handleSubmit, categories, campaign_types
          } = this.props
    return (
      <form className="form-horizontal">
        <Row>
          <Col md={6}>
            <FormGroup
              controlId="formControlsText"
              validationState={name.touched && name.error ? 'error' : null}>
              <Col componentClass={ControlLabel} sm={3}>
                Name
              </Col>
              <Col sm={9}>
                <FormControl type="text" {...name}/>
                <FormControl.Feedback />
                <HelpBlock>{name.touched && name.error ? name.error[0] : null}</HelpBlock>
              </Col>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup
              controlId="formControlsText"
              validationState={campaign_type.touched && campaign_type.error ? 'error' : null}>
              <label className={campaign_type.touched && campaign_type.error ?
                'label-role-error' : 'control-label col-xs-3'}>
                Type</label>
              <div className = "col-xs-9">
                <Selector
                  valueKey="value"
                  labelKey="label"
                  options={campaign_types}
                  value={campaign_type.value}
                  onChange={campaign_type.onChange} />
                <HelpBlock>{campaign_type.touched && campaign_type.error ? campaign_type.error[0] : null}</HelpBlock>
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup
              controlId="formControlsText"
              validationState={start_date.touched && start_date.error ? 'error' : null}>
              <label className ={start_date.touched && start_date.error ?
                'label-role-error' : 'control-label col-xs-3'}>
                Start Date</label>
              <div className = "col-xs-9">
                <DatePicker
                  placeholderText="Start Date"
                  selected={start_date.value ? moment(start_date.value) : moment()}
                  onChange={start_date.onChange}
                  className="form-control"/>
                <HelpBlock>{start_date.touched && start_date.error ? start_date.error[0] : null}</HelpBlock>
              </div>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup
              controlId="formControlsText"
              validationState={category_id.touched && category_id.error ? 'error' : null}>
              <label className ={category_id.touched && category_id.error ?
                'label-role-error' : 'control-label col-xs-3'}>
                Category</label>
              <div className = "col-xs-9">
                <Selector
                  valueKey="id"
                  labelKey="name"
                  options={categories}
                  value={category_id.value}
                  onChange={category_id.onChange} />
                <HelpBlock>{category_id.touched && category_id.error ? category_id.error[0] : null}</HelpBlock>
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup
              controlId="formControlsText"
              validationState={end_date.touched && end_date.error ? 'error' : null}>
              <label className ={end_date.touched && end_date.error ? 'label-role-error' : 'control-label col-xs-3'}>
                End Date</label>
              <div className = "col-xs-9">
                <DatePicker
                  placeholderText="End Date"
                  selected={end_date.value ? moment(end_date.value) : moment()}
                  onChange={end_date.onChange}
                  className="form-control"/>
                <HelpBlock>{end_date.touched && end_date.error ? end_date.error[0] : null}</HelpBlock>
              </div>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup
              controlId="formControlsText"
              validationState={analytic_profile_id.touched && analytic_profile_id.error ? 'error' : null}>
              <Col componentClass={ControlLabel} sm={3}>
                Analytic Profile Id
              </Col>
              <Col sm={9}>
                <FormControl type="text" {...analytic_profile_id}/>
                <FormControl.Feedback />
                <HelpBlock>
                  {analytic_profile_id.touched && analytic_profile_id.error ?
                    analytic_profile_id.error[0] : null}</HelpBlock>
              </Col>
            </FormGroup>
          </Col>
        </Row>

        <div className="clearfix form-actions">
          <div className="center">
            <span className="mr10">
              <Button
                bsStyle="danger" bsSize="small"
                onClick={handleSubmit(this._handleSave)}>
                <i className="ace-icon fa fa-check bigger-110"/>
                Save and continue
              </Button>
            </span>
            <Button href="#/campaigns" bsStyle="default" bsSize="small">
              <i className="ace-icon fa f bigger-110"/>
                Cancel
            </Button>
          </div>
        </div>
      </form>
    )
  }
}

CampaignForm.propTypes = {
  campaign_types: PropTypes.array,
  categories: PropTypes.array,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func,
  id: PropTypes.string,
  onEdit: PropTypes.func,
  onNew: PropTypes.func,
  onSave: PropTypes.func.isRequired
}

function validateParams(campaign) {
  let constraints = {
    name: {
      presence: true
    },
    campaign_type: {
      presence: true
    },
    start_date: {
      presence: true,
      datetime: {
        latest: campaign.end_date,
        message: 'Start Date must be less than End Date'
      }
    },
    end_date: {
      presence: true
    },
    category_id: {
      presence: {
        message: "Category can't be blank"
      }
    }
  }
  return validate(campaign, constraints) || {}
}


CampaignForm = reduxForm({
  form: 'campaignForm',
  fields: ['id', 'name', 'campaign_type', 'start_date', 'end_date',
    'category_id', 'campaign_type', 'analytic_profile_id'],
  validate: validateParams
})(CampaignForm)

export default CampaignForm