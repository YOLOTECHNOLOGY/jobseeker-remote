import React from 'react'
import { Snackbar, Alert } from '@mui/material'

type AlertColor = 'success' | 'info' | 'warning' | 'error';

interface SnackProps{
  content:string,
  duration?:number,
  type?:AlertColor
}

 const ToastItem = ( { content, duration = 3000, type = 'success' }: SnackProps) => {
  const [open, setOpen] = React.useState(true)
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={type}>
        {content}
      </Alert>
    </Snackbar>
  )
}

export default ToastItem