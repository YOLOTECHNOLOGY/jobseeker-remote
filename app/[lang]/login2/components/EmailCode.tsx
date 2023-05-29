import React from 'react'
import styles from '../index.module.scss'
import Captcha from './captcha/index'

function EmailCode() {
  return (
    <div className={styles.phoneNumber}>
      <div className={styles.optBox}>
        <h2>
          Enable two-factor <br /> authentication 🔒
        </h2>
        <p className={styles.enterTips}>
          Please enter the 6-digit code that we sent to
          <span>johndoe@gmail.com.</span>
        </p>
        <Captcha />
        <p className={styles.countdown}>60s</p>
        <button className={styles.btn}>Set this up later</button>
      </div>
    </div>
  )
}

export default EmailCode
