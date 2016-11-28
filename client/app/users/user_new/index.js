import React, { Component, PropTypes } from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { showNotif } from '../../notification/notification_action'
import { clearUser, saveUser, editUser, newUser } from '../user_actions'
import UserForm from './user_form'

import 'react-select/dist/react-select.css'
import './style.css'

class UserNew extends Component {
  constructor(props) {
    super(props)
    this._handleSave = this._handleSave.bind(this)
    this._renderTitle = this._renderTitle.bind(this)
  }

  componentWillMount() {
    if (this.props.userId) {
      this.props.editUser(this.props.userId)
    } else {
      this.props.newUser()
    }
  }

  componentWillUnmount() {
    this.props.clearUser()
  }

  _handleSave(data) {
    this.props.saveUser(data, (dispatch) => {
      let mess = 'Create new user succsessfuly!'
      if (this.props.userId) {
        mess = 'Update information succsessfuly.'
      }
      dispatch(push('/users'))
      dispatch(showNotif({ message: mess, style: 'info' }))
    })
  }

  _renderTitle(breadcrumb = false) {
    if (this.props.userId) {
      if (this.props.user && breadcrumb) {
        return `Edit User: ${this.props.user.name}`
      } else {
        return 'Edit User'
      }
    } else {
      return 'New User'
    }
  }

  render() {
    const { user, userId, roles } = this.props
    return (
      <div className="user-new">
        <div className="breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="ace-icon fa fa-dashboard home-icon"/>
              <a href="#/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="#/users">Users</a>
            </li>
            <li className="active">{this._renderTitle('')}</li>
          </ul>
        </div>
        <div className="page-content">
          <div className="page-header">
            <h1>{this._renderTitle(true)}</h1>
          </div>
          <UserForm
            roles={roles}
            userId={userId}
            onSave={this._handleSave}
            initialValues={user} />
        </div>
      </div>
    )
  }
}

UserNew.propTypes = {
  clearUser: PropTypes.func,
  dispatch: PropTypes.func,
  editUser: PropTypes.func,
  newUser: PropTypes.func,
  roles: PropTypes.array,
  saveUser: PropTypes.func.isRequired,
  showNotif: PropTypes.func,
  user: PropTypes.object,
  userId: PropTypes.string
}

function mapStateToProps(state, ownProps) {
  let newState = {
    userId: ownProps.params.id,
    roles: state.user.roles
  }
  if (ownProps.params.id) {
    newState.user = state.user.user
  }
  return newState
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ clearUser, newUser, saveUser, editUser, showNotif }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserNew)
