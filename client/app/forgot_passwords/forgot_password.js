import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'
import { Alert, FormControl } from 'react-bootstrap'
import validate from 'validate.js'

import { forgotPassword } from './forgot_password_actions'

class ForgotPassword extends Component {
  render() {
    const { fields: { email }, handleSubmit, forgotPassword } = this.props
    return (
      <div className="login-layout light-login full-height">
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
                    <div id="forgot-box" className="forgot-box widget-box no-border visible">
                      <div className="widget-body">
                        <div className="widget-main">
                          <h4 className="header red lighter bigger">
                            <i className="ace-icon fa fa-key"></i>
                            Retrieve Password
                          </h4>

                          <div className="space-6"></div>
                          <p>
                            Enter your email and to receive instructions
                          </p>

                          <form onSubmit={handleSubmit((data) => forgotPassword(data))} noValidate>
                            {this.props.message !== '' ?
                              <Alert bsStyle="danger" closeLabel="Close label">
                                <p>{this.props.message}</p>
                              </Alert>
                              : ''
                            }
                            <fieldset>
                              <FormControl
                                type="email"
                                placeholder="Email"
                                wrapperClassName="block input-icon input-icon-right"
                                bsStyle={email.touched && email.error ? 'error' : null}
                                {...email} />

                              <div className="clearfix">
                                <button type="submit" className="width-35 pull-right btn btn-sm btn-danger">
                                  <i className="ace-icon fa fa-lightbulb-o"/>
                                  <span className="bigger-110">Send Me!</span>
                                </button>
                              </div>
                            </fieldset>
                          </form>
                        </div>

                        <div className="toolbar center">
                          <a href="#" data-target="#login-box" className="back-to-login-link">
                            Back to login <i className="ace-icon fa fa-arrow-right"/>
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
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ forgotPassword }, dispatch)
}

function mapStateToProps(state) {
  return {
    message: state.forgotPassword.message
  }
}

function validateParams(data) {
  let constraints = {
    email: {
      presence: true,
      email: true
    }
  }
  return validate(data, constraints) || {}
}

ForgotPassword = reduxForm({
  form: 'sendPasswordInstructionForm',
  fields: ['email'],
  validate: validateParams
})(ForgotPassword)

ForgotPassword.propTypes = {
  fields: PropTypes.object,
  forgotPassword: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  message: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
