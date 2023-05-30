"use client"
import React,{useEffect,useState} from 'react'
import MaterialTextField from 'components/MaterialTextField'
import styles from '../index.module.scss'
import Text from 'components/Text'
import { useFirstRender } from 'helpers/useFirstRender'
import { sendOTP } from 'helpers/interpreters/services/exchangeNumber'
import { useRouter } from 'next/navigation'
import { getLang } from 'helpers/country'
function EmailFactor() {
  
  const [emailError, setEmailError] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const firstRender = useFirstRender()
  const router = useRouter()
  const langKey = getLang();
  useEffect(() => {
    if (firstRender) {
      return
    }
    let errorText = null
    if (!email.length || !/\S+@\S+\.\S+/.test(email)) {
      errorText = "Please enter a valid email address."
    }
    setEmailError(errorText)
  }, [email])

  const goHome = () => {
   console.log(111)
  }

  const sendOTPFun = () => {
    sendOTP({
      code:email
    }).then((res)=>{
      console.log(res)
      router.push(`${langKey}/get-started/person/sttp=4`)
    })


  }

  const errorText = (errorMessage: string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
        {errorMessage}
      </Text>
    )
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
        <div className={styles.item} style={{height:'66px'}}>
          <MaterialTextField 
          className={styles.fullwidth}
           style={{marginBottom:'0'}} 
          label={'Email address'} 
          size='small'
          onChange={(e) => setEmail(e.target.value)}
          error={emailError ? true : false}
           />
          {emailError && errorText(emailError)}
        </div>
        <button className={styles.btn} disabled={!!emailError} onClick={()=>sendOTPFun}>
          Send verification code
        </button>
        <button className={styles.btn} onClick={()=>goHome}>Set this up later</button>
      </div>
    </div>
  )
}

export default EmailFactor
