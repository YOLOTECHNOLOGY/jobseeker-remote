import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import styles from './index.module.scss'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import classNames from 'classnames/bind'
import DialogTitle from '@mui/material/DialogTitle'
import CloseIcon from '@mui/icons-material/Close'

interface ModalJobAlertsProps {
  open: boolean
  lang: any
  handleClose: () => void
  handleSave: Function
  children: React.ReactNode
  cancel: string
  confirm: string
  title: string
}

export default function FormDialog(props: ModalJobAlertsProps) {
  const { open, lang, title, handleClose, handleSave, cancel, confirm } = props

  const handleCloseMethod = () => {
    handleClose()
  }

  const handleSaveMethod = () => {
    handleSave()
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={handleCloseMethod}>
        <div className={styles.wrapper}>
          <DialogTitle>
            <div className={styles.title}>
              <span>{title}</span>
              <CloseIcon onClick={handleCloseMethod} sx={{ color: '#BCBCBC', cursor: 'pointer' }} />
            </div>
          </DialogTitle>
          <DialogContent>{props.children}</DialogContent>

          <DialogActions>
            <div className={styles.actions}>
              <div
                className={classNames([styles.cancel, styles.actionsItem])}
                onClick={handleCloseMethod}
              >
                {cancel}
              </div>
              <div
                className={classNames([styles.save, styles.actionsItem])}
                onClick={handleSaveMethod}
              >
                {confirm}
              </div>
            </div>
          </DialogActions>
        </div>
      </Dialog>
    </ThemeProvider>
  )
}
