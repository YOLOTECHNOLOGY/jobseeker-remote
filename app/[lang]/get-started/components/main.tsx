'use client'
import React, { useEffect } from 'react'
import styles from '../index.module.scss'
import Divider from '@mui/material/Divider'
import PhoneLink from './link/phone'
import EmailLink from './link/email'
import AppleLogin from './link/apple'
import FacebookLogin from './link/facebook'
import GoogleLogin from './link/google'
import { useSelector } from 'react-redux'
import { removeItem } from 'helpers/localStorage'
import useGetStarted from '../hooks/useGetStarted'

interface IProps {
  dictionary: any
}

const Main = (props: IProps) => {
  const { dictionary } = props
  const { newGetStarted } = dictionary
  const { defaultLoginCallBack } = useGetStarted()

  const jobseekersSocialResponse = useSelector(
    (store: any) => store.auth.jobseekersSocialLogin?.response
  )

  useEffect(() => {
    const { data } = jobseekersSocialResponse
    if (data?.token) {
      removeItem('quickUpladResume')
      defaultLoginCallBack(data)
    }
  }, [jobseekersSocialResponse?.data])

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
