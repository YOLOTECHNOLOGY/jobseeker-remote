'use client'
import React, { useState } from 'react'
import styles from '../index.module.scss'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialTextField from 'components/MaterialTextField'
import Captacha from '../components/captcha'

const PhoneLogin = () => {
  const [step, setStep] = useState(1)
  return (
    <div className={styles.main}>
       <div className={styles.bg}></div>
      <div className={styles.container}>
      {step === 1 && (
          <>
          <h2>Log in or sign up to Bossjob</h2>
         <div className={styles.phoneNumber}>
          <div className={styles.item}>
            <MaterialBasicSelect className={styles.fullwidth} label={'Country'} options={[]} />
          </div>
          <div className={styles.item}>
            <MaterialTextField
              className={styles.fullwidth}
              label={'Phone number'}
              size='small'
              type='number'
              sx={{ borderRadius: '8px' }}
            />
          </div>
          <button className={styles.btn}>Send verification code</button>
          <p className={styles.msg}>
            I have read and agreed to and
            <span>Terms of Use</span>
            and
            <span>Privacy Policy</span>
          </p>

          <p className={styles.tips}>Looking to hire people? Sign up as <span>Employer</span></p>
          </div> 
          </>
      )}

     {step === 2 && (
      <div className={styles.phoneNumber}>
        <div className={styles.optBox}>
          <h2>Sign up an account 🎉</h2>
          <p className={styles.enterTips}>
            Please enter the 6-digit code that we have sent to
            <span>+65 98182828.</span>
          </p>
          <Captacha/>
        <p className={styles.countdown}>60s</p> 
        <p className={styles.trouble}>Having trouble? Try to sign up with <span>other options</span></p>
        </div>
      </div>
     )}

     {step === 3 && (
      <div  className={styles.emailFactor}>
          <h2>Enable two-factor <br/>authentication 🔒</h2>
          <p className={styles.secure}>
           Secure your account and receive code on your email
          </p>
          <p className={styles.emailTips}>
          We will ask you for additional code when you log in on a device or browser that we don’t recognise. Please enter the email address to receive the code.
          </p>
          <div className={styles.phoneNumber}>
          <div className={styles.item}>
          <MaterialTextField
              className={styles.fullwidth}
              label={'Email address'}
              size='small'
            />
          </div>
          <button className={styles.btn} disabled>Send verification code</button>
          <button className={styles.btn} >Set this up later</button>
          </div>
      </div>
     )}
    {step === 4 && (
          <div className={styles.phoneNumber}>
            <div className={styles.optBox}>
              <h2>Enable two-factor <br/> authentication 🔒</h2>
              <p className={styles.enterTips}>
              Please enter the 6-digit code that we sent to 
                <span>johndoe@gmail.com.</span>
              </p> 
              <Captacha/>
            <p className={styles.countdown}>60s</p> 
            <button className={styles.btn} >Set this up later</button>
            </div>
          </div>
        )}
      {step === 5 && (
          <div className={styles.enabled}>
              <h2>Two-factor <br/>authentication enabled  ✅</h2>
              <p className={styles.notice}>
              If we notice an attempted login from a device or browser that we don’t recognise, we will ask you for code sent to your email address.
              </p>
          </div>
        )}
    </div>
    </div>
  )
}

export default PhoneLogin
