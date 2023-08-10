import React, { useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import styles from '../index.module.scss'
import SkipModal from './skipModal'
interface btnProps {
  handleClick?: any
  backClick?: () => void
  loading?: boolean
  rightText?: string
  showBack?: boolean
  disabled?: boolean
  backText?: string
  isMobile?: boolean
  skip?: string
  skipText?: string
}
const FootBtn = ({
  handleClick,
  loading,
  backClick,
  rightText,
  showBack = true,
  disabled = false,
  backText = 'back',
  skipText
}: btnProps) => {
  const [showDialog, setDiallog] = useState<boolean>(false)
  const isMobile = document?.body.clientWidth < 750

  const skipClick = () => {
    setDiallog(true)
  }

  return (
    <>
      {showDialog && <SkipModal closeFun={() => setDiallog(false)} />}
      <div className={styles.next}>
        <div className={styles.rightBtnBox}>
          {!isMobile && (
            <span className={styles.skip} onClick={() => setDiallog(true)}>
              {skipText}
            </span>
          )}
          <LoadingButton
            onClick={handleClick}
            loading={loading}
            variant='contained'
            disabled={disabled}
            sx={{
              width: isMobile ? '100%' : '178px',
              height: '60px',
              textTransform: 'capitalize',
              boxShadow: 'none',
              borderRadius: '10px',
              background: '#2378E5'
              // color: '#707070',
            }}
          >
            <span>{rightText}</span>
          </LoadingButton>
        </div>
        {showBack && (
          <div className={styles.rightBtnBox}>
            <LoadingButton
              onClick={isMobile ? skipClick : backClick}
              loading={false}
              variant='contained'
              sx={{
                width: isMobile ? '100%' : '178px',
                height: '60px',
                textTransform: 'capitalize',
                boxShadow: 'none',
                borderRadius: '8px',
                border: '1px solid #E4E4E4',
                background: 'transparent',
                color: '#515151',
                '&:hover': {
                  border: '1px solid #1565c0'
                }
              }}
            >
              <span>{isMobile ? skipText : backText}</span>
            </LoadingButton>
          </div>
        )}
      </div>
    </>
  )
}

export default FootBtn
