import { useSelector, useDispatch } from 'react-redux'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { closeNotification } from 'store/actions/notificationBar/notificationBar'


const NotificationBar = () => {
  const dispatch = useDispatch()
  const open = useSelector((store: any) => store.notificationbar.notification.open)
  const severity = useSelector((store: any) => store.notificationbar.notification.severity)
  const message = useSelector((store: any) => store.notificationbar.notification.message)

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(closeNotification())

  }

  return (
    <div>
      <Snackbar
        open={open}
        onClose={handleClose}
      >
        <Alert
          sx={{ width: '100%' }}
          severity={severity}
          onClose={handleClose}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default NotificationBar