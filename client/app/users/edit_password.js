import React, { Component, PropTypes } from 'react'
import { Modal, HelpBlock, FormGroup, ControlLabel, FormControl, Button, Alert } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'
import validate from 'validate.js'

import { editPassword } from './user_actions'

class EditPassword extends Component {
  render() {
    const { fields: { currentPassword, newPassword, newPasswordConfirmation },
      handleSubmit, editPassword, onHide, isShow, message } = this.props

    return (
      <Modal show={isShow} onHide={onHide} bsSize="small" aria-labelledby="contained-modal-title-sm">
        <form onSubmit={handleSubmit((data) => editPassword(data))}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-sm">Edit Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {message !== '' ?
              <Alert bsStyle="danger" closeLabel="Close label">
                <p>{message}</p>
              </Alert>
              : ''
            }
            <FormGroup
              controlId="formControlsText"
              validationState={currentPassword.touched && currentPassword.error ? 'error' : null}>
              <ControlLabel>Current Password</ControlLabel>
              <FormControl type="password"
                placeholder="Enter text" {...currentPassword}/>
              <HelpBlock>
                {currentPassword.touched && currentPassword.error ? currentPassword.error[0] : null}
              </HelpBlock>
            </FormGroup>

            <FormGroup
              controlId="formControlsText"
              validationState={newPassword.touched && newPassword.error ? 'error' : null}>
              <ControlLabel>New Password</ControlLabel>
              <FormControl type="password"
                placeholder="Enter text" {...newPassword}/>
              <HelpBlock>{newPassword.touched && newPassword.error ? newPassword.error[0] : null}</HelpBlock>
            </FormGroup>

            <FormGroup
              controlId="formControlsText"
              validationState={newPasswordConfirmation.touched && newPasswordConfirmation.error ? 'error' : null}>
              <ControlLabel>Confirmation password</ControlLabel>
              <FormControl type="password"
                placeholder="Enter text" {...newPasswordConfirmation}/>
              <HelpBlock>
                {newPasswordConfirmation.touched && newPasswordConfirmation.error ?
                  newPasswordConfirmation.error[0]
                  :
                  null
                }
              </HelpBlock>
            </FormGroup>

          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-sm btn-danger" type="submit">
              <i className="ace-icon fa fa-lightbulb-o"/>
              <span className="bigger-110">Change password</span></Button>
            <Button className="btn btn-sm" onClick={onHide}>Close</Button>
          </Modal.Footer>
        </form>
      </Modal>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ editPassword }, dispatch)
}

function mapStateToProps(state) {
  return {
    message: state.editPassword.message,
    isShow: state.editPassword.isShow
  }
}

function validateParams(data) {
  let constraints = {
    currentPassword: {
      presence: true
    },
    newPassword: {
      presence: true
    },
    newPasswordConfirmation: {
      presence: true,
      equality: 'newPassword'
    }
  }
  return validate(data, constraints) || {}
}

EditPassword = reduxForm({
  form: 'EditPasswordForm',
  fields: ['currentPassword', 'newPassword', 'newPasswordConfirmation'],
  validate: validateParams
})(EditPassword)

EditPassword.propTypes = {
  editPassword: PropTypes.func.isRequired,
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
  isShow: PropTypes.bool,
  message: PropTypes.string,
  onHide: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPassword)