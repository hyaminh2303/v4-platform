import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'
import { Notifs } from 're-notif'
import validate from 'validate.js'
import { HelpBlock, FormGroup, FormControl } from 'react-bootstrap'

import * as AppConstants from '../app_constants'

import { resetPassword, checkResetToken } from './forgot_password_actions'

class ResetPassword extends Component {
  componentWillMount() {
    this.props.checkResetToken(this.props.token)
  }

  render() {
    const { fields: { password, passwordConfirmation }, handleSubmit, resetPassword, token } = this.props
    return (
      <div className="login-layout light-login">
        <Notifs theme={AppConstants.THEME_NOTIFS}/>
        <div className="main-container">
          <div className="main-content">
            <div className="row">
              <div className="col-sm-10 col-sm-offset-1">
                <div className="login-container">
                  <div className="center">
                    <h1>
                      <i className="ace-icon fa fa-dashboard green"/>
                      <span className="red">V4 Platform</span>
                    </h1>
                  </div>

                  <div className="space-6"></div>

                  <div className="position-relative">
                    <div id="forgot-box" className="login-box visible widget-box no-border">
                      <div className="widget-body">
                        <div className="widget-main">
                          <h4 className="header blue lighter bigger">
                            <i className="ace-icon fa fa-key "></i>
                            Change your password
                          </h4>

                          <form className="form-horizontal" onSubmit={
                            handleSubmit((data) => resetPassword(data.password, token))}>

                              <FormGroup
                                controlId="formControlsText"
                                validationState={password.touched && password.error ? 'error' : null}>
                                <FormControl type="password"
                                  placeholder="New password" {...password}/>
                                <HelpBlock>{password.touched && password.error ? password.error[0] : null}</HelpBlock>
                              </FormGroup>

                              <FormGroup
                                controlId="formControlsText"
                                validationState={passwordConfirmation.touched && passwordConfirmation.error ?
                                  'error' : null}>
                                <FormControl type="password"
                                  placeholder="New password confirmation" {...passwordConfirmation}/>
                                <HelpBlock>
                                  {passwordConfirmation.touched && passwordConfirmation.error ?
                                    passwordConfirmation.error[0]
                                    :
                                    null
                                  }
                                </HelpBlock>
                              </FormGroup>

                              <div className="clearfix center">
                                <button type="submit" className="btn btn-sm btn-primary">
                                  <i className="ace-icon fa fa-lightbulb-o"></i>
                                  <span className="bigger-110">Change your password</span>
                                </button>
                              </div>
                          </form>
                        </div>

                        <div className="toolbar clearfix center">
                          <div>
                            <a href="/" data-target="#forgot-box" className="forgot-password-link">
                              <i className="ace-icon fa fa-arrow-left"/>
                              Back to login
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetPassword, checkResetToken }, dispatch)
}

function mapStateToProps(state, ownProps) {
  return {
    token: ownProps.params.token
  }
}

function validateParams(data) {
  let constraints = {
    password: {
      presence: true
    },
    passwordConfirmation: {
      presence: true,
      equality: 'password'
    }
  }
  return validate(data, constraints) || {}
}

ResetPassword = reduxForm({
  form: 'ResetPasswordForm',
  fields: ['password', 'passwordConfirmation'],
  validate: validateParams
})(ResetPassword)

ResetPassword.propTypes = {
  checkResetToken: PropTypes.func,
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
  resetPassword: PropTypes.func.isRequired,
  token: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
