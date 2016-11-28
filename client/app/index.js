import React from 'react'
import ReactDOM from 'react-dom'
import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from './stores/configure_store'
import { IntlProvider } from 'react-intl'


import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'
import '../assets/theme.css'
import '../assets/yoose-skin.css'
import '../assets/custom.css'

import './config'
import Root from './components/root'

const store = configureStore(hashHistory)
const history = syncHistoryWithStore(hashHistory, store)

if (!global.Intl) {
  require('intl')
  require('intl/locale-data/jsonp/en.js')
}

ReactDOM.render(
  <IntlProvider locale="en">
    <Root store={store} history={history} />
  </IntlProvider>
  , document.getElementById('app'))
