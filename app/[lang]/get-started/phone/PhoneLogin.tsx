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
  isModal?: boolean
  stepModal?: number
  setLoginData?: any
  handleEmailClick?: () => void
  loginData?: any
  setLoginType?: (e: any) => void
}

const PhoneLogin = (props: IProps) => {
  const {
    lang,
    isModal = false,
    stepModal,
    setLoginData,
    handleEmailClick,
    loginData,
    setLoginType
  } = props
  console.log(props, 999)
  const searchParams = useSearchParams()
  const search = searchParams.get('step')
  const [step, setStep] = useState(1)
  const [qrCode, setQrCode] = useState<boolean>(false)

  useEffect(() => {
    const hasStep = [1, 2, 3, 4, 5, 6, 7].includes(+search)
    if (isModal) {
      setStep(stepModal)
      return
    }
    if (search && hasStep) {
      setStep(Number(search))
    } else {
      setStep(1)
    }
  }, [search, stepModal, isModal])

  const main = (
    <div className={styles.container}>
      <LeftBanner />
      <div className={styles.rightContainer}>
        <CodePopver setQrCode={setQrCode} qrCode={qrCode} dictionary={lang} isModal={isModal} />
        {qrCode ? (
          <QrCodeComponent lang={lang} />
        ) : (
          <>
            {step === 1 && (
              <LoginForPhone
                lang={props.lang}
                isModal={isModal}
                setLoginData={setLoginData}
                handleEmailClick={handleEmailClick}
              />
            )}
            {step === 2 && (
              <PhoneCode
                lang={props.lang}
                setStep={setLoginType}
                isModal={isModal}
                loginData={loginData}
              />
            )}
            {step === 3 && <EmailFactor lang={props.lang} />}
            {step === 4 && <EmailCode lang={props.lang} />}
            {step === 5 && <FactorEnable lang={props.lang} />}
            {step === 6 && <VerifyFactorEmail lang={props.lang} />}
            {step === 7 && <PhoneChooseEmail lang={props.lang} />}
          </>
        )}
      </div>
    </div>
  )

  return (
    <>
      {isModal ? (
        main
      ) : (
        <div className={styles.main}>
          <div className={styles.bg}></div>
          {main}
        </div>
      )}
    </>
  )
}

export default PhoneLogin
