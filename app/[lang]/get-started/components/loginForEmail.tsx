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
import { usePathname } from "next/navigation";
import { formatTemplateString } from "helpers/formatter";

interface IProps {
  lang: any;
}

const loginForEmail = (props: IProps)=>{
  const router = useRouter()
  const dispatch = useDispatch()
  const { lang: { newGetStarted } } = props

  const [email,setEmail] = useState<string>('')
  const [isDisable,setDisable] = useState<boolean>(true)
  const pathname = usePathname()

   const sendOpt =()=>{
      authenticationSendEmaillOtp({ email })
      .then((res) => {
        const {user_id} = res?.data?.data ?? {}
        router.push(`${pathname}?step=2&&email=${email}&userId=${user_id}`)
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


  const agreementWord = formatTemplateString(newGetStarted.agreement, {
    value1: `<a
        target='_blank'
        href='https://blog.bossjob.ph/terms-and-conditions/' rel="noreferrer"
      >
          ${newGetStarted.termsOfUse}
      </a>`
    ,
    value2: 
      `<a
        target='_blank'
        href='https://blog.bossjob.ph/terms-and-conditions/' rel="noreferrer"
      >
        ${newGetStarted.privacyPolicy}
      </a>`
    ,
  })

  return (
    <>
          <h2>{newGetStarted.title}</h2>
         <div className={styles.phoneNumber}>
          <div className={styles.item}>
            <EmailComponent lang={props.lang} setEmail={setEmail} setDisable={setDisable} email={email}/>
          </div>
          <button className={styles.btn} disabled={isDisable} onClick={sendOpt}>{newGetStarted.sendCode}</button>

          <p className={styles.msg} dangerouslySetInnerHTML={{ __html: agreementWord }}></p>
          <p className={styles.tips}>{newGetStarted.tips} <span>{newGetStarted.employer}</span></p>
          </div> 
          <div>
        <div className={classNames([styles.divider, styles.divider_none])}>
          <Divider>{newGetStarted.continueWith}</Divider>
        </div>    
      </div>
      <div className={styles.list}>
        <GoogleLogin lang={props.lang} />
        <FacebookLogin lang={props.lang} />
        <AppleLogin lang={props.lang} />
        <PhoneLink lang={props.lang} />
      </div>
     </>
  )
}
export default loginForEmail