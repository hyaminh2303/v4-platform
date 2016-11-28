import React, { Component, PropTypes } from 'react'
import { Table, Modal, Button, FormGroup, FormControl, Col, HelpBlock, ControlLabel, Checkbox } from 'react-bootstrap'
import Notification from '../../notification/'
import validate from 'validate.js'
import { reduxForm } from 'redux-form'
import { forEach } from 'lodash'

const fields = [
  'totalView',
  'totalClick',
  'groups[].id',
  'groups[].name',
  'groups[].totalView',
  'groups[].totalClick'
]

class GenerateLocationPopup extends Component {
  constructor(props) {
    super(props)
  }

  _handleChangeTypeGenerate(data) {
    if (data.target.checked) {
      this.props.setTypeGenerate('campaign', [])
    } else {
      this.props.setTypeGenerate('adgroups', [])
    }
  }

  _campaignGenerateForm() {
    const { fields: { totalView, totalClick } } = this.props

    return (
      <div>
        <Col xs={6} controlId="formControlsText"
          validationState={totalView.touched && totalView.error ? 'error' : null}>
          <FormGroup validationState={totalView.touched && totalView.error ? 'error' : null}>
            <Col xs={5} componentClass={ControlLabel} >
              Total Views
            </Col>
            <Col xs={7}>
              <FormControl type="number" {...totalView}/>
              <HelpBlock>{totalView.touched && totalView.error ? totalView.error[0] : null}</HelpBlock>
            </Col>
          </FormGroup>
        </Col>
        <Col xs={6}
          controlId="formControlsText"
          validationState={totalClick.touched && totalClick.error ? 'error' : null}>
          <FormGroup
            validationState={totalClick.touched && totalClick.error ? 'error' : null}>
            <Col xs={5} componentClass={ControlLabel} >
              Total Clicks
            </Col>
            <Col xs={7}>
              <FormControl type="number" {...totalClick}/>
              <HelpBlock>{totalClick.touched && totalClick.error ? totalClick.error[0] : null}</HelpBlock>
            </Col>
          </FormGroup>
        </Col>
      </div>
    )
  }

  _renderAdGroupsFormRow(group, index) {
    const { totalView, totalClick, name, id } = group
    const { fields: { groups } } = this.props
    return (
      <tr key={index}>
        <td>
          <ControlLabel>{name.value}</ControlLabel>
        </td>
        <td>
          <FormGroup validationState={totalView.touched && totalView.error ? 'error' : null}>
            <FormControl type="hidden" {...id}/>
            <FormControl type="number" {...totalView}/>
          </FormGroup>
        </td>
        <td>
          <FormGroup validationState={totalClick.touched && totalClick.error ? 'error' : null}>
            <FormControl type="number" {...totalClick}/>
          </FormGroup>
        </td>
        <td>
          {
            groups.length > 1 ?
            <Button
              type="button"
              bsSize="xs"
              bsStyle="danger"
              onClick={() => groups.removeField(index)}>
              <i className="fa fa-minus"/>
            </Button>
            :
            ''
          }
        </td>
      </tr>
    )
  }

  _adGroupGenerateForm() {
    const { fields: { groups } } = this.props
    return (
      <div>
        {this.props.typeGenerate !== 'adgroup' ?
          <b>Input Views and Clicks for each AdGroup</b> : ''}
        <Table className="table table-bordered table-hover">
          <thead>
            <tr>
              <td>Adgroup</td>
              <td className="w-110">Total Views</td>
              <td className="w-110">Total Clicks</td>
              <td className="w-30"></td>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, index) => this._renderAdGroupsFormRow(group, index))}
          </tbody>
        </Table>
      </div>
    )
  }

  render() {
    const { handleSubmit } = this.props
    return (
      <Modal dialogClassName="generate-location-report"
        onHide={this.props.onClose}
        show={this.props.isOpen} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Location Report Generation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Notification />
            <form className="form-horizontal group-mar-0"
              onSubmit={handleSubmit((data) => this.props.onHandleSubmit(data))} >
              {this.props.typeGenerate !== 'adgroup' ?
                <FormGroup>
                  <Col sm={12}>
                    <Checkbox onChange={(data) => this._handleChangeTypeGenerate(data)}
                      value={true}
                      checked={this.props.typeGenerate === 'campaign'}>
                        Input Views and Clicks for the whole campaign</Checkbox>
                  </Col>
                </FormGroup> : ''}
              <br/>
              {
                this.props.typeGenerate === 'campaign' ?
                this._campaignGenerateForm() : this._adGroupGenerateForm()
              }
              <div className="text-right clearfix">
                <div className="col-xs-12">
                <Button bsStyle="danger" bsSize="small"
                  onClick={handleSubmit((data) => this.props.onHandleSubmit(data))}>
                  <i className="ace-icon fa fa-check bigger-110"/>
                  Generate
                </Button>
                </div>
              </div>
            </form>
        </Modal.Body>
      </Modal>
    )
  }
}

function validateParams(data, props) {
  let error = {}
  if (props.typeGenerate === 'campaign') {
    const constraints = {
      totalClick: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 0
        }
      },
      totalView: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 0
        }
      }
    }
    error = validate(data, constraints)
  } else {
    error = { groups: [] }
    forEach(data.groups, (e) => {
      let constraints = {
        totalClick: {
          presence: true,
          numericality: {
            greaterThanOrEqualTo: 0
          }
        },
        totalView: {
          presence: true,
          numericality: {
            greaterThanOrEqualTo: 0
          }
        }
      }
      error.groups.push(validate(e, constraints))
    })
  }

  return error || {}
}

GenerateLocationPopup.propTypes = {
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
  isOpen: PropTypes.boolean,
  onClose: PropTypes.func,
  onHandleSubmit: PropTypes.func,
  setTypeGenerate: PropTypes.func,
  typeGenerate: PropTypes.String
}

export default reduxForm({
  form: 'generate_location',
  fields: fields,
  validate: validateParams
})(GenerateLocationPopup)
