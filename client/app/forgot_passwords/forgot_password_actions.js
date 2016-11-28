import axios from 'axios'
import { push } from 'react-router-redux'
import * as PasswordConstants from './forgot_password_constants'

import { actions as notifActions } from 're-notif'
const { notifSend } = notifActions

export function forgotPassword(data) {
  return (dispatch) => {
    axios.post('/recoveries', { email: data.email }).then(( ) => {
      dispatch(notifSend({
        message: 'Email sent with password reset instructions.',
        kind: 'success',
        dismissAfter: 3000
      }))
      dispatch(push('/'))
    }).catch((resp) => {
      dispatch({ type: PasswordConstants.SENT_PASSWORD_INSTRUCTION_FAIL, payload: resp.data })
    })
  }
}

export function resetPassword(password, token) {
  return (dispatch) => {
    axios.put(`recoveries/${token}`, { password: password }).then(() => {
      dispatch(notifSend({ message: 'Passwords has been updated', kind: 'success', dismissAfter: 3000 }))
      dispatch(push('/'))
    }).catch((resp) => {
      dispatch(notifSend({ message: resp.data.message, kind: 'danger', dismissAfter: 3000 }))
    })
  }
}

export function checkResetToken(token) {
  return (dispatch) => {
    axios.get(`recoveries/${token}`).then(() => {
    }).catch((resp) => {
      dispatch(notifSend({ message: resp.data.message, kind: 'danger', dismissAfter: 3000 }))
      dispatch(push('/'))
    })
  }
}