import React, { useState } from 'react'
import styles from '../index.module.scss'
import Captcha from './captcha/index'
import { verificationOtp, bindUserEmail } from 'store/services/auth/newLogin'
import { useSearchParams } from 'next/navigation'
import SetUpLater from './setUpLater'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { getLang } from 'helpers/country'
const EmailCode = (props: any)=> {
  const { newGetStarted } = props.lang
  const langKey = getLang()

  const searchParams = useSearchParams()
  const phoneNum = '+' + searchParams.get('phone')?.trim?.()
  const email = searchParams.get('email')
  const [errorText, setErrorText] = useState<string>('')
  const router = useRouter()
  const [number, setNumber] = useState<number>(0)

  const dispatch = useDispatch()
  const onChange = (otp) => {
    console.log(otp)
    if (otp?.length === 6) {
      setErrorText('')
      verificationOtp({
        otp,
        email
      }).then((res) => {
        console.log(res)
        if (res.data?.data) {
          bindUserEmailFun()
        } else {
          setErrorText(newGetStarted.invalidOtp)
        }
      })
    }
  }

  const sendOpt = () => {
    setErrorText('')
    authenticationSendEmaillOtp({ email }).then(() => {
      setNumber(new Date().getTime())
      dispatch(
        displayNotification({
          open: true,
          message: newGetStarted.resendEmailCode,
          severity: 'success'
        })
      )
    })
  }

  const bindUserEmailFun = () => {
   
    bindUserEmail({
      phone_num: phoneNum,
      email,
      is_two_factor_enabled: 1
    }).then((res) => {
      console.log(res.data)
      if (res.data) {
        router.push(`${langKey}/get-started/phone?step=5`)
        // if(userInfo && Object.keys(userInfo).length){
        //   const { data } = userInfo;
        //   defaultLoginCallBack(data)        
        //  }else{
        //   router.push('/')
        //  }

      }
    }).catch((error) => {
      console.log(error,7778888)
      setErrorText(error?.response?.data?.message )
      dispatch(
        displayNotification({
          open: true,
          message: error?.response?.data?.message || 'error' ,
          severity: 'error'
        })
      )
    })
  }

  return (
    <div className={styles.phoneNumber}>
      <div className={styles.optBox}>
        <h2>
          {newGetStarted.twoFactor} <br /> {newGetStarted.authentication} 🔒
        </h2>
        <p className={styles.enterTips}>
          {newGetStarted.sendCodeDigit}
          <span>{email}.</span>
        </p>
        <Captcha
          lang={props.lang}
          autoFocus={true}
          onChange={onChange}
          sendOpt={sendOpt}
          error={errorText}
          number={number}
        />
        <SetUpLater lang={props.lang} />
      </div>
    </div>
  )
}

export default EmailCode
