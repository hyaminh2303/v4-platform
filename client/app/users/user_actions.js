import axios from 'axios'

import { push, replace } from 'react-router-redux'
import * as UserConstants from './user_constants'
const queryString = require('query-string')
import { showNotif } from '../notification/notification_action'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'

export function clearUser() {
  return { type: UserConstants.CLEAR_USER, payload: {} }
}

export function clearUsers() {
  return { type: UserConstants.CLEAR_USERS, payload: { data: [] } }
}

export function fetchUsers(params) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get('/users', { params }).then((resp) => {
      dispatch(hideLoading())
      dispatch({ type: UserConstants.FETCH_USER_SUCCESS, payload: resp.data })
    }).catch(() => {
      dispatch(hideLoading())
      //dispatch({ type: LOGIN_FAIL })
    })
  }
}

export function newUser() {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get('/users/new').then((resp) => {
      dispatch({ type: UserConstants.NEW_USER_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function editUser(id) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`/users/${id}/edit`).then((resp) => {
      dispatch({ type: UserConstants.EDIT_USER_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function saveUser(user, callback) {
  let method = null
  let url = ''
  if (user.id) {
    method = axios.put
    url = `/users/${user.id}`
  } else {
    method = axios.post
    url = '/users'
  }
  return (dispatch) => {
    dispatch(showLoading())
    method(url, user).then(() => {
      callback(dispatch)
      dispatch(hideLoading())
    }).catch((resp) => {
      dispatch(showNotif({ message: resp.data.message, style: 'danger' }))
      dispatch(hideLoading())
    })
  }
}

export function editUserInfor(user, callback) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.put('profile/', user).then(() => {
      callback(dispatch, user.name)
      dispatch(hideLoading())
    }).catch((resp) => {
      dispatch(hideLoading())
      dispatch(showNotif({ message: `${resp.data.message}`, style: 'danger' }))
    })
  }
}

export function fetchUser(id) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get(`/users/${id}`).then((resp) => {
      dispatch({ type: UserConstants.GET_USER_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
    }).catch(() => {
      dispatch(hideLoading())
      dispatch(push('users'))
      dispatch(showNotif({ message: 'User not found!', style: 'danger' }))
    })
  }
}

export function fetchUserProfile() {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get('/profile').then((resp) => {
      dispatch({ type: UserConstants.FETCH_USER_PROFILE_SUCCESS,
                 payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function deleteUser(id, params) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.delete(`/users/${id}`, {}).then(() => {
      dispatch(showNotif({ message: 'Delete user successfully!',
                           style: 'success' }))
      const url = `/users?${queryString.stringify(params)}`
      dispatch(replace(url))
      dispatch(fetchUsers(params))
      dispatch(hideLoading())
    }).catch(() => {
      dispatch(hideLoading())
      dispatch(showNotif({ message: 'Can not delete user have campaign data!',
                           style: 'danger' }))
    })
  }
}

export function editPassword(data) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.post('profile/update_password', {
      current_password: data.currentPassword,
      new_password: data.newPassword
    }).then(() => {
      dispatch({ type: UserConstants.EDIT_PASSWORD_SUCCESS })
      dispatch(hideLoading())
    }
    ).catch((resp) => {
      dispatch(hideLoading())
      dispatch({ type: UserConstants.EDIT_PASSWORD_FAIL, payload: resp.data })
    })
  }
}

export function initChangePassword() {
  return { type: UserConstants.INIT_CHANGE_PASSWORD }
}

export function cancelChangePassword() {
  return { type: UserConstants.CANCEL_CHANGE_PASSWORD }
}


export function resetUserPassword(user) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.post(`users/${user.id}/reset_user_password`).then((resp) => {
      dispatch({ type: UserConstants.RESET_USER_PASSWORD_SUCCESS,
                 payload: resp.data })
      dispatch(showNotif({ message: `The user ${user.name} password has been reset to: ${resp.data.password}`,
        style: 'success' }))
      dispatch(hideLoading())
    }).catch(() => {
      dispatch(hideLoading())
    })
  }
}