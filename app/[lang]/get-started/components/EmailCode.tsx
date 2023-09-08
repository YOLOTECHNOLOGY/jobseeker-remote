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
import { cfKey } from 'helpers/cookies'
const EmailCode = (props: any) => {
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
    if (otp?.length === 6) {
      setErrorText('')
      verificationOtp({
        otp,
        email
      }).then((res) => {
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
    const cfToken = sessionStorage.getItem(cfKey)
    authenticationSendEmaillOtp({ email, cf_token: cfToken }).then(() => {
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
    })
      .then((res) => {
        if (res.data) {
          router.push(`/${langKey}/get-started/phone?step=5`)
          // if(userInfo && Object.keys(userInfo).length){
          //   const { data } = userInfo;
          //   defaultLoginCallBack(data)
          //  }else{
          //   router.push('/')
          //  }
        }
      })
      .catch((error) => {
        setErrorText(error?.response?.data?.message)
        dispatch(
          displayNotification({
            open: true,
            message: error?.response?.data?.message || 'error',
            severity: 'error'
          })
        )
      })
  }

  return (
    <div className={styles.phoneNumber}>
      <div className={styles.optBox}>
        <h2>
          {/* {newGetStarted.twoFactor} <br /> {newGetStarted.authentication} 🔒 */}
          {newGetStarted.verifyEmail}
        </h2>
        <p className={styles.enterTips}>
          {newGetStarted.sendCodeDigit}
          {/* <span>{email}.</span> */}
        </p>
        <Captcha
          lang={props.lang}
          autoFocus={true}
          onChange={onChange}
          sendOpt={sendOpt}
          error={errorText}
          number={number}
        />
        <p className={styles.checkYourSpam}>{newGetStarted.checkYourSpam}</p>
        <SetUpLater lang={props.lang} />
      </div>
    </div>
  )
}

export default EmailCode
