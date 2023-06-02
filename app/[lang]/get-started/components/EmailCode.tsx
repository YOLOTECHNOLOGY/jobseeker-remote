import React, { useState } from 'react'
import styles from '../index.module.scss'
import Captcha from './captcha/index'
import { verificationOtp, bindUserEmail } from 'store/services/auth/newLogin'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { getLang } from 'helpers/country'
import SetUpLater from './setUpLater'
import { authenticationSendEmaillOtp } from 'store/services/auth/generateEmailOtp'
import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { useDispatch } from 'react-redux'
function EmailCode(props: any) {
  const { newGetStarted } = props.lang
  const router = useRouter()
  const searchParams = useSearchParams()
  const phoneNum = '+' + searchParams.get('phone')?.trim?.()
  const email = searchParams.get('email')
  const [errorText, setErrorText] = useState<string>('')
  const langKey = getLang()
  const [number, setNumber] = useState<number>(0)
  const dispatch = useDispatch()
  const onChange = (otp) => {
    console.log(otp)
    if (otp?.length === 6) {
      verificationOtp({
        otp,
        email
      }).then((res) => {
        console.log(res)
        if (res.data?.data) {
          bindUserEmailFun()
        } else {
          setErrorText('Invalid otp')
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
          message: 'resend emailOPT success',
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
        router.push(`${langKey}/get-started/phone?step=4&&phone=${phoneNum}&email=${email}`)
      }
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
