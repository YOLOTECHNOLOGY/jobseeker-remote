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
import CircularProgress from '@mui/material/CircularProgress'

interface ModalJobAlertsProps {
  open: boolean
  lang: any
  handleClose: () => void
  handleSave: Function
  children: React.ReactNode
  cancel: string
  confirm: string
  title: string
  isLoading?: boolean
}

export default function FormDialog(props: ModalJobAlertsProps) {
  const { open, lang, title, handleClose, handleSave, cancel, confirm, isLoading = false } = props

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
                {isLoading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: '#ffffff',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px'
                    }}
                  />
                ) : (
                  confirm
                )}
              </div>
            </div>
          </DialogActions>
        </div>
      </Dialog>
    </ThemeProvider>
  )
}
