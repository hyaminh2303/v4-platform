import React, { Component, PropTypes } from 'react'
import { Row, Col, HelpBlock, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import validate from 'validate.js'
import { extend } from 'lodash'
import Selector from 'react-select'
import Notification from '../../notification/'

import 'react-select/dist/react-select.css'
import './style.css'

class UserForm extends Component {
  render() {
    const { fields: { name, email, password, role_id }, handleSubmit } = this.props
    return (
      <form className="form-horizontal" autoComplete="off">
        <Notification />
        <Row className = "user-row">
           <FormGroup
             controlId="formControlsText"
             validationState={name.touched && name.error ? 'error' : null}>
            <Col componentClass={ControlLabel} sm={3}>
              Name
            </Col>
            <Col sm={8}>
              <FormControl type="text" {...name}/>
              <FormControl.Feedback />
              <HelpBlock>{name.touched && name.error ? name.error[0] : null}</HelpBlock>
            </Col>
          </FormGroup>
        </Row>
        <Row className = "user-row">
           <FormGroup
             controlId="formControlsText"
             validationState={email.touched && email.error ? 'error' : null}>
            <Col componentClass={ControlLabel} sm={3}>
              Email
            </Col>
            <Col sm={8}>
              <FormControl type="text" {...email}/>
              <FormControl.Feedback />
              <HelpBlock>{email.touched && email.error ? email.error[0] : null}</HelpBlock>
            </Col>
          </FormGroup>
        </Row>
        <Row className = "user-row">
           <FormGroup
             controlId="formControlsText"
             validationState={password.touched && password.error ? 'error' : null}>
            <Col componentClass={ControlLabel} sm={3} >
             Password
            </Col>
            <Col sm={8}>
              <FormControl type="password" {...password}/>
              <FormControl.Feedback />
              <HelpBlock>{password.touched && password.error ? password.error[0] : null}</HelpBlock>
            </Col>
          </FormGroup>
        </Row>
        <Row className = "user-row">
          <FormGroup
            controlId="formControlsText"
            validationState={role_id.touched && role_id.error ? 'error' : null}>
            <label className ={role_id.touched && role_id.error ? 'label-role-error' : 'control-label col-xs-3'}>
              Role</label>
            <div className = "col-xs-8">
              <Selector
                valueKey="id"
                labelKey="name"
                disabled={this.props.sessionUser}
                options={this.props.roles}
                value={role_id.value}
                onChange={role_id.onChange} />
              <HelpBlock>{role_id.touched && role_id.error ? role_id.error[0] : null}</HelpBlock>
            </div>
          </FormGroup>
        </Row>
        <div className="clearfix form-actions">
          <div className="center">
            <Button
              bsStyle="danger" bsSize="small"
              onClick={handleSubmit((data) => this.props.onSave(data))}>
              <i className="ace-icon fa fa-check bigger-110"/>
              Save
            </Button>
          </div>
        </div>
      </form>
    )
  }
}

UserForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  roles: PropTypes.array,
  sessionUser: PropTypes.bool,
  userId: PropTypes.string

}

function validateParams(data, props) {
  let constraints = {
    name: {
      presence: true
    },
    email: {
      presence: true,
      email: { message: "doesn't look like a valid email." }
    },
    role_id: {
      presence: { message: "Role can't be blank." }
    }
  }
  const new_contraints = {
    password: {
      presence: true
    }
  }
  if (!props.userId) {
    constraints = extend(constraints, new_contraints)
  }
  return validate(data, constraints) || {}
}

export default reduxForm({
  form: 'userForm',
  fields: ['id', 'name', 'email', 'password', 'role_id', 'role_name'],
  validate: validateParams
})(UserForm)