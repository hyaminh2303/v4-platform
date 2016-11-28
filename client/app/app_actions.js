import { actions as notifActions } from 're-notif'
const { notifSend } = notifActions

export function showResponeErrors(messages, dispatch) {
  messages.forEach( (mess) => {
    dispatch(
      notifSend({ message: mess, kind: 'danger', dismissAfter: 3000 })
    )
  })
}

