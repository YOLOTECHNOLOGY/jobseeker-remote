import React, { useState } from 'react'
import styles from '../index.module.scss'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import MaterialTextField from 'components/MaterialTextField'
import Captacha from './captcha'


const phoneNumber = () => {
  const [step, setStep] = useState(2)
 

  return (
    <div className={styles.phoneNumber}>
      {step === 1 && (
        <>
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
        </>
      )}
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
  )
}

export default phoneNumber
