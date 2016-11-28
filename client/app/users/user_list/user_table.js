import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Pagination, Label, DropdownButton } from 'react-bootstrap'
import SortHeader from '../../components/sort_header/'
import { FormattedDate } from 'react-intl'

import Confirm from '../../confirm/confirm'

class UserTable extends Component {
  constructor(props) {
    super(props)
    this.state = { showConfirm: false,
      titleConfirm: '',
      confirmType: 'delete',
      updateUserStatus: '',
      currentUser: null,
      updateStatus: '' }

    this._handlePageChange = this._handlePageChange.bind(this)
    this._handleSortChange = this._handleSortChange.bind(this)
    this._handleConfirm = this._handleConfirm.bind(this)
  }
  _getUser(index) {
    return this.props.users[index] || {}
  }
  _handlePageChange(page) {
    this.props.onPageChange(page)
  }
  _handleSortChange(columnKey, sortDir) {
    this.props.onSortChange(columnKey, sortDir)
  }
  _handleConfirm(state) {
    this.setState({ showConfirm: false,
      titleConfirm: '',
      confirmType: 'delete' })

    if (state === false)
      return false

    if (this.state.confirmType === 'delete') {
      this.props.onDeleteUser(this.state.currentUser.id)
    } else if (this.state.confirmType === 'status') {
      this.props.onChangeUserStatus(this.state.currentUser.id,
        this.state.updateStatus)
    } else if (this.state.confirmType === 'reset_password') {
      this.props.onResetUserPassword(this.state.currentUser)
    }
  }
  _openConfirm(type, user, updateStatus = '') {
    let msg = ''
    if (type === 'delete') {
      msg = `Are you sure you want to delete the user ${user.name} ?`
    } else if (type === 'status') {
      msg = `Are you sure you want to update status user ${user.name} to ${updateStatus}  ?`
    } else if (type === 'reset_password') {
      msg = `Are you sure you want to reset password the user ${user.name} ?`
    }
    this.setState({ showConfirm: true,
      titleConfirm: msg,
      confirmType: type,
      currentUser: user,
      updateStatus: updateStatus })
  }

  _status_tag(status) {
    if (status === 'enabled') {
      return (
        <Label bsStyle="success">{status}</Label>
      )
    } else {
      return (
        <Label bsStyle="danger">{status}</Label>
      )
    }
  }

  _renderDisableButton(user) {
    if (user.status === 'enabled') {
      return (
        <a
          onClick={() => { this._openConfirm('status', user, 'disabled') }}>
          <i className="fa fa-remove"/> Disable
        </a>
      )
    } else {
      return (
        <a
          onClick={() => { this._openConfirm('status', user, 'enabled') }}>
          <i className="fa fa-check-square-o"/> Enable
        </a>
      )
    }
  }

  _renderRow(user) {
    return (
      <tr key={user.id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.role_name}</td>
        <td>{this._status_tag(user.status)}</td>
        <td>
          <FormattedDate
            value={user.created_at}
            day="numeric"
            month="long"
            year="numeric" />
        </td>
        <td>
          <DropdownButton bsStyle="default"
            bsSize="xs" title={<i className="fa fa-cogs"/>}
            id="user_actions" pullRight>
            <li><Link to={`/users/${user.id}/edit`}><i className="fa fa-edit"/> Edit</Link></li>
            <li>{this._renderDisableButton(user)}</li>
            <li>
              <a onClick={() =>
                { this._openConfirm('reset_password', user) }} >
                <i className="fa fa-refresh"/> Reset Password
              </a>
            </li>
            <li>
              <a onClick={() => { this._openConfirm('delete', user) }}
                data-id={user.id}
                data-name={user.name}>
                <i className="fa fa-trash"/> Delete
              </a>
            </li>
          </DropdownButton>
        </td>
      </tr>
    )
  }

  render() {
    const { users, page, total, per_page, sortBy, sortDir } = this.props
    const sortDirs = { [sortBy]: sortDir }
    let total_page = Math.ceil(total / per_page)

    return (
      <div>
        <Confirm isShow={this.state.showConfirm}
          title={this.state.titleConfirm}
          onResult={this._handleConfirm}/>

        <table className="table table-bordered table-hover">
          <thead className="thin-border-bottom">
            <tr>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="name"
                  sortDir={sortDirs.name}>Name</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="email"
                  sortDir={sortDirs.email}>Email</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="role_id"
                  sortDir={sortDirs.role_id}>Role</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="status"
                  sortDir={sortDirs.status}>Status</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="created_at"
                  sortDir={sortDirs.created_at}>Created at</SortHeader>
              </th>
              <th className="actions"></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="center">No user available</td>
              </tr>) :
              users.map((user) => this._renderRow(user))
            }
          </tbody>
        </table>
        <div id="react-paginate" className="pull-right">
          <Pagination
            prev="<"
            next=">"
            first="<<"
            last=">>"
            ellipsis
            boundaryLinks
            items={total_page}
            activePage={page}
            maxButtons={5}
            onSelect={this._handlePageChange}/>
        </div>
      </div>
    )
  }
}

UserTable.propTypes = {
  onChangeUserStatus:  PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onResetUserPassword: PropTypes.func,
  onSortChange: PropTypes.func.isRequired,
  page: PropTypes.number,
  per_page: PropTypes.number,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string,
  total: PropTypes.number,
  users: PropTypes.array.isRequired
}

export default UserTable