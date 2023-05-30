'use client'
import React from 'react'
import styles from '../index.module.scss'
import Divider from '@mui/material/Divider';
import PhoneLink from './link/phone';
import EmailLink from './link/email'
import AppleLogin from './link/apple'
import FacebookLogin from './link/facebook'
import GoogleLogin from './link/google'


const Main = () => {
  return (
    <>
      <div className={styles.list}>
        <GoogleLogin />
        <FacebookLogin />
        <AppleLogin />
      </div>
      <div className={styles.divider}>
        <Divider>or continue with</Divider>
      </div>
      <ul className={`${styles.list} ${styles.listEmail}`}>
      <EmailLink/>
      <PhoneLink/>
      </ul>
    </>
  )
}
export default Main
