export function showNotif(notif) {
  return {
    type: 'DISPLAY_NOTIFICATION',
    payload: {
      message: notif.message,
      style: notif.style,
      isShow: true
    }
  }
}

export function closeAlert() {
  return { type: 'HIDE_NOTIFICATION' }
}