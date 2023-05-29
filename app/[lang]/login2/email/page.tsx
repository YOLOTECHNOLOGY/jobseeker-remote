'use client'
import React, { useEffect, useState } from 'react'
import styles from '../index.module.scss'
import VerifyEmail from '../components/verifyEmail'
import { useSearchParams } from 'next/navigation'
import LoginForEmail from '../components/loginForEmail'

const EmailLogin = () => {
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
        {step === 1 &&  <LoginForEmail/>}
        {step === 2 && <VerifyEmail />}
      </div>
    </div>
  )
}

export default EmailLogin
