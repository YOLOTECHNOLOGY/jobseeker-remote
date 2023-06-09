'use client'
import React from 'react'
import styles from '../index.module.scss'
import Divider from '@mui/material/Divider'
import PhoneLink from './link/phone'
import EmailLink from './link/email'
import AppleLogin from './link/apple'
import FacebookLogin from './link/facebook'
import GoogleLogin from './link/google'

interface IProps {
  dictionary: any
}

const Main = (props: IProps) => {
  const { dictionary } = props
  const { newGetStarted } = dictionary

  return (
    <>
      <div className={styles.list}>
        <GoogleLogin lang={dictionary} />
        <FacebookLogin lang={dictionary} />
        <AppleLogin lang={dictionary} />
      </div>
      <div className={styles.divider}>
        <Divider>{newGetStarted.continueWith}</Divider>
      </div>
      <ul className={`${styles.list} ${styles.listEmail}`}>
        <EmailLink lang={dictionary} />
        <PhoneLink lang={dictionary} />
      </ul>
    </>
  )
}
export default Main
