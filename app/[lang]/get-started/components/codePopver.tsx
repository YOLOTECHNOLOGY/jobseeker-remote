import React from 'react'
import styles from '../index.module.scss'

const codePopver = (props: any) => {
  const { dictionary, isModal = false, qrCode, setQrCode } = props
  const { getStatred } = dictionary
  const { loginUsingSocialMediaOTP, loginUsingQRCode } = getStatred

  return (
    <div className={`${styles.code} ${!isModal ? styles.codePage : ''}`}>
      <div className={styles.codePopver}>
        {qrCode ? loginUsingSocialMediaOTP : loginUsingQRCode}
      </div>
      <div className={styles.codeImg} onClick={() => setQrCode(!qrCode)}>
        <span className={`${qrCode ? 'icon-windows' : 'icon-appqr'}`}></span>
      </div>
    </div>
  )
}
export default codePopver
