import React from 'react'
import styles from '../index.module.scss'
import Link from 'next/link'
const codePopver = (props: any) => {
  const { dictionary, isModal = false, qrCode, setQrCode, lang } = props
  const { getStatred, newGetStarted } = dictionary
  const { loginUsingSocialMediaOTP, loginUsingQRCode } = getStatred
  const haderCom = (
    <div className={styles.codePopver}>{qrCode ? loginUsingSocialMediaOTP : loginUsingQRCode}</div>
  )

  const mainCom = (
    <div
      className={`${styles.codeImg} ${isModal && qrCode ? styles.iconWindows : ''}`}
      onClick={() => setQrCode(!qrCode)}
    >
      <span className={`${qrCode ? 'icon-windows' : 'icon-appqr'}`}></span>
    </div>
  )

  return (
    <div className={`${styles.code} ${isModal ? styles.codePage : ''}`}>
      {isModal ? (
        <>
          {mainCom}
          {haderCom}
        </>
      ) : (
        <>
          {haderCom}
          {mainCom}
        </>
      )}
      {!isModal && (
        <p className={styles.tips}>
          {newGetStarted.tips}{' '}
          <Link
            href={
              process.env.ENV === 'development'
                ? 'https://dev.employer.bossjob.com'
                : 'https://employer.bossjob.com'
            }
            className={styles.AuthCTALink}
          >
            {newGetStarted.employer}
          </Link>
        </p>
      )}
    </div>
  )
}
export default codePopver
