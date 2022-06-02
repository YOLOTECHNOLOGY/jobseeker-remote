import { useSelector, connect } from 'react-redux'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { closeNotification } from 'store/actions/notificationBar/notificationBar'


interface NotificationBarProps {
  closeNotification: Function
}

const NotificationBar = (
  { closeNotification } : NotificationBarProps
) => {

  const open = useSelector((store: any) => store.notificationbar.notification.open)
  const severity = useSelector((store: any) => store.notificationbar.notification.severity)
  const message = useSelector((store: any) => store.notificationbar.notification.message)

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    closeNotification()

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

const mapDispatchToProps = (dispatch) => ({
  closeNotification: () => dispatch(closeNotification())
})

export default connect(null, mapDispatchToProps)(NotificationBar)