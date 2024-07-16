import { useQuasar } from 'quasar'

export function useNotification() {
  const $q = useQuasar()

  const showInfo = (message, yesHandler = () => {}, noHandler = () => {}) => {
    console.log(`Notification: ${message}`)
    $q.notify({
      type: 'info',
      color: 'primary',
      message: message,
      position: "top",
      timeout: 0,
      actions: [
        { label: 'Yes', color: 'yellow', handler: yesHandler },
        { label: 'No', color: 'white', handler: noHandler }
      ]
    })
  }

  const showWarning = (message) => {
    console.log(`Notification: ${message}`)
    $q.notify({
      type: 'warning',
      message: message,
      position: "top",
    })
  }

  return {
    showInfo,
    showWarning
  }
}
