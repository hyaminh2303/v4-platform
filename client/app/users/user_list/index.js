import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { clearUsers, fetchUsers, deleteUser, saveUser,
         resetUserPassword } from '../user_actions'
import { replace } from 'react-router-redux'
import { Row, Col } from 'react-bootstrap'
import { showNotif } from '../../notification/notification_action'
const queryString = require('query-string')
import _ from 'lodash'

import UserSearchBar from './user_search_bar'
import UserTable from './user_table'
import Notification from '../../notification/'

class UserList extends Component {
  constructor(props) {
    super(props)

    this._handleSearch = this._handleSearch.bind(this)
    this._handlePageChange = this._handlePageChange.bind(this)
    this._handleSortChange = this._handleSortChange.bind(this)
    this._handleDeleteUser = this._handleDeleteUser.bind(this)
    this._handleChangeUserStatus = this._handleChangeUserStatus.bind(this)
    this._handleResetUserPassword = this._handleResetUserPassword.bind(this)
  }

  componentWillMount() {
    this._refresh(this.props.initParams)
  }

  componentWillUnmount() {
    this.props.clearUsers()
  }

  _handleSearch(params) {
    params.page = 1
    this._refresh(params)
  }

  _handlePageChange(page) {
    this._refresh({ page: page })
  }

  _handleSortChange(columnKey, sortDir) {
    this._refresh({ sort_by: columnKey, sort_dir: sortDir, page: 1 })
  }

  _handleDeleteUser(id) {
    this.props.deleteUser(id, this.props.location.query)
  }

  _handleChangeUserStatus(id, status) {
    const { saveUser, replace, showNotif, fetchUsers, location: { query } } = this.props
    saveUser({ id: id, status: status }, () => {
      showNotif({ message: `${_.capitalize(status)} status user successfully!`,
                  style: 'success' })
      const url = `/users?${queryString.stringify(query)}`
      replace(url)
      fetchUsers(query)
    })
  }

  _handleResetUserPassword(id) {
    this.props.resetUserPassword(id)
  }

  _refresh(params) {
    const { initParams } = this.props

    if (params.query === undefined) {
      params.query = initParams.query || ''
    }

    params.page = params.page || initParams.page || 1
    params.sort_by = params.sort_by || initParams.sort_by
    params.sort_dir = params.sort_dir || initParams.sort_dir

    const params_str = queryString.stringify(params)

    this.props.replace(`/users?${params_str}`)
    this.props.fetchUsers(params)
  }

  render() {
    const { users, initParams } = this.props

    return (
      <div className="user-list">
        <div className="breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="ace-icon fa fa-dashboard home-icon"/>
              <a href="#/dashboard">Dashboard</a>
            </li>
            <li className="active">
              Users
            </li>
          </ul>
        </div>
        <div className="page-content">
          <div className="page-header">
            <h1> Users </h1>
          </div>
          <Notification />
          <Row>
            <Col md={3}>
              <Link to={'/users/new'} className="btn btn-sm btn-danger">
                <i className="fa fa-plus-circle"/> Add new
              </Link>
            </Col>
            <Col md={6} mdOffset={3}>
              <UserSearchBar onSearch={this._handleSearch} query={initParams.query} />
            </Col>
          </Row>
          <UserTable users={users.data}
            total={users.total} per_page={users.per_page}
            page={users.page} sortDir={initParams.sort_dir}
            sortBy={initParams.sort_by}
            onPageChange={this._handlePageChange}
            onSortChange={this._handleSortChange}
            onDeleteUser={this._handleDeleteUser}
            onResetUserPassword={this._handleResetUserPassword}
            onChangeUserStatus={this._handleChangeUserStatus}/>
          <div className="clearfix"></div>
        </div>
      </div>
    )
  }
}

UserList.propTypes = {
  clearUsers: PropTypes.func,
  deleteUser: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  initParams: PropTypes.object,
  location: PropTypes.object,
  page: PropTypes.number,
  replace: PropTypes.func,
  resetUserPassword: PropTypes.func,
  saveUser: PropTypes.func.isRequired,
  showNotif: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string,
  users: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  const query = ownProps.location.query

  return {
    users: state.users,
    session: state.session,
    initParams: {
      query: query.query || '',
      page: query.page || 1,
      sort_by: query.sort_by || '',
      sort_dir: query.sort_dir || ''
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ clearUsers, fetchUsers, deleteUser,
    replace, saveUser, showNotif, queryString, resetUserPassword }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList)