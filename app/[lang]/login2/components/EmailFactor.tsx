"use client"
import React,{useState} from 'react'
import styles from '../index.module.scss'
import { useRouter } from 'next/navigation'
import { getLang } from 'helpers/country'
import  EmailComponent from './emailComponent'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { useDispatch, } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

import SetUpLater from './setUpLater'
import { useSearchParams } from 'next/navigation'

function EmailFactor() {
  
  const [isDisable, setDisable] = useState<boolean>(true)
  const [email, setEmail] = useState<string>('')
  const searchParams = useSearchParams()
  const phoneNum =  '+' + searchParams.get('phone')?.trim?.()
  const dispatch = useDispatch()
  const router = useRouter()
  const langKey = getLang();
  

  const sendOTPFun = () => {
    console.log(999);
    
    authenticationSendEmaillOtp({ email })
    .then((res) => {
      console.log(res?.data?.data,'res')
      router.push(`${langKey}/get-started/phone?step=4&&phone=${phoneNum}&email=${email}`)
    })
    .catch((error) => {
      dispatch(
        displayNotification({
          open: true,
          message: error.message ?? 'Send EmailOTP fail',
          severity: 'error'
        })
      )
    })
}
  

 

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
        <EmailComponent setEmail={setEmail} setDisable={setDisable} email={email}/>
        </div>
        <button className={styles.btn} disabled={isDisable} onClick={()=>sendOTPFun()}>
          Send verification code
        </button>
        <SetUpLater/>
      </div>
    </div>
  )
}

export default EmailFactor
