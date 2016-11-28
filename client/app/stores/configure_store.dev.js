import { routerMiddleware } from 'react-router-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import appReducer from '../reducers'
import DevTools from '../components/dev_tools'

export default function configureStore(history, initialState = {}) {
  const store = createStore(
    appReducer,
    initialState,
    compose(applyMiddleware(thunk, routerMiddleware(history)), DevTools.instrument())
  )

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}