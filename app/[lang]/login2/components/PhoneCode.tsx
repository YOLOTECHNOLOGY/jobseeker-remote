import React from 'react'
import styles from '../index.module.scss'
import Captcha from './captcha/index'

function PhoneCode() {
   
  const onChange = (code) => {
    console.log(code)
  }

  return (
    <>
      <div className={styles.phoneNumber}>
        <div className={styles.optBox}>
          <h2>Sign up an account 🎉</h2>
          <p className={styles.enterTips}>
            Please enter the 6-digit code that we have sent to
            <span>+65 98182828.</span>
          </p>
          <Captcha onChange={onChange}/>
          <p className={styles.countdown}>60s</p>
          <p className={styles.trouble}>
            Having trouble? Try to sign up with <span>other options</span>
          </p>
        </div>
      </div>
    </>
  )
}

export default PhoneCode
