import axios from 'axios'
import cookie from 'cookie'

import * as SessionConstants from './session_constants'

function authSession(token) {
  document.cookie = cookie.serialize('auth_token', token)
  axios.defaults.headers['X-API-TOKEN'] = token
}

function clearSession() {
  document.cookie = cookie.serialize('auth_token', null)
  axios.defaults.headers.common.Authorization = null
}

export function login(username, password) {
  return (dispatch) => {
    axios.post('/login', { username: username, password: password }).then((resp) => {
      authSession(resp.data.auth_token)
      dispatch({ type: SessionConstants.LOGIN_SUCCESS, payload: resp.data })
    }).catch(() => {
      dispatch({ type: SessionConstants.LOGIN_FAIL })
    })
  }
}

export function checkAuthToken() {
  return (dispatch) => {
    let cookies = cookie.parse(document.cookie)
    let token = cookies.auth_token
    if (token) {
      dispatch({ type: SessionConstants.CHECK_AUTH_TOKEN })
      axios.post('/login', { token: token }).then((resp) => {
        authSession(resp.data.auth_token)
        dispatch({ type: SessionConstants.LOGIN_SUCCESS, payload: resp.data })
      }).catch(() => {
        dispatch({ type: SessionConstants.LOGIN_FAIL })
      })
    } else {
      dispatch({ type: SessionConstants.LOGIN_FAIL })
    }
  }
}

export function logout() {
  clearSession()
  return { type: SessionConstants.LOG_OUT }
}

export function update_session(data) {
  return {
    type: SessionConstants.UPDATE_USER_SUCCESS,
    payload: data
  }
}