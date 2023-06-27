import React from 'react'
import styles from './dialog.module.scss'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Image from 'next/image'
interface dialogProps {
  children: any
  title?: string
  onClose?: () => void
  open: boolean,
  avatar?:string
}

const Dialog = ({ children, title, onClose, open,avatar }: dialogProps) => {
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
                  top: 10,
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            {avatar && <Image src={avatar} width={60} height={60} style={{borderRadius:"50%",margin:"22px 0 0 19px"}} alt=""></Image>}
            <div className={styles.body}>{children}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default Dialog
