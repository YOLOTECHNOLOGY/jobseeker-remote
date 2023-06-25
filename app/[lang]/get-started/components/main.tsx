'use client'
import React, { useEffect } from 'react'
import styles from '../index.module.scss'
import Divider from '@mui/material/Divider'
import PhoneLink from './link/phone'
import EmailLink from './link/email'
import AppleLogin from './link/apple'
import FacebookLogin from './link/facebook'
import GoogleLogin from './link/google'
import { useDispatch } from 'react-redux'
import { jobbseekersLoginSuccess } from 'store/actions/auth/jobseekersLogin'
import {jobbseekersSocialLoginSuccess} from 'store/actions/auth/jobseekersSocialLogin'
interface IProps {
  dictionary: any,
  isModal?:boolean,
  handleEmailClick?:()=>void,
  handlePhoneClick?:()=>void,
}

const Main = (props: IProps) => {
  const { dictionary,isModal = false,handleEmailClick,handlePhoneClick } = props
  const { newGetStarted } = dictionary
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(jobbseekersLoginSuccess({}))
    dispatch(jobbseekersSocialLoginSuccess({}))
  },[])

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
        <EmailLink lang={dictionary} isModal={isModal} handleClick={handleEmailClick}/>
        <PhoneLink lang={dictionary} isModal={isModal} handleClick={handlePhoneClick}/>
      </ul>
    </>
  )
}
export default Main
