import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import routes from '../routes'

class Root extends Component {
  render() {
    const { store } = this.props
    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={hashHistory}>{routes}</Router>
        </div>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object
}

module.exports = Root
