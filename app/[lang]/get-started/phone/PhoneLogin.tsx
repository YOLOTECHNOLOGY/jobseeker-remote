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

interface IProps {
  lang: any;
}

const PhoneLogin = (props: IProps) => {
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
        {step === 1 &&  <LoginForPhone lang={props.lang} />}
        {step === 2 && <PhoneCode lang={props.lang} />}
        {step === 3 && <EmailFactor lang={props.lang} />}
        {step === 4 && <EmailCode lang={props.lang} />}
        {step === 5 && <FactorEnable lang={props.lang} />}
        {step === 6 && <VerifyPhone lang={props.lang} />}
        {step === 7 && <VerifyEmail lang={props.lang} />}
        {step === 8 && <VerifyFactorEmail lang={props.lang} />}
      </div>
    </div>
  )
}

export default PhoneLogin
