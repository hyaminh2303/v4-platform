import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import { Notifs } from 're-notif'

import { login } from '../login/session_actions'
import { THEME_NOTIFS } from '../app_constants'

class Login extends Component {
  handleLogin(data) {
    this.props.login(data.username, data.password)
  }

  render() {
    const { fields: { username, password }, handleSubmit } = this.props
    return (
      <div className="login-layout light-login full-height">
        <Notifs theme={THEME_NOTIFS}/>
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
                    <div id="login-box" className="login-box visible widget-box no-border">
                      <div className="widget-body">
                        <div className="widget-main">
                          <h4 className="header blue lighter bigger">
                            <i className="ace-icon fa fa-coffee green"/>
                            Please Enter Your Information
                          </h4>

                          <div className="space-6"></div>

                          <form>
                            <fieldset>
                              <label className="block clearfix">
                              <span className="block input-icon input-icon-right">
                                <input type="text" className="form-control" placeholder="Username" {...username}/>
                                <i className="ace-icon fa fa-user"/>
                              </span>
                              </label>

                              <label className="block clearfix">
                              <span className="block input-icon input-icon-right">
                                <input type="password" className="form-control" placeholder="Password" {...password}/>
                                  <i className="ace-icon fa fa-lock"/>
                              </span>
                              </label>
                              <div className="center">
                                <Button
                                  bsStyle="danger" bsSize="small"
                                  onClick={handleSubmit((data) => this.handleLogin(data))}>
                                  <i className="ace-icon fa fa-key"/>
                                  <span className="bigger-110">Login</span>
                                </Button>
                              </div>
                            </fieldset>
                          </form>
                        </div>

                        <div className="toolbar clearfix">
                          <div>
                            <a href="#/forgot_password"
                              data-target="#forgot-box"
                              className="forgot-password-link">
                              <i className="ace-icon fa fa-arrow-left"/> I forgot my password
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

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func,
  login: PropTypes.func
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ login }, dispatch)
}

Login = reduxForm({
  form: 'login',
  fields: ['username', 'password']
}, null, mapDispatchToProps)(Login)

export default Login
