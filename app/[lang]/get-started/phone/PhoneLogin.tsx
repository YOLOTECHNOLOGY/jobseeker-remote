'use client'
import React, { useEffect, useState } from 'react'
import styles from '../index.module.scss'
import { useSearchParams } from 'next/navigation'
import LoginForPhone from '../components/loginForPhone'
import PhoneCode from '../components/PhoneCode'
import EmailFactor from '../components/EmailFactor'
import EmailCode from '../components/EmailCode'
import VerifyFactorEmail from '../components/VerifyFactorEmail'
import FactorEnable from '../components/FactorEnable'
import PhoneChooseEmail from '../components/PhoneChooseEmail'
import LeftBanner from '../components/leftBanner'
import CodePopver from '../components/codePopver'
import QrCodeComponent from '../components/QrCode'
interface IProps {
  lang: any
}

const PhoneLogin = (props: IProps) => {
  const { lang } = props
  const searchParams = useSearchParams()
  const search = searchParams.get('step')
  const [step, setStep] = useState(1)
  const [qrCode, setQrCode] = useState<boolean>(false)

  useEffect(() => {
    const hasStep = [1, 2, 3, 4, 5, 6, 7].includes(+search)
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
              {step === 1 && <LoginForPhone lang={props.lang} />}
              {step === 2 && <PhoneCode lang={props.lang} />}
              {step === 3 && <EmailFactor lang={props.lang} />}
              {step === 4 && <EmailCode lang={props.lang} />}
              {step === 5 && <FactorEnable lang={props.lang} />}
              {step === 6 && <VerifyFactorEmail lang={props.lang} />}
              {step === 7 && <PhoneChooseEmail lang={props.lang} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PhoneLogin
