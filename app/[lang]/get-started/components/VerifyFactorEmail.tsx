import React, { useState } from 'react'
import Captcha from './captcha/index'
import styles from '../index.module.scss'

interface IProps {
  phone: string
  avatar: string
}

const VerifyFactorEmail: React.FC = function (props: IProps) {
  const { phone, avatar } = props

  return (
    <>
      <div className={styles.phoneNumber}>
        <div className={styles.optBox}>
          <h2>Verify it’s you</h2>
          <div className={styles.enterTips}>
            <p>This extra step show that it is really you trying to log in. </p>
            <p>Please enter the 6-digit code that we sent to jo*****@bossjob.com.</p>
          </div>
          <Captcha />
          <p className={styles.countdown}>60s</p>
        </div>
      </div>
    </>
  )
}

export default VerifyFactorEmail
