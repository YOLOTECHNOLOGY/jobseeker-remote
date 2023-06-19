import React from 'react'
import styles from './dialog.module.scss'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
interface dialogProps {
  children: any
  title?: string
  onClose?: () => void
  open: boolean
}

const Dialog = ({ children, title, onClose, open }: dialogProps) => {
  return (
    <>
      {open && (
        <div className={styles.dialog}>
          <div className={styles.bg}></div>
          <div className={styles.container}>
            <div className={styles.header}>
              {title}{' '}
              <IconButton
                aria-label='close'
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 12,
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <div className={styles.body}>{children}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default Dialog
