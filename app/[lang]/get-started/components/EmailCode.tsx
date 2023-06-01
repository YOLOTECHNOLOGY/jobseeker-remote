import React from 'react'
import styles from '../index.module.scss'
import Captcha from './captcha/index'
import {verificationOtp,bindUserEmail} from 'store/services/auth/newLogin'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { getLang } from 'helpers/country'
import SetUpLater from './setUpLater'
function EmailCode(props: any) {
  const { newGetStarted } = props.lang
  const router = useRouter()
  const searchParams = useSearchParams()
  const phoneNum =  '+' + searchParams.get('phone')?.trim?.()
  const email =   searchParams.get('email')
  const langKey = getLang();
  const onChange = (otp) => {
    console.log(otp)
    if(otp?.length === 6 ){
      verificationOtp({
        otp,
        email
      }).then(res=>{
       console.log(res)
        if(res.data.code === 0){
          bindUserEmailFun()
        } else{

        }
      })
    }
  }
  
  const bindUserEmailFun = ()=>{
    bindUserEmail({
      phone_num:phoneNum,
      email,
      is_two_factor_enabled:1
    }).then(res=>{
      console.log(res.data)
      if(res.data){
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
        <Captcha lang={props.lang} autoFocus={true} onChange={onChange}/>
        <SetUpLater lang={props.lang} />
      </div>
    </div>
  )
}

export default EmailCode
