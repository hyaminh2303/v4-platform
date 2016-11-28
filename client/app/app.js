import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from './components/header'
import Sidebar from './components/sidebar'
import Login from './login/'
import { Notifs } from 're-notif'

import EditPassword from './users/edit_password'
import { checkAuthToken, logout } from './login/session_actions'
import { initChangePassword, cancelChangePassword } from './users/user_actions'
import * as AppConstants from './app_constants'
import LoadingPage from './loading_page/loading_page'

class App extends Component {
  componentWillMount() {
    this.props.checkAuthToken()
  }

  _renderChildren() {
    const { session, children, location: { pathname } } = this.props
    const guestPaths = ['/profile', '/campaigns', '/', '/dashboard']
    const guestDeny = pathname.indexOf('edit') > -1 ||
                      pathname.indexOf('delete') > -1
    const notCampaignDetailPath = pathname.indexOf('/campaigns/') < 0
    const notInGuestPath  = guestPaths.indexOf(pathname) < 0

    if (session.role_key === 'guest' && ((notCampaignDetailPath && notInGuestPath) || guestDeny) ) {
      return (
        <div className="campaign-new">
          <div className="breadcrumbs">
            <ul className="breadcrumb">
              <li>
                <i className="ace-icon fa fa-dashboard home-icon"/>
                <a href="#/dashboard">Dashboard</a>
              </li>
            </ul>
          </div>
          <div className="page-content">
            <div className="page-header">
              <h1>Not authorized!</h1>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        children
      )
    }
  }

  render() {
    const { session, cancelChangePassword } = this.props
    if (session.isLoading) {
      return <div></div>
    } else {
      if (session.isAuthenticated) {
        return (
          <div className="skin-yoose">
            <LoadingPage />
            <Header
              session={session}
              onChangePassword={() => this.props.initChangePassword()}
              onLogout={() => this.props.logout()}/>
            <Sidebar session={session}/>
            <div className="main-content full-height bg-white">
              <div className="main-content-inner">
                <Notifs theme={AppConstants.THEME_NOTIFS}/>
                {this._renderChildren()}
              </div>
            </div>
            <EditPassword onHide={() => cancelChangePassword()}/>
          </div>
        )
      } else {
        return <Login/>
      }
    }
  }
}

App.propTypes = {
  cancelChangePassword: PropTypes.func,
  checkAuthToken: PropTypes.func,
  children: PropTypes.object,
  initChangePassword: PropTypes.func,
  logout: PropTypes.func,
  session: PropTypes.object
}

function mapStateToProps(state) {
  return { session: state.session }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ checkAuthToken, logout, initChangePassword, cancelChangePassword }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)