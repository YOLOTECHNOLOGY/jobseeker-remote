import { Alert, AlertColor, Snackbar } from '@mui/material'
import React, { SetStateAction } from 'react'
import styles from './MaterialSnackbar.module.scss'

type SnackbarProps = {
  open: boolean
  setOpen?: (value: SetStateAction<boolean>) => void
  autoHideDuration?: number
  handleClose?: any
  action?: React.ReactNode
  children?: React.ReactNode
  severity: AlertColor
}

const MaterialSnackbar = ({
  open,
  autoHideDuration,
  handleClose,
  action,
  children,
  severity,
}: SnackbarProps) => {
  return (
    <div className={open ? styles.snackbarContainerOpen : styles.snackbarContainerClose}>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={autoHideDuration}
        className={styles.snackbar}
        onClose={autoHideDuration ? handleClose : undefined}
      >
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
      </Snackbar>
    </div>
  )
}

export default MaterialSnackbar
