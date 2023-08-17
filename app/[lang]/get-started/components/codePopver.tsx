import React from 'react'
import styles from '../index.module.scss'
const codePopver = (props: any) => {
  const { dictionary, isModal = false, qrCode, setQrCode } = props
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
     
    </div>
  )
}
export default codePopver
