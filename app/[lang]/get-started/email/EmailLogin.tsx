'use client'
import React, { useEffect, useState } from 'react'
import styles from '../index.module.scss'
import VerifyEmail from '../components/verifyEmail'
import { useSearchParams } from 'next/navigation'
import LoginForEmail from '../components/loginForEmail'

interface IProps {
    lang: any
}


const EmailLogin = (props: IProps) => {
  const searchParams = useSearchParams()
  const search = searchParams.get('step')
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (search && [1,2].includes(+search)) {
      setStep(Number(search))
    }else {
      setStep(1)
    }
  }, [search])

  return (
    <div className={styles.main}>
      <div className={styles.bg}></div>
      <div className={styles.container}>
        {step === 1 &&  <LoginForEmail lang={props.lang} />}
        {step === 2 && <VerifyEmail lang={props.lang} />}
      </div>
    </div>
  )
}

export default EmailLogin
