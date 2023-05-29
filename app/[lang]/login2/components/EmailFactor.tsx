import React from 'react'
import MaterialTextField from 'components/MaterialTextField'
import styles from '../index.module.scss'

function EmailFactor() {
  return (
    <div className={styles.emailFactor}>
      <h2>
        Enable two-factor <br />
        authentication 🔒
      </h2>
      <p className={styles.secure}>Secure your account and receive code on your email</p>
      <p className={styles.emailTips}>
        We will ask you for additional code when you log in on a device or browser that we don’t
        recognise. Please enter the email address to receive the code.
      </p>
      <div className={styles.phoneNumber}>
        <div className={styles.item}>
          <MaterialTextField className={styles.fullwidth} label={'Email address'} size='small' />
        </div>
        <button className={styles.btn} disabled>
          Send verification code
        </button>
        <button className={styles.btn}>Set this up later</button>
      </div>
    </div>
  )
}

export default EmailFactor
