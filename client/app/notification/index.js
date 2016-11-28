import React, { Component, PropTypes } from 'react'
import { Alert } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { closeAlert } from './notification_action'

class Notification extends Component {

  componentWillUnmount() {
    this.props.closeAlert()
  }
  render() {
    return (
      <div>
        {this.props.isShow ?
          <Alert
            bsStyle={this.props.style}
            onDismiss={() => this.props.closeAlert()}>
            <div dangerouslySetInnerHTML={{ __html: this.props.message }}></div>
          </Alert>
          : ''
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isShow: state.notification.isShow,
    style: state.notification.style,
    message: state.notification.message
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ closeAlert }, dispatch)
}

Notification.propTypes = {
  closeAlert: PropTypes.func,
  isShow: PropTypes.bool,
  message: PropTypes.string,
  style: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification)