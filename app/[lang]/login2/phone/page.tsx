'use client'
import React, { useEffect, useState } from 'react'
import styles from '../index.module.scss'
import VerifyPhone from '../components/verifyPhone'
import VerifyEmail from '../components/verifyEmail'
import { useSearchParams } from 'next/navigation'
import LoginForPhone from '../components/loginForPhone'
import PhoneCode from '../components/PhoneCode'
import EmailFactor from '../components/EmailFactor'
import EmailCode from '../components/EmailCode'
import VerifyFactorEmail from '../components/VerifyFactorEmail'
import FactorEnable from '../components/FactorEnable'

const PhoneLogin = () => {
  const searchParams = useSearchParams()
  const search = searchParams.get('step')
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (search) {
      setStep(Number(search))
    }
  }, [search])

  return (
    <div className={styles.main}>
      <div className={styles.bg}></div>
      <div className={styles.container}>
        {step === 1 &&  <LoginForPhone/>}
        {step === 2 && <PhoneCode />}
        {step === 3 && <EmailFactor />}
        {step === 4 && <EmailCode />}
        {step === 5 && <FactorEnable />}
        {step === 6 && <VerifyPhone />}
        {step === 7 && <VerifyEmail />}
        {step === 8 && <VerifyFactorEmail />}
      </div>
    </div>
  )
}

export default PhoneLogin
