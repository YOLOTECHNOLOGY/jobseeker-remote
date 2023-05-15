import { useMemo } from 'react'
import { Snackbar, SnackbarOrigin } from '@mui/material'

import styles from './SnackbarTips.module.scss'
import useWindowDimensions from 'helpers/useWindowDimensions'
import { ErrorOutline, Close } from '@mui/icons-material'

type SnackbarTipsProps = {
  show: boolean
  onDismiss: () => void
  title?: string
  errorMessage?: string
}

// todo: in the feature, maybe we can improve this as a global component
export const SnackbarTips = ({
  show,
  onDismiss,
  title = 'File exceed limit',
  errorMessage = 'Please upload file size lesser than 5MB.'
}: SnackbarTipsProps) => {
  const { width } = useWindowDimensions()
  const isMobile = width < 768
  const origin = useMemo<SnackbarOrigin>(() => {
    return isMobile
      ? { vertical: 'top', horizontal: 'right' }
      : {
          vertical: 'bottom',
          horizontal: 'left'
        }
  }, [isMobile])

  return (
    <Snackbar
      autoHideDuration={4000}
      anchorOrigin={origin}
      onClose={onDismiss}
      open={show}
      className={styles.SnackbarTips}
      message={
        <div className={styles.innerWrapper}>
          <ErrorOutline color='error' />
          <div className={styles.messageWrapper}>
            <div className={styles.header}>{title}</div>
            <div className={styles.content}>{errorMessage}</div>
          </div>
          <Close style={{ cursor: 'pointer' }} onClick={onDismiss} />
        </div>
      }
    />
  )
}
