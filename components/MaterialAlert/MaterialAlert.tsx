import { Alert, AlertColor } from '@mui/material'
import styles from './MaterialAlert.module.scss'

type MaterialAlertProps = {
  open?: boolean
  action?: React.ReactNode
  children?: React.ReactNode
  severity: AlertColor
}

const MaterialAlert = ({ open, action, children, severity }: MaterialAlertProps) => {
  return (
    <div className={open ? styles.alertContainerOpen : styles.alertContainerClose}>
      <Alert
        severity={severity}
        action={action}
        sx={{
          width: '100%',
          fontSize: '16px',
          letterSpacing: '1px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </Alert>
    </div>
  )
}

export default MaterialAlert
