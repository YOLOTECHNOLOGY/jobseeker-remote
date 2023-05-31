import React,{useState} from "react";
import styles from '../index.module.scss'
import Link from 'next/link'
import AppleLogin from './link/apple'
import FacebookLogin from './link/facebook'
import GoogleLogin from './link/google'
import PhoneLink from './link/phone'
import Divider from '@mui/material/Divider'
import classNames from "classnames";
import { useRouter } from 'next/navigation'
import EmailComponent from './emailComponent'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { useDispatch } from 'react-redux'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { getLang } from 'helpers/country'
const loginForEmail = ()=>{
  const router = useRouter()
  const dispatch = useDispatch()
  const langKey = getLang();

   const [email,setEmail] = useState<string>('')
   const [isDisable,setDisable] = useState<boolean>(true)
   const sendOpt =()=>{
      authenticationSendEmaillOtp({ email })
      .then((res) => {
        console.log(res?.data?.data,'res')
        const {user_id} = res?.data?.data ?? {}
        router.push(`${langKey}/get-started/email?step=2&&email=${email}&userId=${user_id}`)
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
    <>
          <h2>Log in or sign up to Bossjob</h2>
         <div className={styles.phoneNumber}>
          <div className={styles.item}>
            <EmailComponent setEmail={setEmail} setDisable={setDisable} email={email}/>
          </div>
          <button className={styles.btn} disabled={isDisable} onClick={sendOpt}>Send verification code</button>

          <p className={styles.msg}>
            I have read and agreed to and
           <Link
            target='_blank'
            href='https://blog.bossjob.ph/terms-and-conditions/'
          >
             Terms of Use
          </Link>
            and
            <Link
            target='_blank'
            href='https://blog.bossjob.ph/terms-and-conditions/'
            //  className={styles.emailLoginContainer_link}
          >
             Privacy Policy
          </Link>
            <span></span>
          </p>
          <p className={styles.tips}>Looking to hire people? Sign up as <span>Employer</span></p>
          </div> 
          <div>
        <div className={classNames([styles.divider, styles.divider_none])}>
          <Divider>or continue with</Divider>
        </div>    
      </div>
      <div className={styles.list}>
        <GoogleLogin />
        <FacebookLogin />
        <AppleLogin />
        <PhoneLink/>
      </div>
     </>
  )
}
export default loginForEmail