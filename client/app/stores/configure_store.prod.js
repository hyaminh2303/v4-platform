import { routerMiddleware } from 'react-router-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import appReducer from '../reducers'

export default function configureStore(history, initialState = {}) {
  return createStore(
    appReducer,
    initialState,
    applyMiddleware(thunk, routerMiddleware(history))
  )
}