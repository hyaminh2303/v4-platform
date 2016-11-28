import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { closeAlert, showNotif } from '../../notification/notification_action'
import { clearUser, fetchUserProfile, editUserInfor } from '../user_actions'
import { update_session } from '../../login/session_actions'
import UserForm from './user_form'

import 'react-select/dist/react-select.css'
import './style.css'

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this._handleSave = this._handleSave.bind(this)
  }

  componentWillMount() {
    this.props.fetchUserProfile()
  }

  componentWillUnmount() {
    this.props.closeAlert()
    this.props.clearUser()
  }

  _handleSave(data) {
    this.props.editUserInfor(data, (dispatch, name_updated) => {
      const { session: { auth_token, id, isAuthenticated, isLoading, role_key } } = this.props
      this.props.update_session({
        isAuthenticated: isAuthenticated,
        auth_token: auth_token,
        role_key: role_key,
        name: name_updated,
        id: id,
        isLoading: isLoading
      })
      dispatch(showNotif({ message: 'Update information succsessfuly.', style: 'info' }))
    })
  }

  render() {
    const { user, roles, session } = this.props
    return (
      <div className="user-new">
        <div className="breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="ace-icon fa fa-dashboard home-icon"/>
              <a href="#/dashboard">Dashboard</a>
            </li>
            <li className="active">User Information</li>
          </ul>
        </div>
        <div className="page-content">
          <div className="page-header">
            <h1>{`User Information: ${this.props.session.name}`}</h1>
          </div>
          <UserForm
            roles={roles}
            userId={session.id}
            onSave={this._handleSave}
            initialValues={user}
            sessionUser={true}/>
        </div>
      </div>
    )
  }
}

UserProfile.propTypes = {
  clearUser: PropTypes.func,
  closeAlert: PropTypes.func,
  dispatch: PropTypes.func,
  editUserInfor: PropTypes.func,
  fetchUserProfile: PropTypes.func,
  roles: PropTypes.array,
  session: PropTypes.object,
  update_session: PropTypes.func,
  user:PropTypes.object
}

function mapStateToProps(state) {
  return {
    roles: state.user.roles,
    session: state.session,
    user: state.user.user
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ clearUser, closeAlert, fetchUserProfile, editUserInfor, update_session }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
