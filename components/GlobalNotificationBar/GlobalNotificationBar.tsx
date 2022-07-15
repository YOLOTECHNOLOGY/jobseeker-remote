import { Snackbar, Alert } from '@mui/material'
import { useDispatch } from 'react-redux'
import { unsetGlobalError } from '../../store/actions/error/globalError'

type GlobalNotificationBarProps = {
  message?: string
  severity?: any
}

const defaultErrorMessage = 'We are sorry. Something went wrong. There was an unexpected server error. Try refreshing the page or contact support@bossjob.com for assistance.'

const GlobalNotificationBar = ({ message = defaultErrorMessage, severity = 'error' }: GlobalNotificationBarProps) => {
  const dispatch = useDispatch()
  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(unsetGlobalError())
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
