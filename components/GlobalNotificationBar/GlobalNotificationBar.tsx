import { Snackbar, Alert } from '@mui/material'
import { useDispatch } from 'react-redux'
import { closeNotification } from '../../store/actions/notificationBar/notificationBar'

type GlobalNotificationBarProps = {
  message: string
  severity: any
}

const GlobalNotificationBar = ({ message, severity }: GlobalNotificationBarProps) => {
  const dispatch = useDispatch()
  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(closeNotification())
  }
  return (
    <div>
      <Snackbar open={true} onClose={handleClose}>
        <Alert sx={{ width: '100%' }} severity={severity} onClose={handleClose}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default GlobalNotificationBar
