import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import './style.css'

class LoadingPage extends Component {
  render() {
    const { loadingPage: { loaded } } = this.props
    const klass = loaded ? 'hide' : 'loading-page'

    return (
      <div>
        <div className={klass}>
          <i className="loading-icon fa fa-refresh fa-spin fa-3x"/>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loadingPage: state.loadingPage
  }
}

LoadingPage.propTypes = {
  loadingPage: PropTypes.object
}

export default connect(mapStateToProps)(LoadingPage)
