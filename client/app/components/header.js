import React, { Component, PropTypes } from 'react'
import { Nav, NavDropdown, MenuItem } from 'react-bootstrap'

class Header extends Component {
  render() {
    return (
      <div>
        <div id="navbar" className="navbar navbar-default">
          <div className="navbar-container ace-save-state" id="navbar-container">
            <button type="button" className="navbar-toggle menu-toggler pull-left" id="menu-toggler">
              <span className="sr-only">Toggle sidebar</span>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
            </button>

            <div className="navbar-header pull-left">
              <a href="#" className="navbar-brand">
                <small>
                  <i className="fa fa-dashboard"/> YOOSE Platform
                </small>
              </a>
            </div>
          </div>
          <Nav pullRight>
            <NavDropdown title={this.props.session.name} pullRight id="navHeader">
              <MenuItem onSelect={() => this.props.onChangePassword()}>Change Password</MenuItem>
              <MenuItem href={'/#/profile'}>My Account</MenuItem>
              <MenuItem divider />
              <MenuItem onSelect={() => this.props.onLogout()}>Log Out</MenuItem>
            </NavDropdown>
          </Nav>
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  onChangePassword: PropTypes.func,
  onEditAccountInfo: PropTypes.func,
  onLogout: PropTypes.func,
  session: PropTypes.object.isRequired
}

export default Header