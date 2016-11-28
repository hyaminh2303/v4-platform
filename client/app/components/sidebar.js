import React, { PropTypes } from 'react'

class Sidebar extends React.Component {
  _renderUserMenu() {
    if (this.props.session.role_key === 'super_admin') {
      return (
        <li className="">
          <a href="#/users" className="dropdown-toggle">
            <i className="menu-icon fa fa-user"/>
            <span className="menu-text"> Users </span>
          </a>
        </li>
      )
    }
  }

  _renderGuestMenu() {
    return (
      <div id="sidebar" className="sidebar responsive ace-save-state"
          data-sidebar="true" data-sidebar-scroll="true" data-sidebar-hover="true">
        <ul className="nav nav-list" style={{ top: 0 }}>
          <li className="active">
            <a href="#">
              <i className="menu-icon fa fa-tachometer"/>
              <span className="menu-text"> Dashboard </span>
            </a>

            <b className="arrow"/>
          </li>
          <li>
            <a href="#/campaigns" className="dropdown-toggle">
              <i className="menu-icon fa fa-list"/>
              <span className="menu-text"> Campaigns </span>
            </a>
          </li>
        </ul>
      </div>
    )
  }

  _renderAdminMenu() {
    return (
      <div
          id="sidebar" className="sidebar responsive ace-save-state"
          data-sidebar="true" data-sidebar-scroll="true" data-sidebar-hover="true">
        <ul className="nav nav-list" style={{ top: 0 }}>
          <li className="active">
            <a href="#">
              <i className="menu-icon fa fa-tachometer"/>
              <span className="menu-text"> Dashboard </span>
            </a>

            <b className="arrow"/>
          </li>

          <li>
            <a href="#/campaigns" className="dropdown-toggle">
              <i className="menu-icon fa fa-list"/>
              <span className="menu-text"> Campaigns </span>
            </a>
          </li>
          {this._renderUserMenu()}
          <li>
            <a href="#/reporting" className="dropdown-toggle">
              <i className="menu-icon fa fa-area-chart"/>
              <span className="menu-text"> Reporting </span>
            </a>
          </li>
          <li>
            <a href="#/vast_generator" className="dropdown-toggle">
              <i className="menu-icon fa fa-file-o"/>
              <span className="menu-text"> Vast Generator </span>
            </a>
          </li>
          <li>
            <a href="#/nationalities" className="dropdown-toggle">
              <i className="menu-icon fa fa-file-o"/>
              <span className="menu-text"> Nationaltity </span>
            </a>
          </li>
        </ul>
      </div>
    )
  }

  _renderOpsMenu() {
    return (
      <div
          id="sidebar" className="sidebar responsive ace-save-state"
          data-sidebar="true" data-sidebar-scroll="true" data-sidebar-hover="true">
        <ul className="nav nav-list" style={{ top: 0 }}>
          <li className="active">
            <a href="#">
              <i className="menu-icon fa fa-tachometer"/>
              <span className="menu-text"> Dashboard </span>
            </a>

            <b className="arrow"/>
          </li>

          <li>
            <a href="#/campaigns" className="dropdown-toggle">
              <i className="menu-icon fa fa-list"/>
              <span className="menu-text"> Campaigns </span>
            </a>
          </li>
          {this._renderUserMenu()}
          <li>
            <a href="#/reporting" className="dropdown-toggle">
              <i className="menu-icon fa fa-area-chart"/>
              <span className="menu-text"> Reporting </span>
            </a>
          </li>
          <li>
            <a href="#/vast_generator" className="dropdown-toggle">
              <i className="menu-icon fa fa-file-o"/>
              <span className="menu-text"> Vast Generator </span>
            </a>
          </li>
        </ul>
      </div>
    )
  }

  render() {
    if(this.props.session.role_key === 'super_admin')
      return this._renderAdminMenu()
    if(this.props.session.role_key === 'admin') // ops
      return this._renderOpsMenu()
    else
      return this._renderGuestMenu()
  }
}

Sidebar.propTypes = {
  session: PropTypes.object
}

export default Sidebar
