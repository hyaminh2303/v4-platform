import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import DevTools from './dev_tools'
import routes from '../routes'

class Root extends Component {
  render() {
    const { store, history } = this.props
    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={history}>{routes}</Router>
          <DevTools />
        </div>
      </Provider>
    )
  }
}

Root.propTypes = {
  history: PropTypes.object,
  store: PropTypes.object
}

module.exports = Root
