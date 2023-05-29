import React, { useState } from 'react'
import Captcha from './captcha/index'
import styles from '../index.module.scss'

interface IProps {
  phone: string
  avatar: string
}

const verifyPhone: React.FC = function (props: IProps) {
  const { phone, avatar } = props

  return (
    <>
      <div className={styles.phoneNumber}>
        <div className={styles.optBox}>
          <h2>Welcome back, John 🎉</h2>
          <p className={styles.enterTips}>
            Please enter the 6-digit code that we sent to{' '}
            <span className={styles.phone_text}>johndoe@gmail.com</span>
          </p>
          <div className={styles.avatar}>
            <img
              className={styles.avatar_img}
              src='https://dev-assets.bossjob.com/users/2847285/avatars/b.jpeg'
              alt='avatar'
            />
          </div>
          <Captcha />
          <p className={styles.countdown}>60s</p>
          <div>
            <div>Check your spam mail if you didn’t receive code.</div>
            <div>Still having trouble? Try to sign up with <span className={styles.link}>other options</span></div>
            <div>Alternatively, request a <span className={styles.link}>magic link</span></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default verifyPhone
