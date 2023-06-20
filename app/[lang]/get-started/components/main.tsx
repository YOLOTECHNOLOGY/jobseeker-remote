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
import { useDispatch } from 'react-redux'
import { jobbseekersLoginSuccess } from 'store/actions/auth/jobseekersLogin'
interface IProps {
  dictionary: any,
  isModal?:boolean,
  handleEmailClick?:()=>void,
  handlePhoneClick?:()=>void,
}

const Main = (props: IProps) => {
  const { dictionary,isModal = false,handleEmailClick,handlePhoneClick } = props
  const { newGetStarted } = dictionary
  const { defaultLoginCallBack } = useGetStarted()
  const dispatch = useDispatch()
  const jobseekersSocialResponse = useSelector(
    (store: any) => store.auth.jobseekersSocialLogin?.response
  )

  useEffect(()=>{
    dispatch(jobbseekersLoginSuccess({}))
  },[])

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
        <EmailLink lang={dictionary} isModal={isModal} handleClick={handleEmailClick}/>
        <PhoneLink lang={dictionary} isModal={isModal} handleClick={handlePhoneClick}/>
      </ul>
    </>
  )
}
export default Main
