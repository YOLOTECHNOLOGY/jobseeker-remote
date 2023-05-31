import React from 'react'
import styles from '../index.module.scss'
import Captcha from './captcha/index'
import {verificationOtp,bindUserEmail} from 'store/services/auth/newLogin'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { getLang } from 'helpers/country'
function EmailCode() {
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
          Enable two-factor <br /> authentication 🔒
        </h2>
        <p className={styles.enterTips}>
          Please enter the 6-digit code that we sent to
          <span>johndoe@gmail.com.</span>
        </p>
        <Captcha autoFocus={true} onChange={onChange}/>
        <button className={styles.btn}>Set this up later</button>
      </div>
    </div>
  )
}

export default EmailCode
