'use client'
import React, { useEffect, useState, useRef } from 'react'
import styles from '../index.module.scss'
import Divider from '@mui/material/Divider'
import PhoneLink from './link/phone'
import EmailLink from './link/email'
import AppleLogin from './link/apple'
import FacebookLogin from './link/facebook'
import GoogleLogin from './link/google'
import { useDispatch } from 'react-redux'
import { jobbseekersLoginSuccess } from 'store/actions/auth/jobseekersLogin'
import { jobbseekersSocialLoginSuccess } from 'store/actions/auth/jobseekersSocialLogin'
import QrCodeComponent from './QrCode'
import LeftBanner from './leftBanner'
import CodePopver from './codePopver'
interface IProps {
  dictionary: any
  isModal?: boolean
  handleEmailClick?: () => void
  handlePhoneClick?: () => void
}

const Main = (props: IProps) => {
  const { dictionary, isModal = false, handleEmailClick, handlePhoneClick } = props
  const { newGetStarted } = dictionary
  const dispatch = useDispatch()
  const [qrCode, setQrCode] = useState<boolean>(false)

  useEffect(() => {
    dispatch(jobbseekersLoginSuccess({}))
    dispatch(jobbseekersSocialLoginSuccess({}))
  }, [])

  return (
    <>
      <LeftBanner />
      <div className={styles.rightContainer}>
        <CodePopver
          setQrCode={setQrCode}
          qrCode={qrCode}
          dictionary={dictionary}
          isModal={isModal}
        />
        {qrCode ? (
          <QrCodeComponent lang={dictionary} />
        ) : (
          <>
            <h2>
              {newGetStarted.title} <span>Bossjob</span>
            </h2>
            <div className={styles.list}>
              <GoogleLogin lang={dictionary} />
              <FacebookLogin lang={dictionary} />
              <AppleLogin lang={dictionary} />
            </div>
            <div className={styles.divider}>
              <Divider>{newGetStarted.continueWith}</Divider>
            </div>
            <ul className={`${styles.list} ${styles.listEmail}`}>
              <EmailLink lang={dictionary} isModal={isModal} handleClick={handleEmailClick} />
              <PhoneLink lang={dictionary} isModal={isModal} handleClick={handlePhoneClick} />
            </ul>
          </>
        )}
      </div>
    </>
  )
}
export default Main
