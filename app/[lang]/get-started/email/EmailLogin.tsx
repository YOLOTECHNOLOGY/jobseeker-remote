'use client'
import React, { useEffect, useState } from 'react'
import styles from '../index.module.scss'
import VerifyEmail from '../components/verifyEmail'
import { useSearchParams } from 'next/navigation'
import LoginForEmail from '../components/loginForEmail'
import LeftBanner from '../components/leftBanner'
import CodePopver from '../components/codePopver'
import QrCodeComponent from '../components/QrCode'
interface IProps {
  lang: any
}

const EmailLogin = (props: IProps) => {
  const { lang } = props
  const searchParams = useSearchParams()
  const search = searchParams.get('step')
  const [step, setStep] = useState(1)
  const [qrCode, setQrCode] = useState<boolean>(false)
  useEffect(() => {
    const hasStep = [1, 2].includes(+search)
    if (search && hasStep) {
      setStep(Number(search))
    } else {
      setStep(1)
    }
  }, [search])

  return (
    <div className={styles.main}>
      <div className={styles.bg}></div>
      <div className={styles.container}>
        <LeftBanner />
        <div className={styles.rightContainer}>
          <CodePopver setQrCode={setQrCode} qrCode={qrCode} dictionary={lang} isModal={false} />
          {qrCode ? (
            <QrCodeComponent lang={lang} />
          ) : (
            <>
              {step === 1 && <LoginForEmail lang={props.lang} />}
              {step === 2 && <VerifyEmail lang={props.lang} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailLogin
