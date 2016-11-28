import React, { Component, PropTypes } from 'react'
import { Row, Col, HelpBlock, FormGroup, ControlLabel, FormControl, Table, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import validate from 'validate.js'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-select/dist/react-select.css'

const fields = [
  'name',
  'locales[].code',
  'locales[].accuracy'
]

class NationalityForm extends Component {
  constructor(props) {
    super(props)

    this._handleSave = this._handleSave.bind(this)
  }

  _handleSave(data) {
    this.props.onSave(data)
  }

  _renderRow(locale, index) {
    const { fields: { locales } } = this.props
    const { code, accuracy } = locale
    return (
      <tr key={index}>
        <td>
          <FormGroup validationState={code.touched && code.error ? 'error' : null}>
            <FormControl type="text" {...code}/>
          </FormGroup>
        </td>
        <td>
          <FormGroup validationState={accuracy.touched && accuracy.error ? 'error' : null}>
            <FormControl type="number" {...accuracy}/>
          </FormGroup>
        </td>
        <td>
          <Button
            type="button"
            bsSize="xs"
            bsStyle="danger"
            onClick={() => locales.removeField(index)}>
            <i className="fa fa-minus"/>
          </Button>
        </td>
      </tr>
    )
  }

  render() {
    const { fields: { name, locales },
            handleSubmit
          } = this.props
    return (
      <div>
        <h1>{name ? `Edit Nationality: ${name.initialValue}` : 'New Nationality'}</h1>

        <form>
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
          </Row>
          <Table className="table table-bordered table-hover locales-table">
            <thead className="thin-border-bottom">
              <tr>
                <th className="">Code</th>
                <th className="">Accuracy</th>
                <th className="w-30"></th>
              </tr>
            </thead>
            <tbody>
              {locales.map((locale, index) => this._renderRow(locale, index))}
              <tr>
                <td colSpan="3">
                  <Button
                    type="button"
                    bsSize="xs"
                    className="pull-right"
                    bsStyle="success"
                    onClick={() => locales.addField()}>
                    <i className="fa fa-plus"/>
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>

          <div className="clearfix form-actions">
            <div className="center">
              <span className="mr10">
                <Button
                  bsStyle="danger" bsSize="small"
                  onClick={handleSubmit(this._handleSave)}>
                  <i className="ace-icon fa fa-check bigger-110"/>
                  Save
                </Button>
              </span>
              <Button href="#/nationalitys" bsStyle="default" bsSize="small">
                <i className="ace-icon fa f bigger-110"/>
                  Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

NationalityForm.propTypes = {
  categories: PropTypes.array,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func,
  id: PropTypes.string,
  onEdit: PropTypes.func,
  onNew: PropTypes.func,
  onSave: PropTypes.func.isRequired
}

function validateParams(nationality) {
  let constraints = {
    name: {
      presence: true
    }
  }
  return validate(nationality, constraints) || {}
}


NationalityForm = reduxForm({
  form: 'nationalityForm',
  fields: fields,
  validate: validateParams
})(NationalityForm)

export default NationalityForm